import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Plus, Edit2, Trash2, Search, X, Package, Tag, Layers, ArrowUpRight, Filter, MoreHorizontal, AlertCircle, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import * as supabaseService from '../services/supabaseService';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const Inventory: React.FC<InventoryProps> = ({ products, setProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: Category.FOOD,
    stock: '',
    image: 'https://picsum.photos/200/200'
  });

  const handleSave = async () => {
    if (!formData.name || !formData.price || formData.price === '0') return;

    setIsSaving(true);
    try {
      if (editingProduct) {
        const updatedProduct: Product = {
          ...editingProduct,
          name: formData.name,
          price: Number(formData.price) || 0,
          category: formData.category as Category,
          stock: Number(formData.stock) || 0,
        };

        await supabaseService.updateProduct(updatedProduct.id, {
          name: updatedProduct.name,
          price: updatedProduct.price,
          category: updatedProduct.category,
          stock: updatedProduct.stock,
          image: updatedProduct.image
        });

        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      } else {
        const newProduct: Product = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name,
          price: Number(formData.price) || 0,
          category: formData.category as Category,
          stock: Number(formData.stock) || 0,
          image: `https://picsum.photos/seed/${formData.name?.replace(/\s/g, '')}/200/200`
        };

        await supabaseService.addProduct(newProduct);
        setProducts(prev => [...prev, newProduct]);
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', category: Category.FOOD, stock: '', image: 'https://picsum.photos/200/200' });
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Gagal menyimpan produk. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image
    });
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', category: Category.FOOD, stock: '', image: 'https://picsum.photos/200/200' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await supabaseService.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Gagal menghapus produk. Silakan coba lagi.');
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 h-full overflow-y-auto no-scrollbar animate-fade-in relative">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Package size={20} />
            </div>
            <span className="text-xs font-black text-brand-600 uppercase tracking-[4px]">Ecosystem Management</span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-display">Inventaris Produk</h2>
          <p className="text-slate-500 font-medium mt-1">Kelola ketersediaan produk dan katalog bisnis Anda secara real-time.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-brand-600 transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-brand-200 font-bold group"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
            <Plus size={18} strokeWidth={3} />
          </div>
          <span>Tambah Produk Baru</span>
        </button>
      </header>

      {/* Control Bar */}
      <div className="mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-[450px] group">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-50 shadow-sm focus:shadow-xl focus:border-brand-100 transition-all font-medium text-slate-700 placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all">
            <ArrowUpRight size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Inventory Table Card */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden relative group">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Produk & SKU</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Kategori</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Harga Satuan</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Status Stok</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[3px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-brand-50/30 transition-all duration-300 group/row">
                  <td className="px-8 py-6 animate-slide-in-right">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img src={product.image} alt="" className="w-14 h-14 rounded-2xl object-cover bg-slate-100 border border-slate-100 shadow-sm group-hover/row:scale-105 transition-transform" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-lg flex items-center justify-center shadow-lg border border-slate-50">
                          <ImageIcon size={10} className="text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900 text-sm group-hover/row:text-brand-600 transition-colors uppercase tracking-tight">{product.name}</span>
                        <span className="block text-[10px] font-bold text-slate-400 font-mono mt-0.5 tracking-tighter uppercase">ID: {product.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-brand-400" />
                      <span className="px-3 py-1.5 text-[10px] font-black rounded-xl bg-brand-50 text-brand-600 uppercase tracking-widest border border-brand-100/50">
                        {product.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-700 font-mono italic">Rp {product.price.toLocaleString('id-ID')}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col space-y-1.5">
                      <div className="flex justify-between items-end">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {product.stock < 10 ? 'Low Stock' : 'Ready Stock'}
                        </span>
                        <span className="text-xs font-black text-slate-900 font-mono">{product.stock} Unit</span>
                      </div>
                      <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${product.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-3 bg-white text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                        title="Edit Produk"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-3 bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                        title="Hapus Produk"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-3 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-100 shadow-sm" title="More">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 animate-float">
              <Package size={48} className="text-slate-200" />
            </div>
            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Tidak Ada Produk</h4>
            <p className="text-slate-400 font-medium mt-2 max-w-xs">Data produk yang Anda cari tidak ditemukan. Coba gunakan kata kunci lain.</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-[3px] px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{products.length} Total Produk Digital</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{products.filter(p => p.stock < 10).length} Butuh Perhatian</span>
          </div>
        </div>
        <span>Terakhir Sinkron: Baru Saja</span>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />

          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden relative animate-scale-in border border-white/20">
            {/* Modal Header */}
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <div className="flex items-center space-x-2 text-brand-600 mb-1 font-black uppercase tracking-[3px] text-[10px]">
                  <Layers size={14} className="fill-brand-600" />
                  <span>Product Registry</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">
                  {editingProduct ? 'Modifikasi Produk' : 'Registrasi Produk Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100 shadow-sm group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Nama Produk Digital</label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Contoh: Espresso Macchiato Extra Shot"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-50 focus:bg-white focus:border-brand-200 transition-all font-bold text-slate-900"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Harga Jual (idr)</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">Rp</span>
                    <input
                      type="number"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-50 focus:bg-white focus:border-brand-200 transition-all font-mono font-black text-slate-900 text-lg"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Alokasi Stok</label>
                  <div className="relative group">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                    <input
                      type="number"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-50 focus:bg-white focus:border-brand-200 transition-all font-mono font-black text-slate-900 text-lg"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] ml-1">Kategori Sistem</label>
                <div className="relative group">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                  <select
                    className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-50 focus:bg-white focus:border-brand-200 appearance-none transition-all font-bold text-slate-900"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                  >
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ArrowUpRight size={18} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-brand-50 rounded-3xl border border-brand-100/50 flex items-start space-x-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <AlertCircle size={18} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-brand-600 uppercase tracking-[2px] mb-1">System Intelligence</p>
                  <p className="text-xs text-brand-800 font-medium leading-relaxed">Sistem akan secara otomatis menyinkronkan data ini ke terminal kasir dan dashboard insight setelah Anda menekan tombol simpan.</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-4 text-slate-500 font-bold hover:text-slate-900 transition-all uppercase tracking-widest text-[10px]"
              >
                Batalkan
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-brand-600 transition-all duration-300 shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-black uppercase tracking-widest text-xs"
              >
                <ShoppingCart size={18} />
                <span>{isSaving ? 'Memproses...' : (editingProduct ? 'Perbarui Data' : 'Finalisasi Produk')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};