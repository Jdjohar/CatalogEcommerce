'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Mail, Phone, MapPin, Globe, MessageCircle, Share2 } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';

const Facebook = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const Instagram = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const Twitter = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

export default function Footer() {
  const [categories, setCategories] = useState<any[]>([]);
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const catsRes = await api.get('/categories');
        if (catsRes.data) {
          setCategories(catsRes.data.filter((c: any) => c.active).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load footer categories', err);
      }
    };
    fetchFooterData();
    if (!settings) {
      fetchSettings();
    }
  }, [settings, fetchSettings]);

  // Use fallback values if settings haven't loaded yet
  const contact = settings?.contact || { address: '123 Commerce Blvd, Tech City, ST 12345', phone: '+1 (234) 567-890', email: 'info@Reet Jewelers 916.com' };
  const socialLinks = settings?.socialLinks || { facebook: '#', twitter: '#', instagram: '#' };


  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          <div className="space-y-4">
            {settings?.logo?.url ? (
              <img src={settings.logo.url} alt="Site Logo" className="h-12 object-contain bg-white rounded-lg p-2 mb-6" />
            ) : (
              <h3 className="text-2xl font-bold tracking-tight text-white mb-6">Reet Jewelers 916</h3>
            )}
            <p className="text-gray-400 leading-relaxed text-sm">
              {settings?.aboutUs || 'Your premium destination for the best products. Quality, trust, and excellence delivered daily.'}
            </p>
            <div className="flex space-x-4 pt-2">
              <a href={socialLinks?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"><Facebook size={18} /></a>
              <a href={socialLinks?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18} /></a>
              <a href={socialLinks?.twitter || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-all"><Twitter size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-100">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Home</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Shop All Categories</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-100">Categories</h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category._id}>
                  <Link href={`/categories/${category.slug}`} className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">
                    {category.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-gray-500 text-sm italic">No categories yet</li>
              )}
              {categories.length > 0 && (
                <li className="pt-2"><Link href="/categories" className="text-gray-300 font-medium hover:text-white hover:underline transition-colors text-sm">View All &rarr;</Link></li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-100">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
                <span>{contact?.address || 'Address not listed'}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <a href={`tel:${contact?.phone}`} className="hover:text-white transition-colors">{contact?.phone || 'Phone not listed'}</a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <a href={`mailto:${contact?.email}`} className="hover:text-white transition-colors">{contact?.email || 'Email not listed'}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Reet Jewelers 916. All rights reserved. Design with love <a href="https://jdwebservices.com" target="_blank" rel="noopener noreferrer">JD Web Services</a></p>
          <div className="flex space-x-4 flex-wrap mt-4 md:mt-0 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
