export enum Category {
  FOOD = 'Makanan',
  DRINK = 'Minuman',
  SNACK = 'Cemilan',
  DESSERT = 'Penutup'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string; // ISO String
  items: CartItem[];
  total: number;
  paymentMethod: 'cash' | 'qris';
}

export interface SalesSummary {
  totalRevenue: number;
  totalTransactions: number;
  topProduct: string;
}

export type AdminView = 'dashboard' | 'inventory' | 'ai-assistant';
export type AppMode = 'admin' | 'pos';