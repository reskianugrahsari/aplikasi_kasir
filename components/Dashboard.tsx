import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import { Transaction, Product } from '../types';
import { TrendingUp, ShoppingBag, DollarSign, Calendar, Package, ArrowUp, ArrowDown, Clock, ChevronRight } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  products: Product[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, products }) => {
  const stats = useMemo(() => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = transactions.length;
    const today = new Date().toISOString().split('T')[0];
    const todaysTransactions = transactions.filter(t => t.date.startsWith(today));
    const todayRevenue = todaysTransactions.reduce((sum, t) => sum + t.total, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayRevenue = transactions
      .filter(t => t.date.startsWith(yesterdayStr))
      .reduce((sum, t) => sum + t.total, 0);

    const revenueChange = yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : 0;

    const lowStockCount = products.filter(p => p.stock < 10).length;

    return {
      totalRevenue,
      totalTransactions,
      todayRevenue,
      todayCount: todaysTransactions.length,
      revenueChange,
      lowStockCount
    };
  }, [transactions, products]);

  const salesData = useMemo(() => {
    const days = 7;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const daySales = transactions
        .filter(t => t.date.startsWith(dateStr))
        .reduce((sum, t) => sum + t.total, 0);
      const dayTransactions = transactions.filter(t => t.date.startsWith(dateStr)).length;

      data.push({
        name: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        pendapatan: daySales,
        transaksi: dayTransactions
      });
    }
    return data;
  }, [transactions]);

  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};

    transactions.forEach(t => {
      t.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="p-8 h-full overflow-y-auto no-scrollbar animate-fade-in">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight font-display">Dashboard Insight</h2>
          <p className="text-slate-500 font-medium">Selamat datang kembali! Berikut adalah ringkasan performa bisnis Anda.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
            <Calendar size={18} />
          </div>
          <span className="pr-4 text-sm font-bold text-slate-700">
            {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Omzet Hari Ini"
          value={`Rp ${stats.todayRevenue.toLocaleString('id-ID')}`}
          icon={DollarSign}
          color="brand"
          change={stats.revenueChange}
          changeLabel="dibanding kemarin"
        />
        <StatCard
          title="Transaksi Selesai"
          value={stats.todayCount.toString()}
          icon={ShoppingBag}
          color="accent"
          subtitle="transaksi hari ini"
        />
        <StatCard
          title="Total Pendapatan"
          value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`}
          icon={TrendingUp}
          color="emerald"
          subtitle="akumulasi semua waktu"
        />
        <StatCard
          title="Stok Inventaris"
          value={stats.lowStockCount.toString()}
          icon={Package}
          color="orange"
          subtitle="produk stok menipis"
          alert={stats.lowStockCount > 0}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-brand-100/30 transition-all duration-500 group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight font-display">Tren Pertumbuhan</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Estimasi pendapatan 7 hari terakhir</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500 mr-2 ring-4 ring-brand-100"></div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 ring-4 ring-emerald-100"></div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Order</span>
              </div>
            </div>
          </div>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d3bff" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2d3bff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(val) => `Rp ${(val / 1000).toFixed(0)}k`}
                  dx={-15}
                />
                <Tooltip
                  cursor={{ stroke: '#2d3bff', strokeWidth: 2, strokeDasharray: '5 5' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl animate-scale-in">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                          <div className="space-y-1">
                            <p className="text-brand-400 font-bold flex items-center justify-between gap-4">
                              <span>Revenue:</span>
                              <span className="text-white text-lg">Rp {payload[0].value?.toLocaleString('id-ID')}</span>
                            </p>
                            <p className="text-emerald-400 font-bold flex items-center justify-between gap-4 border-t border-slate-800 pt-1 mt-1">
                              <span>Orders:</span>
                              <span className="text-white">{payload[1]?.value} trx</span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pendapatan"
                  stroke="#2d3bff"
                  strokeWidth={4}
                  fill="url(#colorRevenue)"
                  animationDuration={2000}
                />
                <Area
                  type="monotone"
                  dataKey="transaksi"
                  stroke="#10B981"
                  strokeWidth={0}
                  fill="transparent"
                  activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-display">Produk Unggulan</h3>
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <ChevronRight size={20} />
            </div>
          </div>
          <div className="space-y-4 flex-1">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-brand-100 hover:bg-white hover:shadow-lg hover:shadow-brand-100/20 transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-600' :
                        index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                          'bg-gradient-to-br from-brand-400 to-brand-600'
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{product.name}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.quantity} Terjual</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-brand-600 group-hover:scale-110 transition-transform origin-right">
                      Rp {(product.revenue / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-12">
                <Package size={64} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="font-bold text-slate-400 italic">Menunggu data penjualan...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight font-display">Log Transaksi Terkini</h3>
            <p className="text-sm text-slate-400 font-medium">Monitoring arus kas real-time</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl animate-pulse-soft">
            <Clock size={24} />
          </div>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto -mx-8 px-8 no-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="py-4 px-4 text-[11px] font-black text-slate-400 uppercase tracking-[2px]">ID Transaksi</th>
                  <th className="py-4 px-4 text-[11px] font-black text-slate-400 uppercase tracking-[2px]">Waktu & Tanggal</th>
                  <th className="py-4 px-4 text-[11px] font-black text-slate-400 uppercase tracking-[2px]">Daftar Item</th>
                  <th className="py-4 px-4 text-[11px] font-black text-slate-400 uppercase tracking-[2px]">Metode</th>
                  <th className="py-4 px-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-[2px]">Total Tagihan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-brand-50/30 transition-colors group">
                    <td className="py-5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                        <span className="font-mono text-sm font-bold text-slate-600">#{transaction.id.slice(-6).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="text-sm font-bold text-slate-700">
                        {new Date(transaction.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {new Date(transaction.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>
                    <td className="py-5 px-4 text-sm font-bold text-slate-700">
                      {transaction.items.length} Barang
                    </td>
                    <td className="py-5 px-4">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${transaction.paymentMethod === 'cash'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-brand-100 text-brand-700'
                        }`}>
                        {transaction.paymentMethod === 'cash' ? 'Cash' : 'QRIS'}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <span className="font-black text-slate-900 text-lg group-hover:text-brand-600 transition-colors">
                        Rp {transaction.total.toLocaleString('id-ID')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
              <ShoppingBag size={48} className="text-slate-200" />
            </div>
            <p className="font-bold text-slate-400 italic font-display text-xl uppercase tracking-widest">Belum Ada Transaksi</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  change,
  changeLabel,
  subtitle,
  alert
}: any) => {
  const themes = {
    brand: 'from-brand-600 to-brand-700 text-brand-600 bg-brand-50 ring-brand-100',
    accent: 'from-accent-500 to-accent-600 text-accent-600 bg-accent-50 ring-accent-100',
    emerald: 'from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-50 ring-emerald-100',
    orange: 'from-orange-500 to-orange-600 text-orange-600 bg-orange-50 ring-orange-100',
  };

  const themeClass = themes[color as keyof typeof themes] || themes.brand;

  return (
    <div className="bg-white rounded-[2rem] p-7 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative group">
      {/* Background Decor */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${themeClass.split(' ').slice(0, 2).join(' ')}`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${themeClass.split(' ').slice(0, 2).join(' ')} shadow-lg shadow-inherit animate-float`}>
            <Icon size={24} className="text-white" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black ${change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
              {change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-2">{title}</p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight font-display mb-1">{value}</h3>
          {subtitle && (
            <p className={`text-[10px] font-black uppercase tracking-widest ${alert ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
              {subtitle}
            </p>
          )}
          {changeLabel && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{changeLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
};