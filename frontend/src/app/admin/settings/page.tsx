'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [settings, setSettings] = useState({
    aboutUs: '',
    logo: { url: '', public_id: '' },
    whatsappNumber: '',
    whatsappMessage: '',
    inquiryEmail: '',
    emailMessage: '',
    openaiApiKey: '',
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
      const formData = new FormData();
      if (settings.aboutUs) formData.append('aboutUs', settings.aboutUs);
      if (settings.whatsappNumber) formData.append('whatsappNumber', settings.whatsappNumber);
      if (settings.whatsappMessage) formData.append('whatsappMessage', settings.whatsappMessage);
      if (settings.inquiryEmail) formData.append('inquiryEmail', settings.inquiryEmail);
      if (settings.emailMessage) formData.append('emailMessage', settings.emailMessage);
      if (settings.openaiApiKey !== undefined) formData.append('openaiApiKey', settings.openaiApiKey);

      formData.append('contact', JSON.stringify(settings.contact));
      formData.append('socialLinks', JSON.stringify(settings.socialLinks));

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const res = await api.put('/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSettings(res.data);
      setLogoFile(null); // Clear input file context
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
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Site Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Logo */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Site Logo</h2>
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden shrink-0 pointer-events-none">
              {logoFile ? (
                <img src={URL.createObjectURL(logoFile)} alt="Preview" className="w-full h-full object-contain p-2" />
              ) : settings.logo?.url ? (
                <img src={settings.logo.url} alt="Site Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-gray-400 text-sm p-4 text-center">No logo uploaded</span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setLogoFile(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <p className="mt-2 text-xs text-gray-500">Suggested resolution: 200x50 pixels or similar. PNG with transparent background recommended.</p>
            </div>
          </div>
        </div>

        {/* About Us */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg text-blue-800 font-semibold mb-4">About Us Content</h2>
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
          <h2 className="text-lg font-semibold text-blue-800 mb-4">General Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={settings.contact?.address || ''}
                onChange={(e) => handleChange('contact', 'address', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-black-900 mb-1">Office Phone Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={settings.contact?.phone || ''}
                onChange={(e) => handleChange('contact', 'phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">General Email Address</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                value={settings.contact?.email || ''}
                onChange={(e) => handleChange('contact', 'email', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Product Inquiries Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Product Inquiry Overrides</h2>
          <p className="text-sm text-gray-600 mb-6">These settings control the "Enquire on WhatsApp" and "Send Email" buttons on the product pages.</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Inquiry Number (include format e.g. 1234567890)</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={settings.whatsappNumber || ''}
                onChange={(e) => handleChange('root', 'whatsappNumber', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Message Template</label>
              <textarea
                className="w-full p-2 border rounded-md text-sm"
                rows={3}
                value={settings.whatsappMessage || ''}
                onChange={(e) => handleChange('root', 'whatsappMessage', e.target.value)}
                placeholder="Hello, I'm interested in your product: {product_name} (SKU: {product_sku})"
              />
              <p className="text-xs text-gray-500 mt-1">Available placeholders: <code>{`{product_name}`}</code>, <code>{`{product_sku}`}</code></p>
            </div>

            <hr className="border-gray-100" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Inquiry Address</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                value={settings.inquiryEmail || ''}
                onChange={(e) => handleChange('root', 'inquiryEmail', e.target.value)}
                placeholder="Leave blank to use General Email Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Message Template</label>
              <textarea
                className="w-full p-2 border rounded-md text-sm"
                rows={5}
                value={settings.emailMessage || ''}
                onChange={(e) => handleChange('root', 'emailMessage', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Available placeholders: <code>{`{product_name}`}</code>, <code>{`{product_sku}`}</code></p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg text-blue-800 font-semibold mb-4">Social Media Links</h2>
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

        {/* AI Integrations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100">
          <h2 className="text-lg font-semibold mb-4 text-purple-800">AI Integrations</h2>
          <p className="text-sm text-gray-600 mb-6">Configure external AI services like OpenAI for automating tasks.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Key</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                value={settings.openaiApiKey || ''}
                onChange={(e) => handleChange('root', 'openaiApiKey', e.target.value)}
                placeholder="sk-..."
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use the server's default environment key.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end pb-10">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 shadow-sm"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
