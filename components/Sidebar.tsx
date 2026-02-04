import React from 'react';
import { LayoutDashboard, Package, Bot, LogOut, Store, X, Zap } from 'lucide-react';
import { AdminView } from '../types';

interface SidebarProps {
  currentView: AdminView;
  setCurrentView: (view: AdminView) => void;
  onOpenPOS: () => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onOpenPOS, onLogout, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventaris', icon: Package },
    { id: 'ai-assistant', label: 'Asisten AI', icon: Bot },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-72 glass border-r border-white/20 flex flex-col h-full z-30 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl md:shadow-none`}>
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200 animate-float">
            <Store className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">KasirPintar</h1>
            <div className="flex items-center text-[10px] text-brand-600 font-bold uppercase tracking-widest mt-0.5">
              <Zap size={10} className="mr-1 fill-brand-600" /> AI Powered
            </div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
          <X size={20} />
        </button>
      </div>

      <div className="px-6 mb-8">
        <button
          onClick={onOpenPOS}
          className="w-full bg-slate-900 hover:bg-brand-600 text-white py-4 px-4 rounded-2xl flex items-center justify-center space-x-3 shadow-xl shadow-slate-200 hover:shadow-brand-200 transition-all duration-300 transform active:scale-[0.98] group"
        >
          <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
            <Store size={18} />
          </div>
          <span className="font-bold tracking-tight">Buka Mode Kasir</span>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
        <div className="px-4 mb-4">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[2px]">Admin Management</span>
        </div>
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as AdminView);
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group ${isActive
                ? 'bg-white text-brand-600 shadow-sm border border-brand-100/50'
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'
                }`}
            >
              {isActive && (
                <div className="absolute left-0 w-1.5 h-6 bg-brand-600 rounded-r-full" />
              )}
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-brand-50 text-brand-600' : 'bg-transparent text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`font-semibold tracking-tight ${isActive ? 'text-slate-900' : ''}`}>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-brand-600 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl mb-4 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all duration-500" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status Sistem</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-white">Online & Sinkron</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group"
        >
          <div className="p-2 rounded-lg group-hover:bg-red-100 transition-colors">
            <LogOut size={20} />
          </div>
          <span className="font-semibold">Keluar Sesi</span>
        </button>
      </div>
    </div>
  );
};