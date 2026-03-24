'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Building2 } from 'lucide-react';

export default function AboutPage() {
  const [aboutUs, setAboutUs] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data && res.data.aboutUs) {
          setAboutUs(res.data.aboutUs);
        }
      } catch (error) {
        console.error('Failed to load about us', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-[60vh] bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600 shadow-sm">
            <Building2 size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">About Us</h1>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 transition-all hover:shadow-md">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : (
            <div className="prose prose-lg prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
              {aboutUs || 'Welcome to our store. We offer the best quality products.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
