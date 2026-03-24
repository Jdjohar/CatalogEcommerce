'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    aboutUs: '',
    contact: { address: '', phone: '', email: '' },
    socialLinks: { facebook: '', twitter: '', instagram: '' }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data) setSettings(res.data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section: string, field: string, value: string) => {
    if (section === 'root') {
      setSettings(prev => ({ ...prev, [field]: value }));
    } else {
      setSettings(prev => ({
        ...prev,
        [section]: { ...prev[section as keyof typeof prev] as any, [field]: value }
      }));
    }
  };

  if (loading) return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Site Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* About Us */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">About Us Content</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 h-32"
              value={settings.aboutUs || ''}
              onChange={(e) => handleChange('root', 'aboutUs', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={settings.contact?.address || ''}
                onChange={(e) => handleChange('contact', 'address', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={settings.contact?.phone || ''}
                onChange={(e) => handleChange('contact', 'phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                value={settings.contact?.email || ''}
                onChange={(e) => handleChange('contact', 'email', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input
                type="url"
                className="w-full p-2 border rounded-md"
                value={settings.socialLinks?.facebook || ''}
                onChange={(e) => handleChange('socialLinks', 'facebook', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input
                type="url"
                className="w-full p-2 border rounded-md"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) => handleChange('socialLinks', 'instagram', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X URL</label>
              <input
                type="url"
                className="w-full p-2 border rounded-md"
                value={settings.socialLinks?.twitter || ''}
                onChange={(e) => handleChange('socialLinks', 'twitter', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
