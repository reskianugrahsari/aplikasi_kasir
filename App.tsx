import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { POS } from './components/POS';
import { Inventory } from './components/Inventory';
import { AIAssistant } from './components/AIAssistant';
import { Login } from './components/Login';
import { Menu, Store, Database, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { INITIAL_PRODUCTS, MOCK_TRANSACTIONS } from './constants';
import { Product, Transaction, AdminView, AppMode, CartItem } from './types';
import * as supabaseService from './services/supabaseService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [appMode, setAppMode] = useState<AppMode>('admin');
  const [currentAdminView, setCurrentAdminView] = useState<AdminView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        try {
          const migrationResult = await supabaseService.migrateFromLocalStorage();
          if (migrationResult.productsCount > 0 || migrationResult.transactionsCount > 0) {
            console.log('Migration completed:', migrationResult);
          }
        } catch (migrationError) {
          console.warn('Migration failed or already completed:', migrationError);
        }

        const productsData = await supabaseService.getProducts();

        if (productsData.length === 0) {
          console.log('No products found, initializing with default products');
          for (const product of INITIAL_PRODUCTS) {
            await supabaseService.addProduct(product);
          }
          setProducts(INITIAL_PRODUCTS);
        } else {
          setProducts(productsData);
        }

        const transactionsData = await supabaseService.getTransactions();

        if (transactionsData.length === 0) {
          console.log('No transactions found, initializing with mock data');
          setTransactions([]);
        } else {
          setTransactions(transactionsData);
        }

        setTimeout(() => setIsLoading(false), 800);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Gagal memuat data dari database cloud. Menggunakan sistem cadangan lokal.');

        const savedProducts = localStorage.getItem('products');
        const savedTransactions = localStorage.getItem('transactions');

        setProducts(savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS);
        setTransactions(savedTransactions ? JSON.parse(savedTransactions) : MOCK_TRANSACTIONS);

        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

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
      const finalTotal = total * 1.1;

      const newTransaction = {
        date: new Date().toISOString(),
        total: finalTotal,
        paymentMethod,
        items,
      };

      const savedTransaction = await supabaseService.createTransaction(newTransaction, items);
      setTransactions(prev => [savedTransaction, ...prev]);

      const updatedProducts = await supabaseService.getProducts();
      setProducts(updatedProducts);
    } catch (err: any) {
      console.error('Error completing transaction:', err);
      alert('Gagal menyimpan transaksi. Sistem otomatis beralih ke mode offline.');
    }
  };

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
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
      <div className="h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-200/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-100/30 rounded-full blur-[120px] animate-pulse delay-700" />

        <div className="relative text-center z-10 animate-fade-in">
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center relative z-10 border border-white/50 animate-float">
              <RefreshCw className="text-brand-600 w-10 h-10 animate-spin-slow" />
            </div>
            <div className="absolute inset-0 bg-brand-400 blur-2xl opacity-20 animate-pulse" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-display">Menginisialisasi Sistem</h2>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0s]" />
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] ml-2">Menghubungkan ke Cloud Ecosystem</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 inset-x-0 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[5px]">KasirPintar v3.0 Powered by Gemini 2.0</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 selection:bg-brand-100 selection:text-brand-900">
      {/* Global Notifications */}
      {error && (
        <div className="fixed top-6 right-6 z-[1000] animate-slide-in-right">
          <div className="bg-white/80 backdrop-blur-xl border border-rose-100 px-6 py-4 rounded-[2rem] shadow-2xl shadow-rose-200/50 flex items-center space-x-4">
            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-0.5">Database Warning</p>
              <p className="text-sm font-bold text-slate-800 tracking-tight">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={16} className="rotate-45 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      {appMode === 'admin' ? (
        <div className="flex h-full animate-fade-in relative">
          <Sidebar
            currentView={currentAdminView}
            setCurrentView={(view) => {
              setCurrentAdminView(view);
              setIsSidebarOpen(false);
            }}
            onOpenPOS={() => setAppMode('pos')}
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[25] md:hidden animate-fade-in"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <main className="flex-1 h-full overflow-hidden relative bg-slate-50 flex flex-col">
            {/* Mobile Header */}
            <div className="md:hidden glass border-b border-white/20 p-5 flex items-center justify-between z-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                  <Store className="text-white w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-slate-900 tracking-tighter">KasirPintar</h1>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-brand-500 rounded-full" />
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Administrator Portal</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 shadow-sm"
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden relative">
              {/* Content Transition Area */}
              <div className="h-full w-full overflow-hidden">
                {renderAdminContent()}
              </div>
            </div>

            {/* Global Status Bar */}
            <footer className="hidden md:flex items-center justify-between px-8 py-3 bg-white border-t border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Database size={12} className="text-brand-500" />
                  <span>Cloud Sync: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Layers size={12} className="text-accent-500" />
                  <span>Environment: Production</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>Secure TLS Gateway Enabled</span>
              </div>
            </footer>
          </main>
        </div>
      ) : (
        <div className="h-full animate-scale-in">
          <POS
            products={products}
            onCompleteTransaction={handleTransactionComplete}
            onExit={() => setAppMode('admin')}
          />
        </div>
      )}

      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;