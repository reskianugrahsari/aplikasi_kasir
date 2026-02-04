import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
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

  // Form State - using strings for price and stock to allow empty input
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
        // Update existing product
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
        // Add new product
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
        // Delete from Supabase
        await supabaseService.deleteProduct(id);

        // Update local state
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
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Inventaris</h2>
          <p className="text-gray-500">Kelola daftar produk dan stok barang.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari nama produk..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center space-x-3">
                  <img src={product.image} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                  <span className="font-medium text-gray-900">{product.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">Rp {product.price.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(product)} className="text-indigo-400 hover:text-indigo-600 p-2 mr-2">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 p-2">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-gray-500">Tidak ada produk ditemukan.</div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{editingProduct ? 'Tambah/Kurangi Stok' : 'Stok Awal'}</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                >
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Error')} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">No Img</div>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Gunakan URL gambar publik (Unsplash, Imgur, dll).</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Menyimpan...' : (editingProduct ? 'Update Produk' : 'Simpan Produk')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};