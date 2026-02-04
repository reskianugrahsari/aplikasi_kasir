import React, { useState } from 'react';
import { Store, Lock, User, Eye, EyeOff, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface LoginProps {
    onLogin: (username: string, password: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Username dan password harus diisi');
            return;
        }

        setIsLoading(true);

        // Simulate login delay
        setTimeout(() => {
            if (username === 'admin' && password === 'admin123') {
                onLogin(username, password);
            } else {
                setError('Username atau password salah');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen flex justify-center py-12 px-6 relative overflow-y-auto bg-slate-50 font-sans">
            {/* Sophisticated Background Gradients */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/40 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-200/40 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-100/30 rounded-full blur-[100px] animate-float" />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            {/* Login Container */}
            <div className="relative w-full max-w-lg z-10 animate-scale-in">
                {/* Logo & Brand Section */}
                <div className="text-center mb-6 md:mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl shadow-brand-200/50 mb-4 md:mb-6 border border-slate-100 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Store className="text-brand-600 w-6 h-6 md:w-10 md:h-10 group-hover:text-white transition-colors duration-500 relative z-10" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tighter mb-1 md:mb-2 font-display">
                        Kasir<span className="text-brand-600">Pintar</span>
                    </h1>
                    <div className="flex items-center justify-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                        <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[3px] md:tracking-[4px]">Advanced AI Ecosystem</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="glass rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-white/40 p-1 md:p-2 bg-white/40 backdrop-blur-3xl animate-slide-up">
                    <div className="bg-white/80 rounded-[3rem] p-10 md:p-14 shadow-inner">
                        <header className="mb-6 md:mb-10">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-display mb-1 md:mb-2 uppercase">Selamat Datang</h2>
                            <p className="text-sm md:text-base text-slate-500 font-medium leading-tight">Silakan masuk ke portal manajemen Anda</p>
                        </header>

                        {error && (
                            <div className="mb-8 p-6 bg-rose-50 border-l-4 border-rose-500 rounded-3xl flex items-start space-x-4 animate-slide-in-right">
                                <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                                <p className="text-xs font-bold text-rose-700 uppercase tracking-widest leading-loose">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Username Input */}
                            <div className="space-y-3">
                                <label className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-[3px] ml-1">
                                    Identitas Akun
                                    <ShieldCheck size={14} className="text-brand-400" />
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-brand-50 focus:border-brand-200 shadow-sm transition-all font-bold text-slate-900 placeholder-slate-300"
                                        placeholder="Username admin"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-3">
                                <label className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-[3px] ml-1">
                                    Kunci Akses
                                    <Cpu size={14} className="text-brand-400" />
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-16 pr-16 py-5 bg-white border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-brand-50 focus:border-brand-200 shadow-sm transition-all font-bold text-slate-900 placeholder-slate-300"
                                        placeholder="••••••••••••"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-400 hover:text-brand-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative group overflow-hidden bg-slate-900 text-white py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black shadow-2xl shadow-slate-200 transition-all duration-300 enabled:hover:bg-brand-600 enabled:hover:-translate-y-1 enabled:active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="relative z-10 flex items-center justify-center space-x-3 uppercase tracking-[3px] md:tracking-[4px] text-[10px] md:text-xs">
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Otentikasi...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Masuk ke Panel</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </form>


                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center space-y-4">
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[5px]">
                        © 2026 KasirPintar AI Ecosystem
                    </p>
                    <div className="flex items-center justify-center space-x-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <a href="#" className="hover:text-brand-500 transition-colors">Privacy</a>
                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        <a href="#" className="hover:text-brand-500 transition-colors">Terms</a>
                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        <a href="#" className="hover:text-brand-500 transition-colors">Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add AlertCircle to imports
const AlertCircle = ({ className, size }: { className?: string; size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 24}
        height={size || 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

