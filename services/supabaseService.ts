import { supabase } from './supabaseClient';
import { Product, Transaction, CartItem, Category } from '../types';

// Database types with timestamps
export interface DatabaseProduct extends Product {
    created_at?: string;
    updated_at?: string;
}

export interface DatabaseTransaction {
    id: string;
    date: string;
    total: number;
    payment_method: 'cash' | 'qris';
    customer_name?: string;
    table_number?: string;
    created_at?: string;
}

export interface DatabaseTransactionItem {
    id?: number;
    transaction_id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    created_at?: string;
}

// ============================================
// PRODUCT OPERATIONS
// ============================================

export const getProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

    return data || [];
};

export const addProduct = async (product: Product): Promise<Product> => {
    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

    if (error) {
        console.error('Error adding product:', error);
        throw error;
    }

    return data;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating product:', error);
        throw error;
    }

    return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// ============================================
// TRANSACTION OPERATIONS
// ============================================

export const getTransactions = async (): Promise<Transaction[]> => {
    // Fetch transactions
    const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

    if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        throw transactionsError;
    }

    if (!transactionsData || transactionsData.length === 0) {
        return [];
    }

    // Fetch all transaction items
    const { data: itemsData, error: itemsError } = await supabase
        .from('transaction_items')
        .select('*');

    if (itemsError) {
        console.error('Error fetching transaction items:', itemsError);
        throw itemsError;
    }

    // Combine transactions with their items
    const transactions: Transaction[] = transactionsData.map((transaction) => {
        const items = (itemsData || [])
            .filter((item) => item.transaction_id === transaction.id)
            .map((item) => ({
                id: item.product_id,
                name: item.product_name,
                price: item.price,
                quantity: item.quantity,
                category: Category.FOOD, // Default category, not stored in transaction_items
                image: '', // Not stored in transaction_items
                stock: 0, // Not relevant for transaction items
            }));

        return {
            id: transaction.id,
            date: transaction.date,
            total: transaction.total,
            paymentMethod: transaction.payment_method,
            customerName: transaction.customer_name,
            tableNumber: transaction.table_number,
            items,
        };
    });

    return transactions;
};

export const createTransaction = async (
    transaction: Omit<Transaction, 'id'>,
    items: CartItem[]
): Promise<Transaction> => {
    // Generate transaction ID
    const transactionId = Date.now().toString();

    // Prepare transaction data
    const transactionDataToInsert = {
        id: transactionId,
        date: transaction.date,
        total: transaction.total,
        payment_method: transaction.paymentMethod,
    };

    // Insert transaction
    const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert([transactionDataToInsert])
        .select()
        .single();

    if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        console.error('Data attempted to insert:', transactionDataToInsert);
        throw transactionError;
    }

    // Insert transaction items
    const transactionItems = items.map((item) => ({
        transaction_id: transactionId,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
    }));

    const { error: itemsError } = await supabase
        .from('transaction_items')
        .insert(transactionItems);

    if (itemsError) {
        console.error('Error creating transaction items:', itemsError);
        // Rollback transaction if items insertion fails
        await supabase.from('transactions').delete().eq('id', transactionId);
        throw itemsError;
    }

    // Update product stock
    for (const item of items) {
        const { data: product } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.id)
            .single();

        if (product) {
            const newStock = Math.max(0, product.stock - item.quantity);
            await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('id', item.id);
        }
    }

    return {
        id: transactionId,
        date: transaction.date,
        total: transaction.total,
        paymentMethod: transaction.paymentMethod,
        items,
    };
};

// ============================================
// MIGRATION FROM LOCALSTORAGE
// ============================================

export const migrateFromLocalStorage = async (): Promise<{
    productsCount: number;
    transactionsCount: number;
}> => {
    let productsCount = 0;
    let transactionsCount = 0;

    try {
        // Check if migration already done
        const migrationFlag = localStorage.getItem('supabase_migration_done');
        if (migrationFlag === 'true') {
            console.log('Migration already completed');
            return { productsCount: 0, transactionsCount: 0 };
        }

        // Migrate products
        const productsJson = localStorage.getItem('products');
        if (productsJson) {
            const products: Product[] = JSON.parse(productsJson);

            // Check if products already exist in Supabase
            const { data: existingProducts } = await supabase
                .from('products')
                .select('id');

            if (!existingProducts || existingProducts.length === 0) {
                for (const product of products) {
                    await addProduct(product);
                    productsCount++;
                }
                console.log(`Migrated ${productsCount} products to Supabase`);
            }
        }

        // Migrate transactions
        const transactionsJson = localStorage.getItem('transactions');
        if (transactionsJson) {
            const transactions: Transaction[] = JSON.parse(transactionsJson);

            // Check if transactions already exist in Supabase
            const { data: existingTransactions } = await supabase
                .from('transactions')
                .select('id');

            if (!existingTransactions || existingTransactions.length === 0) {
                for (const transaction of transactions) {
                    // Insert transaction
                    await supabase.from('transactions').insert([
                        {
                            id: transaction.id,
                            date: transaction.date,
                            total: transaction.total,
                            payment_method: transaction.paymentMethod,
                        },
                    ]);

                    // Insert transaction items
                    const transactionItems = transaction.items.map((item) => ({
                        transaction_id: transaction.id,
                        product_id: item.id,
                        product_name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    }));

                    await supabase.from('transaction_items').insert(transactionItems);
                    transactionsCount++;
                }
                console.log(`Migrated ${transactionsCount} transactions to Supabase`);
            }
        }

        // Mark migration as done
        localStorage.setItem('supabase_migration_done', 'true');

        return { productsCount, transactionsCount };
    } catch (error) {
        console.error('Migration error:', error);
        throw error;
    }
};

// ============================================
// REAL-TIME SUBSCRIPTIONS (Optional)
// ============================================

export const subscribeToProducts = (callback: (products: Product[]) => void) => {
    const channel = supabase
        .channel('products-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'products' },
            async () => {
                const products = await getProducts();
                callback(products);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

export const subscribeToTransactions = (callback: (transactions: Transaction[]) => void) => {
    const channel = supabase
        .channel('transactions-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'transactions' },
            async () => {
                const transactions = await getTransactions();
                callback(transactions);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};
