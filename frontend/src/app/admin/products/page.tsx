'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Wand2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price?: number;
  sku?: string;
  active: boolean;
  featured: boolean;
  category: { _id: string; name: string };
  subcategory: { _id: string; name: string };
  images: { url: string; public_id: string }[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Bulk options
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', sku: '',
    category: '', subcategory: '',
    active: true, featured: false
  });
  const [images, setImages] = useState<FileList | null>(null);

  // Poster Demo State
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [posterGenerating, setPosterGenerating] = useState<string | null>(null); // productId if generating
  const [posterError, setPosterError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [prodRes, catRes, subRes] = await Promise.all([
        api.get('/products'), api.get('/categories'), api.get('/subcategories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setSubcategories(subRes.data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price?.toString() || '',
        sku: product.sku || '',
        category: product.category?._id || '',
        subcategory: product.subcategory?._id || '',
        active: product.active,
        featured: product.featured
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', description: '', price: '', sku: '',
        category: '', subcategory: '',
        active: true, featured: false
      });
    }
    setImages(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, typeof val === 'boolean' ? val.toString() : val);
    });

    if (images) {
      Array.from(images).forEach(file => data.append('images', file));
    }

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      setProducts(p => p.filter(x => x._id !== id));
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Delete ${selectedIds.length} products?`)) return;
    try {
      await api.post('/products/bulk-delete', { ids: selectedIds });
      toast.success('Products deleted');
      setProducts(p => p.filter(x => !selectedIds.includes(x._id)));
      setSelectedIds([]);
    } catch (err) {
      toast.error('Bulk deletion failed');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) setSelectedIds([]);
    else setSelectedIds(products.map(p => p._id));
  };

  const handleImageDelete = async (productId: string, publicId: string) => {
    if (!confirm('Delete image?')) return;
    try {
      await api.delete(`/products/${productId}/images/${encodeURIComponent(publicId)}`);
      toast.success('Image deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  const handleGeneratePoster = async (productId: string) => {
    setPosterGenerating(productId);
    setPosterUrl(null);
    setPosterError(null);
    setIsPosterModalOpen(true);
    
    try {
      const res = await api.post(`/products/${productId}/generate-poster`);
      setPosterUrl(res.data.posterUrl);
      toast.success('AI Poster generated successfully!');
    } catch (err: any) {
      setPosterError(err.response?.data?.message || 'Failed to generate poster');
      toast.error('Poster generation failed');
    } finally {
      setPosterGenerating(null);
    }
  };

  if (loading) return <div className="text-gray-500">Loading products...</div>;

  const currentProductInfo = products.find(p => p._id === editingId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <div className="flex space-x-3">
          {selectedIds.length > 0 && (
            <button onClick={handleBulkDelete} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition">
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition">
            <Plus size={18} /> <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-6 py-4">
                <input type="checkbox" onChange={toggleSelectAll} checked={products.length > 0 && selectedIds.length === products.length} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Category/Sub</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <input type="checkbox" checked={selectedIds.includes(product._id)} onChange={() => toggleSelect(product._id)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {product.images?.[0] ? (
                      <img src={product.images[0].url} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center"><ImageIcon size={16} className="text-gray-400" /></div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.category?.name || 'N/A'} <br/>
                  <span className="text-xs text-gray-400">{product.subcategory?.name || '---'}</span>
                </td>
                <td className="px-6 py-4 text-sm">{product.price ? `$${product.price}` : '---'}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleGeneratePoster(product._id)} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition" title="Generate AI Poster"><Wand2 size={18} /></button>
                  <button onClick={() => openModal(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(product._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
            <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
              <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory (Optional)</label>
                  <select value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">None</option>
                    {subcategories.filter(s => s.category?._id === formData.category).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Optional)</label>
                  <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Optional)</label>
                  <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Auto-generated if empty" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Images</label>
                  <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>

                {editingId && currentProductInfo?.images && currentProductInfo.images.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
                    <div className="flex flex-wrap gap-2">
                      {currentProductInfo.images.map((img) => (
                        <div key={img.public_id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                          <img src={img.url} className="w-20 h-20 object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => handleImageDelete(editingId, img.public_id)} className="text-white bg-red-600 p-1.5 rounded-full hover:bg-red-700">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="md:col-span-2 flex items-center space-x-6 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="p-active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
                    <label htmlFor="p-active" className="text-sm font-medium text-gray-700">Active Status</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="p-feat" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" />
                    <label htmlFor="p-feat" className="text-sm font-medium text-gray-700">Featured Product</label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex space-x-3 pt-4 border-t sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">{editingId ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Demo Poster Modal */}
      {isPosterModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center"><Wand2 className="mr-2" size={20} /> AI Poster Studio</h2>
              <button onClick={() => setIsPosterModalOpen(false)} className="text-white hover:text-gray-200"><X size={20} /></button>
            </div>
            
            <div className="p-8 flex flex-col items-center justify-center bg-gray-50 flex-1 overflow-y-auto">
              {posterGenerating ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900">Generating Poster...</h3>
                  <p className="text-sm text-gray-500 mt-2">Writing prompt and calling AI... this can take 10-15 seconds.</p>
                </div>
              ) : posterError ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4 bg-red-50 p-4 rounded-full inline-block">
                    <X size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Generation Failed</h3>
                  <p className="text-sm text-gray-600 bg-gray-100 p-4 rounded-lg text-left font-mono">{posterError}</p>
                  <button onClick={() => setIsPosterModalOpen(false)} className="mt-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition">Close</button>
                </div>
              ) : posterUrl ? (
                <div className="w-full text-center">
                  <img src={posterUrl} alt="Generated Poster" className="w-full aspect-square object-cover rounded-lg shadow-md border border-gray-200" />
                  <a href={posterUrl} target="_blank" rel="noopener noreferrer" className="mt-6 w-full inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition">
                    Download Poster
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
