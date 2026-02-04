import React from 'react';
import { LayoutDashboard, Package, Bot, LogOut, Store } from 'lucide-react';
import { AdminView } from '../types';

interface SidebarProps {
  currentView: AdminView;
  setCurrentView: (view: AdminView) => void;
  onOpenPOS: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onOpenPOS, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventaris', icon: Package },
    { id: 'ai-assistant', label: 'Asisten AI', icon: Bot },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10 shrink-0">
      <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-md">
          <Store className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">KasirPintar</h1>
      </div>

      <div className="p-4">
        <button
          onClick={onOpenPOS}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-200 transition-all transform hover:scale-[1.02]"
        >
          <Store size={20} />
          <span className="font-semibold">Buka Kasir</span>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Menu Admin</p>
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as AdminView)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};