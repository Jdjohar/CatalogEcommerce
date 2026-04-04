'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, GripVertical, Check, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: { url: string; public_id: string };
  active: boolean;
  order: number;
}

const SortableItem = ({ category, onEdit, onDelete, onToggle }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 mb-3 rounded-xl border border-gray-100 shadow-sm gap-4">
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <button {...attributes} {...listeners} className="cursor-grab hover:text-blue-600 text-gray-400">
          <GripVertical size={20} />
        </button>
        {category.image?.url ? (
          <img src={category.image.url} alt={category.name} className="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-100" />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs font-semibold">No Img</div>
        )}
        <div>
          <h3 className="font-semibold text-gray-800">{category.name}</h3>
          <p className="text-sm text-gray-500">/{category.slug}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
        <button
          onClick={() => onToggle(category._id, !category.active)}
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${category.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {category.active ? <><Check size={14} /> <span>Active</span></> : <><X size={14} /> <span>Inactive</span></>}
        </button>
        <button onClick={() => onEdit(category)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Edit2 size={18} />
        </button>
        <button onClick={() => onDelete(category._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<{ name: string; active: boolean; image: File | null }>({ name: '', active: true, image: null });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex(x => x._id === active.id);
        const newIndex = items.findIndex(x => x._id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Save new order to backend
        const orderedPayload = newArray.map((cat, idx) => ({ id: cat._id, order: idx }));
        api.post('/categories/reorder', { categories: orderedPayload }).catch(() => toast.error('Failed to save order'));
        
        return newArray;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('active', formData.active.toString());
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated');
      } else {
        await api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category created');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      setCategories(c => c.filter(x => x._id !== id));
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleToggleActive = async (id: string, newActive: boolean) => {
    try {
      await api.put(`/categories/${id}`, { active: newActive });
      toast.success(`Category marked as ${newActive ? 'Active' : 'Inactive'}`);
      setCategories(c => c.map(x => x._id === id ? { ...x, active: newActive } : x));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, active: category.active, image: null });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', active: true, image: null });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-gray-500">Loading categories...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition">
          <Plus size={18} /> <span>Add Category</span>
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categories.map(c => c._id)} strategy={verticalListSortingStrategy}>
          {categories.length > 0 ? (
            categories.map(category => (
              <SortableItem key={category._id} category={category} onEdit={openModal} onDelete={handleDelete} onToggle={handleToggleActive} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500">No categories found.</p>
            </div>
          )}
        </SortableContext>
      </DndContext>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g. Electronics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                  {editingCategory && editingCategory.image?.url && (
                    <div className="mb-2">
                      <img src={editingCategory.image.url} alt={editingCategory.name} className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div className="flex items-center space-x-3 mt-4">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={e => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">Category is active</label>
                </div>
              </div>
              <div className="mt-8 flex space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  {editingCategory ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
