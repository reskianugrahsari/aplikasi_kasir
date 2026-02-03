import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { POS } from './components/POS';
import { Inventory } from './components/Inventory';
import { AIAssistant } from './components/AIAssistant';
import { Login } from './components/Login';
import { INITIAL_PRODUCTS, MOCK_TRANSACTIONS } from './constants';
import { Product, Transaction, AdminView, AppMode, CartItem } from './types';
import * as supabaseService from './services/supabaseService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user was previously logged in
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [appMode, setAppMode] = useState<AppMode>('admin');
  const [currentAdminView, setCurrentAdminView] = useState<AdminView>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data from Supabase when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to migrate data from localStorage first
        try {
          const migrationResult = await supabaseService.migrateFromLocalStorage();
          if (migrationResult.productsCount > 0 || migrationResult.transactionsCount > 0) {
            console.log('Migration completed:', migrationResult);
          }
        } catch (migrationError) {
          console.warn('Migration failed or already completed:', migrationError);
        }

        // Load products from Supabase
        const productsData = await supabaseService.getProducts();

        // If no products in database, use initial products
        if (productsData.length === 0) {
          console.log('No products found, initializing with default products');
          for (const product of INITIAL_PRODUCTS) {
            await supabaseService.addProduct(product);
          }
          setProducts(INITIAL_PRODUCTS);
        } else {
          setProducts(productsData);
        }

        // Load transactions from Supabase
        const transactionsData = await supabaseService.getTransactions();

        // If no transactions in database, use mock transactions
        if (transactionsData.length === 0) {
          console.log('No transactions found, initializing with mock data');
          setTransactions([]);
        } else {
          setTransactions(transactionsData);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Gagal memuat data dari database. Menggunakan data lokal.');

        const savedProducts = localStorage.getItem('products');
        const savedTransactions = localStorage.getItem('transactions');

        setProducts(savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS);
        setTransactions(savedTransactions ? JSON.parse(savedTransactions) : MOCK_TRANSACTIONS);

        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  // Subscribe to real-time updates (optional)
  useEffect(() => {
    const unsubscribeProducts = supabaseService.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });

    const unsubscribeTransactions = supabaseService.subscribeToTransactions((updatedTransactions) => {
      setTransactions(updatedTransactions);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeTransactions();
    };
  }, []);

  const handleTransactionComplete = async (
    items: CartItem[],
    paymentMethod: 'cash' | 'qris'
  ) => {
    try {
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const finalTotal = total * 1.1; // Add tax

      const newTransaction = {
        date: new Date().toISOString(),
        total: finalTotal,
        paymentMethod,
        items,
      };

      // Save to Supabase
      const savedTransaction = await supabaseService.createTransaction(newTransaction, items);

      // Update local state
      setTransactions(prev => [savedTransaction, ...prev]);

      // Refresh products to get updated stock
      const updatedProducts = await supabaseService.getProducts();
      setProducts(updatedProducts);

      console.log(`Transaksi Berhasil! Total: Rp ${finalTotal.toLocaleString('id-ID')}`);
    } catch (err: any) {
      console.error('Error completing transaction:', err);
      const errorMessage = err.message || 'Gagal menyimpan transaksi ke database.';
      const detailMessage = err.details ? `\n\nDetail: ${err.details}` : '';
      const hintMessage = err.hint ? `\n\nSaran Teknis: ${err.hint}` : '';

      alert(`⚠️ Gagal menyimpan transaksi\n\nPesan: ${errorMessage}${detailMessage}${hintMessage}\n\nJika error ini terus muncul, mohon jalankan script SQL terbaru di Dashboard Supabase.`);
    }
  };

  const handleLogin = (username: string, _password?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    // Reset any other session related state if needed
  };

  const renderAdminContent = () => {
    switch (currentAdminView) {
      case 'dashboard':
        return <Dashboard transactions={transactions} products={products} />;
      case 'inventory':
        return <Inventory products={products} setProducts={setProducts} />;
      case 'ai-assistant':
        return <AIAssistant products={products} transactions={transactions} />;
      default:
        return <Dashboard transactions={transactions} products={products} />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {appMode === 'admin' ? (
        <div className="flex h-full animate-fade-in">
          <Sidebar
            currentView={currentAdminView}
            setCurrentView={setCurrentAdminView}
            onOpenPOS={() => setAppMode('pos')}
            onLogout={handleLogout}
          />
          <main className="flex-1 h-full overflow-hidden relative bg-gray-50">
            {/* Header for Admin View could go here if needed, but Dashboard has its own internal header */}
            {renderAdminContent()}
          </main>
        </div>
      ) : (
        <div className="h-full animate-fade-in">
          <POS
            products={products}
            onCompleteTransaction={handleTransactionComplete}
            onExit={() => setAppMode('admin')}
          />
        </div>
      )}
    </div>
  );
};

export default App;