'use client';
import Link from 'next/link';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    if (!settings) {
      fetchSettings();
    }
  }, [settings, fetchSettings]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-22 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-blue-600">
              {settings?.logo?.url ? (
                <img src={settings.logo.url} alt="Site Logo" style={{ height: 'calc(var(--spacing) * 18)' }} className="object-contain" />
              ) : (
                <>
                  {/* <ShoppingBag size={28} /> */}
                  <span className="font-bold text-xl tracking-tight text-gray-900">Reet Jewelers 916</span>
                </>
              )}
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg ml-10">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-700 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                placeholder="Search products..."
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/categories" className="text-gray-600 hover:text-blue-600 font-medium">Categories</Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium">Contact</Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-700 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="Search products..."
            />
          </div>
          <Link href="/categories" className="block text-gray-600 font-medium">Categories</Link>
          <Link href="/contact" className="block text-gray-600 font-medium">Contact</Link>
        </div>
      )}
    </nav>
  );
}
