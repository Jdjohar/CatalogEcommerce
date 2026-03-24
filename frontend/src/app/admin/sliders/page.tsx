'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, GripVertical, Check, X, ImageIcon } from 'lucide-react';
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

interface Slider {
  _id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  order: number;
  image: { url: string; public_id: string };
}

const SortableItem = ({ slider, onEdit, onDelete, onToggle }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: slider._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col md:flex-row items-center justify-between bg-white p-4 mb-3 rounded-xl border border-gray-100 shadow-sm gap-4">
      <div className="flex items-center space-x-4 w-full md:w-auto">
        <button {...attributes} {...listeners} className="cursor-grab hover:text-blue-600 text-gray-400">
          <GripVertical size={20} />
        </button>
        {slider.image ? (
          <img src={slider.image.url} alt="Slider" className="w-24 h-16 object-cover rounded shadow-sm" />
        ) : (
          <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center"><ImageIcon className="text-gray-400"/></div>
        )}
        <div>
          <h3 className="font-semibold text-gray-800">{slider.title || 'No Title'}</h3>
          <p className="text-sm text-gray-500">{slider.subtitle || 'No Subtitle'}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
        <button
          onClick={() => onToggle(slider._id, !slider.active)}
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${slider.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {slider.active ? <><Check size={14} /> <span>Active</span></> : <><X size={14} /> <span>Inactive</span></>}
        </button>
        <button onClick={() => onEdit(slider)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Edit2 size={18} />
        </button>
        <button onClick={() => onDelete(slider._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default function Sliders() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '', subtitle: '', ctaText: '', ctaLink: '', active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchSliders = async () => {
    try {
      const { data } = await api.get('/sliders');
      setSliders(data);
    } catch (err) {
      toast.error('Failed to load sliders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSliders(); }, []);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSliders((items) => {
        const oldIndex = items.findIndex(x => x._id === active.id);
        const newIndex = items.findIndex(x => x._id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        const orderedPayload = newArray.map((slide, idx) => ({ id: slide._id, order: idx }));
        api.post('/sliders/reorder', { sliders: orderedPayload }).catch(() => toast.error('Failed to save order'));
        
        return newArray;
      });
    }
  };

  const openModal = (slider?: Slider) => {
    if (slider) {
      setEditingId(slider._id);
      setFormData({
        title: slider.title || '', subtitle: slider.subtitle || '',
        ctaText: slider.ctaText || '', ctaLink: slider.ctaLink || '',
        active: slider.active
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', subtitle: '', ctaText: '', ctaLink: '', active: true });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      return toast.error('Image is required for new sliders');
    }
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, typeof val === 'boolean' ? val.toString() : val);
    });
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingId) {
        await api.put(`/sliders/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Slider updated');
      } else {
        await api.post('/sliders', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Slider created');
      }
      setIsModalOpen(false);
      fetchSliders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slider?')) return;
    try {
      await api.delete(`/sliders/${id}`);
      toast.success('Slider deleted');
      setSliders(s => s.filter(x => x._id !== id));
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const handleToggleActive = async (id: string, newActive: boolean) => {
    try {
      await api.put(`/sliders/${id}`, { active: newActive });
      toast.success(`Slider marked as ${newActive ? 'Active' : 'Inactive'}`);
      setSliders(s => s.map(x => x._id === id ? { ...x, active: newActive } : x));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="text-gray-500">Loading sliders...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hero Sliders</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition">
          <Plus size={18} /> <span>Add Slider</span>
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sliders.map(s => s._id)} strategy={verticalListSortingStrategy}>
          {sliders.length > 0 ? (
            sliders.map(slider => (
              <SortableItem key={slider._id} slider={slider} onEdit={openModal} onDelete={handleDelete} onToggle={handleToggleActive} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500">No sliders found.</p>
            </div>
          )}
        </SortableContext>
      </DndContext>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Slider' : 'Add Slider'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image {editingId ? '(Optional)' : '*'}</label>
                <input type="file" required={!editingId} accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                  <input type="text" value={formData.ctaText} onChange={e => setFormData({...formData, ctaText: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                  <input type="text" value={formData.ctaLink} onChange={e => setFormData({...formData, ctaLink: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">Slider is active</label>
              </div>
              <div className="mt-8 flex space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">{editingId ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
