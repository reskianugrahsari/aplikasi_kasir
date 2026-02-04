import React, { useState, useMemo } from 'react';
import { Product, CartItem, Category } from '../types';
import { Search, Plus, Minus, CreditCard, Banknote, ShoppingBag, Store, LayoutDashboard, X, ChevronRight, Hash, Tag, Info } from 'lucide-react';

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
    const [isCartOpen, setIsCartOpen] = useState(false);
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
    const finalTotal = cartTotal * 1.1;
    const change = Number(cashReceived) - finalTotal;

    const handleCheckout = () => {
        if (!paymentMethod) return;
        const newItems = [...cart];
        onCompleteTransaction(newItems, paymentMethod as 'cash' | 'qris');
        setCart([]);
        setIsCheckingOut(false);
        setPaymentMethod(null);
        setCashReceived('');
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
            {/* POS Header */}
            <header className="glass border-b border-white/20 px-8 py-4 flex justify-between items-center z-50 shadow-sm relative text-slate-900">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200 animate-float">
                        <Store className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight font-display text-slate-900">Sistem Kasir Pro</h1>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Terminal Aktif #001</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-8">
                    <div className="hidden lg:flex items-center space-x-4 text-right">
                        <div>
                            <p className="text-sm font-black text-slate-800 tracking-tight">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
                    <button
                        onClick={onExit}
                        className="group flex items-center space-x-3 bg-white text-slate-600 hover:text-brand-600 px-6 py-3 rounded-2xl border border-slate-200 hover:border-brand-200 transition-all duration-300 font-bold shadow-sm hover:shadow-lg hover:shadow-brand-100/50"
                    >
                        <LayoutDashboard size={20} className="group-hover:rotate-12 transition-transform" />
                        <span>Panel Admin</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Product Section */}
                <div className="flex-1 flex flex-col h-full bg-slate-50/50 overflow-hidden">
                    {/* Search & Categories Bar */}
                    <div className="px-8 py-6 glass-dark border-b border-white/10 z-20">
                        <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                            <div className="relative flex-1 max-w-2xl group">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-brand-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Cari produk atau scan barcode..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-white/10 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-brand-500/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all text-lg font-medium"
                                    autoFocus
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">⌘ F</span>
                                </div>
                            </div>

                            <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
                                {['All', ...Object.values(Category)].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat as Category | 'All')}
                                        className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${selectedCategory === cat
                                            ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/30 scale-105 border-transparent'
                                            : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-white/10'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto p-8 no-scrollbar scroll-smooth">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 pb-32">
                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand-200/50 cursor-pointer transition-all duration-500 group flex flex-col relative overflow-hidden transform active:scale-95"
                                >
                                    <div className="aspect-square rounded-2xl bg-slate-50 mb-4 overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-700">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-3 left-3 bg-brand-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white shadow-lg border border-white/20 z-20">
                                            {product.category}
                                        </div>
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-slate-900 border border-slate-200 shadow-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20 whitespace-nowrap">
                                            Tambah ke Keranjang
                                        </div>
                                    </div>
                                    <div className="px-2 pb-2 flex-1 flex flex-col">
                                        <h3 className="font-bold text-slate-800 text-sm mb-2 line-clamp-2 leading-tight group-hover:text-brand-600 transition-colors uppercase tracking-tight">{product.name}</h3>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Harga</p>
                                                <p className="text-brand-600 font-black text-base">Rp {product.price.toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 shadow-sm ring-4 ring-transparent group-hover:ring-brand-100">
                                                <Plus size={20} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cart Control Center */}
                <div className={`fixed inset-y-0 right-0 md:relative md:inset-auto md:translate-x-0 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-full md:w-[420px] glass border-l border-white/20 flex flex-col h-full z-[100] md:z-40 shadow-2xl`}>
                    {/* Cart Header */}
                    <div className="p-8 border-b border-slate-200 bg-white/50 relative overflow-hidden">
                        <div className="absolute -right-12 -top-12 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl" />
                        <div className="flex justify-between items-end relative z-10">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="p-2 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-200">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight font-display">Troli Belanja</h3>
                                </div>
                                <p className="text-[11px] font-bold text-brand-600 uppercase tracking-[3px] ml-1">{cart.length} Produk Terpilih</p>
                            </div>
                            <button onClick={() => setIsCartOpen(false)} className="md:hidden p-3 bg-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-all">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center animate-fade-in relative">
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                    <ShoppingBag size={240} className="text-slate-900" />
                                </div>
                                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6 border border-slate-100 animate-float">
                                    <ShoppingBag size={48} className="text-slate-300" />
                                </div>
                                <h4 className="font-black text-slate-800 text-xl tracking-tight uppercase">Troli Masih Kosong</h4>
                                <p className="text-sm mt-3 text-slate-400 font-medium max-w-[200px] leading-relaxed">Mulai tambahkan produk ke dalam daftar pesanan pelanggan</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="group flex items-center space-x-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-100/30 transition-all duration-300 animate-slide-in-right">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.category}</p>
                                        <h4 className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{item.name}</h4>
                                        <p className="text-brand-600 font-extrabold text-xs mt-1">@ Rp {item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-3">
                                        <p className="text-base font-black text-slate-900 leading-none">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                        <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 border border-slate-200 shadow-inner">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-white active:bg-slate-300 rounded-xl text-slate-600 transition-all shadow-sm">
                                                <Minus size={14} strokeWidth={3} />
                                            </button>
                                            <span className="text-sm font-black w-10 text-center text-slate-900">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-white active:bg-slate-300 rounded-xl text-brand-600 transition-all shadow-sm">
                                                <Plus size={14} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Cart Summary & Action */}
                    <div className="p-8 bg-white border-t border-slate-200 z-20 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.05)]">
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-slate-400">
                                <span className="text-xs font-bold uppercase tracking-[2px]">Subtotal Pesanan</span>
                                <span className="text-sm font-black text-slate-600 font-mono italic">Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400">
                                <span className="text-xs font-bold uppercase tracking-[2px]">Pajak Layanan (10%)</span>
                                <span className="text-sm font-black text-slate-600 font-mono italic">Rp {(cartTotal * 0.1).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="border-t-2 border-dashed border-slate-100 pt-6 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-brand-600 uppercase tracking-[4px]">Grand Total</span>
                                    <span className="text-3xl font-black text-slate-900 tracking-tighter">Rp {finalTotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="p-3 bg-brand-50 rounded-2xl">
                                    <Info size={16} className="text-brand-600" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsCheckingOut(true)}
                            disabled={cart.length === 0}
                            className={`group w-full py-5 rounded-[2rem] font-black text-xl tracking-tight shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 overflow-hidden relative ${cart.length > 0
                                ? 'bg-slate-900 text-white hover:bg-brand-600 hover:shadow-brand-500/50 hover:-translate-y-1 active:scale-[0.98]'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                                }`}
                        >
                            <span className="relative z-10 uppercase tracking-widest text-sm font-black">Lanjutkan Pembayaran</span>
                            <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </button>
                    </div>
                </div>

                {/* Mobile FAB */}
                <div className="md:hidden fixed bottom-8 left-0 right-0 px-8 z-[150]">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className={`w-full py-5 px-8 rounded-[2.5rem] shadow-2xl flex items-center justify-between font-black text-white transition-all duration-500 transform active:scale-95 ${cart.length > 0 ? 'bg-slate-900 translate-y-0 opacity-100 scale-100' : 'bg-slate-400 translate-y-12 opacity-0 pointer-events-none'
                            }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="relative bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <ShoppingBag size={24} />
                                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900 font-black animate-pulse">
                                    {cart.length}
                                </span>
                            </div>
                            <div className="text-left font-display">
                                <span className="block text-[8px] text-slate-400 font-black uppercase tracking-[3px]">Ringkasan Troli</span>
                                <span className="text-lg tracking-tight leading-none uppercase">Cek Pesanan</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-mono italic">Rp {finalTotal.toLocaleString('id-ID')}</span>
                        </div>
                    </button>
                </div>

                {/* Checkout Experience Overlay */}
                {isCheckingOut && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-fade-in overflow-hidden">
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={() => setIsCheckingOut(false)} />

                        <div className="bg-white w-full max-w-7xl h-full max-h-[90vh] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col md:flex-row animate-scale-in border border-white/20">
                            {/* Order Detail Sidebar */}
                            <div className="md:w-[450px] bg-slate-50 border-r border-slate-100 flex flex-col h-full">
                                <div className="p-10 border-b border-white bg-white/50 backdrop-blur-md">
                                    <div className="flex items-center space-x-3 text-brand-600 mb-6 font-black uppercase tracking-[5px] text-[10px]">
                                        <Tag size={14} className="fill-brand-600" />
                                        <span>Konfirmasi Pesanan</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-1 font-display text-slate-900">Rincian Tagihan</h2>
                                    <div className="flex items-center space-x-2 text-slate-400 font-mono text-xs font-bold uppercase tracking-widest">
                                        <Hash size={12} />
                                        <span>Invoice #{Math.floor(Date.now() / 1000).toString().slice(-6)}</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-10 space-y-6 no-scrollbar">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center space-x-6 animate-slide-up">
                                            <div className="relative group">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-[1.25rem] object-cover shadow-lg border border-white group-hover:scale-110 transition-transform duration-500" />
                                                <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-black border-2 border-white shadow-md z-10">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-base font-black text-slate-900 uppercase tracking-tight truncate">{item.name}</h4>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Rp {item.price.toLocaleString('id-ID')} / unit</p>
                                            </div>
                                            <p className="text-lg font-black text-slate-900 font-mono">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-10 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] space-y-4">
                                    <div className="flex justify-between text-slate-400 font-bold uppercase tracking-[2px] text-[10px]">
                                        <span>Subtotal Belanja</span>
                                        <span className="text-slate-900">Rp {cartTotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 font-bold uppercase tracking-[2px] text-[10px]">
                                        <span>Pajak (10%)</span>
                                        <span className="text-slate-900">Rp {(cartTotal * 0.1).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="pt-6 mt-6 border-t-2 border-dashed border-slate-100 flex flex-col">
                                        <span className="text-xs font-black text-brand-600 uppercase tracking-[5px] mb-2">Total yang Harus Dibayar</span>
                                        <div className="flex items-end justify-between">
                                            <span className="text-5xl font-black text-slate-900 font-display tracking-tighter">Rp {finalTotal.toLocaleString('id-ID')}</span>
                                            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                                                <CreditCard size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Workflow Area */}
                            <div className="flex-1 flex flex-col h-full bg-white relative">
                                <button onClick={() => setIsCheckingOut(false)} className="absolute top-10 right-10 p-4 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-3xl transition-all z-50 group border border-slate-200">
                                    <X size={24} className="group-hover:rotate-90 transition-transform" />
                                </button>

                                <div className="flex-1 overflow-y-auto p-12 md:p-20 flex flex-col justify-center">
                                    <div className="max-w-2xl mx-auto w-full">
                                        {/* Payment Step Progress */}
                                        <div className="flex items-center justify-between mb-20 relative px-4">
                                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                                            <div className={`absolute top-1/2 left-0 h-1 bg-brand-600 -translate-y-1/2 z-0 transition-all duration-700 ${paymentMethod ? 'w-full' : 'w-0'}`} />

                                            {[
                                                { step: 1, label: 'Metode', color: 'brand' },
                                                { step: 2, label: 'Proses', color: 'accent' },
                                                { step: 3, label: 'Selesai', color: 'emerald' }
                                            ].map((s, i) => (
                                                <div key={i} className="relative z-10 flex flex-col items-center">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl transition-all duration-500 border-4 border-white ${(paymentMethod && s.step === 1) || (paymentMethod && s.step === 2) || (s.step === 1)
                                                        ? 'bg-brand-600 text-white scale-110 shadow-brand-200 ring-8 ring-brand-50'
                                                        : 'bg-white text-slate-300 scale-100'
                                                        }`}>
                                                        {s.step}
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-[3px] mt-4 ${paymentMethod && s.step <= 2 ? 'text-brand-600' : 'text-slate-300'}`}>{s.label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-12">
                                            {/* Step 1: Payment Method Selection */}
                                            <div className="space-y-6">
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tight font-display text-center uppercase">Pilih Cara Bayar</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <button
                                                        onClick={() => setPaymentMethod('cash')}
                                                        className={`relative overflow-hidden group p-8 rounded-[2.5rem] border-4 transition-all duration-500 flex flex-col items-center text-center ${paymentMethod === 'cash'
                                                            ? 'bg-brand-50 border-brand-600 shadow-2xl shadow-brand-100 ring-8 ring-brand-50/50'
                                                            : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-xl'
                                                            }`}
                                                    >
                                                        <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center mb-6 transition-all duration-500 ${paymentMethod === 'cash' ? 'bg-brand-600 text-white shadow-xl shadow-brand-200' : 'bg-slate-50 text-slate-400 group-hover:scale-110'}`}>
                                                            <Banknote size={40} strokeWidth={2.5} />
                                                        </div>
                                                        <span className={`text-xl font-black uppercase tracking-widest ${paymentMethod === 'cash' ? 'text-slate-900' : 'text-slate-400'}`}>Uang Tunai</span>
                                                        {paymentMethod === 'cash' && (
                                                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-600/5 rounded-full" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => { setPaymentMethod('qris'); setCashReceived(''); }}
                                                        className={`relative overflow-hidden group p-8 rounded-[2.5rem] border-4 transition-all duration-500 flex flex-col items-center text-center ${paymentMethod === 'qris'
                                                            ? 'bg-brand-50 border-brand-600 shadow-2xl shadow-brand-100 ring-8 ring-brand-50/50'
                                                            : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-xl'
                                                            }`}
                                                    >
                                                        <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center mb-6 transition-all duration-500 ${paymentMethod === 'qris' ? 'bg-brand-600 text-white shadow-xl shadow-brand-200' : 'bg-slate-50 text-slate-400 group-hover:scale-110'}`}>
                                                            <CreditCard size={40} strokeWidth={2.5} />
                                                        </div>
                                                        <span className={`text-xl font-black uppercase tracking-widest ${paymentMethod === 'qris' ? 'text-slate-900' : 'text-slate-400'}`}>Non-Tunai</span>
                                                        {paymentMethod === 'qris' && (
                                                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-600/5 rounded-full" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Step 2: Input Handling */}
                                            {paymentMethod && (
                                                <div className="animate-slide-up bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                                                    {paymentMethod === 'cash' ? (
                                                        <div className="space-y-8">
                                                            <div className="relative group">
                                                                <div className="absolute -top-3 left-8 px-4 bg-brand-600 text-white text-[10px] font-black uppercase tracking-[3px] rounded-full py-1 z-10 shadow-lg">Input Nominal</div>
                                                                <div className="flex items-center bg-white border-4 border-slate-200 focus-within:border-brand-600 rounded-[2.5rem] py-8 px-10 transition-all group-focus-within:shadow-2xl group-focus-within:shadow-brand-100 ring-brand-50 group-focus-within:ring-8 shadow-inner">
                                                                    <span className="text-4xl font-black text-brand-600 font-display tracking-tighter mr-4">Rp</span>
                                                                    <input
                                                                        type="number"
                                                                        autoFocus
                                                                        value={cashReceived}
                                                                        onChange={(e) => setCashReceived(e.target.value)}
                                                                        className="w-full bg-transparent text-6xl font-black text-slate-900 focus:outline-none placeholder-slate-200 font-mono tracking-tighter"
                                                                        placeholder="0"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                {[finalTotal, finalTotal + 10000, Math.ceil(finalTotal / 50000) * 50000, 100000].map(val => (
                                                                    <button
                                                                        key={val}
                                                                        onClick={() => setCashReceived(val.toString())}
                                                                        className="py-4 px-6 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 hover:border-brand-600 hover:text-brand-600 hover:shadow-lg transition-all text-sm uppercase tracking-widest"
                                                                    >
                                                                        Pas: Rp {val.toLocaleString('id-ID')}
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            <div className={`flex items-center justify-between p-8 rounded-[2rem] border-2 transition-all duration-500 scale-100 ${change >= 0 ? 'bg-emerald-50 border-emerald-500 shadow-xl shadow-emerald-100' : 'bg-white border-slate-100'}`}>
                                                                <span className={`text-sm font-black uppercase tracking-[3px] ${change >= 0 ? 'text-emerald-700' : 'text-slate-400'}`}>Kembalian:</span>
                                                                <span className={`text-4xl font-black font-mono tracking-tighter ${change >= 0 ? 'text-emerald-700' : 'text-slate-300'}`}>
                                                                    Rp {change >= 0 ? change.toLocaleString('id-ID') : '0'}
                                                                </span>
                                                            </div>

                                                            <button
                                                                onClick={handleCheckout}
                                                                disabled={change < 0 || !cashReceived}
                                                                className={`w-full py-8 rounded-[2.5rem] font-black text-2xl tracking-[2px] shadow-2xl transition-all duration-300 uppercase shadow-brand-200 ${change >= 0 && cashReceived
                                                                    ? 'bg-brand-600 text-white hover:bg-slate-900 hover:shadow-slate-500/50 hover:scale-[1.02] active:scale-[0.98]'
                                                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                                                                    }`}
                                                            >
                                                                Finalisasi Transaksi
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-10 space-y-10">
                                                            <div className="relative inline-block">
                                                                <div className="absolute -inset-4 bg-brand-500/20 blur-2xl rounded-full animate-pulse" />
                                                                <div className="relative bg-white p-12 rounded-[4rem] shadow-2xl border-4 border-slate-100">
                                                                    <div className="w-56 h-56 bg-slate-50 rounded-[3rem] flex items-center justify-center border-4 border-dashed border-slate-200 group-hover:border-brand-500 transition-colors">
                                                                        <CreditCard size={100} className="text-slate-200 animate-pulse" />
                                                                    </div>
                                                                    <div className="mt-8 flex items-center justify-center space-x-3">
                                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">Menunggu Koneksi EDC</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={handleCheckout}
                                                                className="w-full py-8 bg-brand-600 text-white rounded-[2.5rem] font-black text-2xl uppercase tracking-[2px] shadow-2xl shadow-brand-200 hover:bg-slate-900 hover:shadow-slate-500/50 transition-all duration-500 active:scale-[0.98]"
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
                    </div>
                )}
            </div >
        </div >
    );
};