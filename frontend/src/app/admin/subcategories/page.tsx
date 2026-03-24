'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Check, X, Save } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: Category;
  active: boolean;
}

export default function Subcategories() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Inline Add State
  const [isAdding, setIsAdding] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', category: '', active: true });
  
  // Inline Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', category: '', active: true });

  const fetchData = async () => {
    try {
      const [subsRes, catsRes] = await Promise.all([
        api.get('/subcategories'),
        api.get('/categories')
      ]);
      setSubcategories(subsRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!newSub.name || !newSub.category) {
      toast.error('Name and Category are required');
      return;
    }
    try {
      await api.post('/subcategories', newSub);
      toast.success('Subcategory created');
      setIsAdding(false);
      setNewSub({ name: '', category: '', active: true });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Creation failed');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.name || !editForm.category) {
      toast.error('Name and Category are required');
      return;
    }
    try {
      await api.put(`/subcategories/${id}`, editForm);
      toast.success('Subcategory updated');
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subcategory?')) return;
    try {
      await api.delete(`/subcategories/${id}`);
      toast.success('Subcategory deleted');
      setSubcategories(s => s.filter(x => x._id !== id));
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const startEdit = (sub: Subcategory) => {
    setEditingId(sub._id);
    setEditForm({ name: sub.name, category: sub.category._id, active: sub.active });
  };

  if (loading) return <div className="text-gray-500">Loading subcategories...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Subcategories</h1>
        <button 
          onClick={() => setIsAdding(true)} 
          disabled={isAdding}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition disabled:opacity-50"
        >
          <Plus size={18} /> <span>Add Subcategory</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="px-6 py-4 font-semibold">Subcategory Name</th>
              <th className="px-6 py-4 font-semibold">Parent Category</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* INLINE ADD ROW */}
            {isAdding && (
              <tr className="bg-blue-50/30">
                <td className="px-6 py-3">
                  <input 
                    type="text" 
                    placeholder="Subcategory Name"
                    value={newSub.name}
                    onChange={e => setNewSub({...newSub, name: e.target.value})}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    autoFocus
                  />
                </td>
                <td className="px-6 py-3">
                  <select 
                    value={newSub.category}
                    onChange={e => setNewSub({...newSub, category: e.target.value})}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Category...</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </td>
                <td className="px-6 py-3 text-center">
                  <input 
                    type="checkbox" 
                    checked={newSub.active}
                    onChange={e => setNewSub({...newSub, active: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-3 text-right space-x-2">
                  <button onClick={handleCreate} className="p-1.5 text-green-600 hover:bg-green-100 rounded transition" title="Save">
                    <Save size={18} />
                  </button>
                  <button onClick={() => setIsAdding(false)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition" title="Cancel">
                    <X size={18} />
                  </button>
                </td>
              </tr>
            )}

            {/* SUBCATEGORY ROWS */}
            {subcategories.map(sub => (
              <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  {editingId === sub._id ? (
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <div>
                      <span className="font-medium text-gray-900">{sub.name}</span>
                      <p className="text-xs text-gray-500">/{sub.slug}</p>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === sub._id ? (
                    <select 
                      value={editForm.category}
                      onChange={e => setEditForm({...editForm, category: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  ) : (
                    <span className="text-gray-600">{sub.category?.name || 'Unknown'}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {editingId === sub._id ? (
                    <input 
                      type="checkbox" 
                      checked={editForm.active}
                      onChange={e => setEditForm({...editForm, active: e.target.checked})}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sub.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {sub.active ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {editingId === sub._id ? (
                    <>
                      <button onClick={() => handleUpdate(sub._id)} className="p-1.5 text-green-600 hover:bg-green-100 rounded transition" title="Save">
                        <Check size={18} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition" title="Cancel">
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(sub)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(sub._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            
            {subcategories.length === 0 && !isAdding && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No subcategories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
