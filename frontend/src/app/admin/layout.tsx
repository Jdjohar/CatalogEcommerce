'use client';
import { useAdminStore } from '@/store/useAdminStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Tags, Layers, Package, Image as ImageIcon, LogOut, Settings } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, checkAuth, logout } = useAdminStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isClient && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isClient, isAuthenticated, pathname, router]);

  if (!isClient) return null; // Prevent hydration mismatch

  if (pathname === '/admin/login') {
    return (
      <>
        <Toaster position="top-right" />
        {children}
      </>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Subcategories', href: '/admin/subcategories', icon: Layers },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Sliders', href: '/admin/sliders', icon: ImageIcon },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                pathname.startsWith(item.href)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
