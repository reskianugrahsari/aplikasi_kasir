import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import { Transaction, Product } from '../types';
import { TrendingUp, ShoppingBag, DollarSign, Calendar, Package, ArrowUp, ArrowDown, Clock } from 'lucide-react';

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

    // Calculate yesterday's revenue for comparison
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayRevenue = transactions
      .filter(t => t.date.startsWith(yesterdayStr))
      .reduce((sum, t) => sum + t.total, 0);

    const revenueChange = yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : 0;

    // Low stock products
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
    <div className="p-6 h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Penjualan</h2>
        <p className="text-gray-600">Ringkasan performa bisnis Anda hari ini</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pendapatan Hari Ini"
          value={`Rp ${stats.todayRevenue.toLocaleString('id-ID')}`}
          icon={DollarSign}
          gradient="from-blue-500 to-blue-600"
          change={stats.revenueChange}
          changeLabel="vs kemarin"
        />
        <StatCard
          title="Transaksi Hari Ini"
          value={stats.todayCount.toString()}
          icon={ShoppingBag}
          gradient="from-emerald-500 to-emerald-600"
          subtitle="transaksi"
        />
        <StatCard
          title="Total Pendapatan"
          value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`}
          icon={TrendingUp}
          gradient="from-purple-500 to-purple-600"
          subtitle="semua waktu"
        />
        <StatCard
          title="Stok Rendah"
          value={stats.lowStockCount.toString()}
          icon={Package}
          gradient="from-orange-500 to-orange-600"
          subtitle="produk perlu restock"
          alert={stats.lowStockCount > 0}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Trend Chart - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Tren Penjualan</h3>
              <p className="text-sm text-gray-500 mt-1">7 hari terakhir</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                <span className="text-gray-600">Pendapatan</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-gray-600">Transaksi</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  dx={-10}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'pendapatan') return [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan'];
                    return [value, 'Transaksi'];
                  }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pendapatan"
                  stroke="#6366F1"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                />
                <Line
                  type="monotone"
                  dataKey="transaksi"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Produk Terlaris</h3>
          <p className="text-sm text-gray-500 mb-6">Berdasarkan pendapatan</p>
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                          index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                            'bg-gradient-to-br from-indigo-400 to-indigo-500'
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.quantity} terjual</p>
                    </div>
                  </div>
                  <p className="font-bold text-indigo-600 text-sm">
                    Rp {(product.revenue / 1000).toFixed(0)}k
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Package size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Belum ada data penjualan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Transaksi Terbaru</h3>
            <p className="text-sm text-gray-500 mt-1">5 transaksi terakhir</p>
          </div>
          <Clock className="text-gray-400" size={24} />
        </div>

        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pembayaran</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-gray-600">#{transaction.id.slice(-6)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">
                        {new Date(transaction.date).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{transaction.items.length} item</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${transaction.paymentMethod === 'cash'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}>
                        {transaction.paymentMethod === 'cash' ? 'Cash' : 'QRIS'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-gray-900">
                        Rp {transaction.total.toLocaleString('id-ID')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <ShoppingBag size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Belum ada transaksi</p>
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
  gradient,
  change,
  changeLabel,
  subtitle,
  alert
}: any) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
            {change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        {subtitle && (
          <p className={`text-xs ${alert ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>
            {subtitle}
          </p>
        )}
        {changeLabel && (
          <p className="text-xs text-gray-400">{changeLabel}</p>
        )}
      </div>
    </div>
  </div>
);