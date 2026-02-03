import React, { useState, useMemo } from 'react';
import { Product, CartItem, Category } from '../types';
import { Search, Plus, Minus, CreditCard, Banknote, ShoppingBag, Store, LayoutDashboard } from 'lucide-react';

interface POSProps {
    products: Product[];
    onCompleteTransaction: (items: CartItem[], paymentMethod: 'cash' | 'qris') => void;
    onExit: () => void;
}

export const POS: React.FC<POSProps> = ({ products, onCompleteTransaction, onExit }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | null>(null);
    const [cashReceived, setCashReceived] = useState<string>('');

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (!paymentMethod) return;

        // Create transaction object
        const newItems = [...cart];
        onCompleteTransaction(newItems, paymentMethod as 'cash' | 'qris');

        // Reset state
        setCart([]);
        setIsCheckingOut(false);
        setPaymentMethod(null);
        setCashReceived('');
    };

    const finalTotal = cartTotal * 1.1;
    const change = Number(cashReceived) - finalTotal;

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* POS Header */}
            <header className="bg-white px-6 py-3 border-b border-gray-200 flex justify-between items-center shadow-sm shrink-0 z-30">
                <div className="flex items-center space-x-3">
                    <div className="bg-emerald-500 text-white p-2 rounded-lg">
                        <Store size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Mode Kasir</h1>
                        <p className="text-xs text-gray-400">KasirPintar POS System</p>
                    </div>
                </div>

                {/* Right Side: Date & Exit */}
                <div className="flex items-center space-x-6">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-gray-800">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-xs text-gray-500">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
                    <button
                        onClick={onExit}
                        className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                        <LayoutDashboard size={18} />
                        <span>Admin Panel</span>
                    </button>
                </div>
            </header>

            {/* Main Content (Grid + Cart) */}
            <div className="flex-1 flex overflow-hidden">
                {/* Product Grid Area */}
                <div className="flex-1 flex flex-col h-full bg-gray-50/50">
                    <div className="px-6 py-4 bg-white border-b border-gray-100 shadow-sm z-20">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Cari produk (Scan Barcode)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white border focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                    autoFocus
                                />
                            </div>

                            <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                                {['All', ...Object.values(Category)].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat as Category | 'All')}
                                        className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group h-full flex flex-col"
                                >
                                    <div className="aspect-square rounded-lg bg-gray-100 mb-3 overflow-hidden relative">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-gray-700 shadow-sm">
                                            {product.category}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{product.name}</h3>
                                    <div className="mt-auto pt-2 flex items-center justify-between">
                                        <p className="text-indigo-600 font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                                        <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <Plus size={14} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cart Sidebar */}
                <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-xl z-20">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-lg font-bold text-gray-800">Keranjang</h3>
                            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">{cart.length} item</span>
                        </div>
                        <p className="text-xs text-gray-500">Order #{Math.floor(Math.random() * 10000)}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingBag size={32} className="opacity-20 text-gray-500" />
                                </div>
                                <p className="font-medium">Keranjang masih kosong</p>
                                <p className="text-sm mt-1">Pilih produk di sebelah kiri untuk mulai transaksi</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h4>
                                        <p className="text-xs text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-1">
                                        <p className="text-sm font-bold text-indigo-600">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white hover:shadow-sm rounded text-gray-600 transition-all">
                                                <Minus size={12} />
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white hover:shadow-sm rounded text-gray-600 transition-all">
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-5 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-gray-500 text-sm">
                                <span>Subtotal</span>
                                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 text-sm">
                                <span>Pajak (10%)</span>
                                <span>Rp {(cartTotal * 0.1).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between items-center">
                                <span className="font-bold text-gray-800">Total Tagihan</span>
                                <span className="font-bold text-xl text-indigo-600">Rp {(cartTotal * 1.1).toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        {/* Improved Checkout Modal */}
                        {isCheckingOut ? (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animation-fade-in">
                                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsCheckingOut(false)}></div>

                                <div className="bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
                                    {/* Left Side: Order Summary */}
                                    <div className="md:w-5/12 bg-gray-50 border-r border-gray-100 flex flex-col h-full">
                                        <div className="p-6 border-b border-gray-200 bg-white">
                                            <h2 className="text-xl font-bold text-gray-800">Ringkasan Pesanan</h2>
                                            <p className="text-sm text-gray-500 mt-1">Order #{Math.floor(Math.random() * 10000)}</p>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                            {cart.map(item => (
                                                <div key={item.id} className="flex items-center space-x-4 bg-white p-3 rounded-xl border border-gray-200">
                                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-semibold text-gray-800">{item.name}</h4>
                                                        <p className="text-xs text-gray-500">{item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}</p>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-800">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-6 bg-white border-t border-gray-200 space-y-3">
                                            <div className="flex justify-between text-gray-500">
                                                <span>Subtotal</span>
                                                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-500">
                                                <span>Pajak (10%)</span>
                                                <span>Rp {(cartTotal * 0.1).toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                                                <span className="text-lg font-bold text-gray-800">Total Tagihan</span>
                                                <span className="text-3xl font-black text-indigo-600">Rp {finalTotal.toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Payment Workflow */}
                                    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
                                        <button
                                            onClick={() => setIsCheckingOut(false)}
                                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-20"
                                        >
                                            <Plus size={24} className="rotate-45" />
                                        </button>

                                        <div className="flex-1 overflow-y-auto p-8 pt-12 md:pt-8">
                                            <div className="max-w-md mx-auto w-full space-y-8 py-4">
                                                {/* Step 1: Payment Method */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center space-x-2 text-indigo-600">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold">1</div>
                                                        <h3 className="font-bold text-lg">Metode Pembayaran</h3>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <button
                                                            onClick={() => setPaymentMethod('cash')}
                                                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group ${paymentMethod === 'cash'
                                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md scale-[1.02]'
                                                                : 'bg-white border-gray-100 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50/30'
                                                                }`}
                                                        >
                                                            <Banknote size={32} className={`mb-3 ${paymentMethod === 'cash' ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                                                            <span className="font-bold">Tunai / Cash</span>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setPaymentMethod('qris');
                                                                setCashReceived('');
                                                            }}
                                                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group ${paymentMethod === 'qris'
                                                                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md scale-[1.02]'
                                                                : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:bg-blue-50/30'
                                                                }`}
                                                        >
                                                            <CreditCard size={32} className={`mb-3 ${paymentMethod === 'qris' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                            <span className="font-bold">QRIS / Digital</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Step 3: Action / Calculator */}
                                                {paymentMethod && (
                                                    <div className="space-y-4 animation-slide-up">
                                                        {paymentMethod === 'cash' ? (
                                                            <div className="bg-indigo-50/50 p-6 rounded-2xl border-2 border-indigo-100 space-y-5">
                                                                <div>
                                                                    <label className="block text-xs font-bold text-indigo-400 uppercase mb-2 ml-1">Uang Diterima</label>
                                                                    <div className="relative">
                                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-indigo-400 text-xl">Rp</span>
                                                                        <input
                                                                            type="number"
                                                                            autoFocus
                                                                            value={cashReceived}
                                                                            onChange={(e) => setCashReceived(e.target.value)}
                                                                            className="w-full bg-white border-2 border-indigo-200 rounded-xl pl-14 pr-4 py-4 text-3xl font-black text-indigo-700 focus:border-indigo-500 outline-none shadow-inner"
                                                                            placeholder="0"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {Number(cashReceived) > 0 && (
                                                                    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-indigo-50">
                                                                        <span className="font-bold text-gray-500">Kembalian:</span>
                                                                        <span className={`text-2xl font-black ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                                            Rp {change.toLocaleString('id-ID')}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                <button
                                                                    onClick={handleCheckout}
                                                                    disabled={change < 0 || !cashReceived}
                                                                    className={`w-full py-5 rounded-xl font-black text-xl shadow-lg transition-all active:scale-[0.98] ${change >= 0 && cashReceived
                                                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
                                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                                        }`}
                                                                >
                                                                    Selesaikan Transaksi
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-blue-50/50 p-8 rounded-2xl border-2 border-blue-100 text-center space-y-6">
                                                                <div className="bg-white p-6 rounded-2xl inline-block shadow-md border border-blue-50">
                                                                    <div className="w-48 h-48 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                                                                        <CreditCard size={80} className="text-gray-300" />
                                                                    </div>
                                                                    <p className="text-xs mt-4 text-gray-400 font-mono tracking-widest font-bold">POS-DEVICE-ONLINE</p>
                                                                </div>
                                                                <button
                                                                    onClick={handleCheckout}
                                                                    className="w-full py-5 bg-blue-600 text-white rounded-xl font-black text-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-[0.98]"
                                                                >
                                                                    Konfirmasi Pembayaran QRIS
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsCheckingOut(true)}
                                disabled={cart.length === 0}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center space-x-2 ${cart.length > 0
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <span>Proses Pembayaran</span>
                            </button>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
};