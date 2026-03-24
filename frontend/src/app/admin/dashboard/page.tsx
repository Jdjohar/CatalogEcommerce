'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Tags, Package, ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  counts: {
    categories: number;
    products: number;
    sliders: number;
  };
  recentProducts: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats/dashboard');
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-gray-500">Loading dashboard...</div>;
  if (!stats) return <div className="text-red-500">Failed to load data.</div>;

  const statCards = [
    { title: 'Total Categories', value: stats.counts.categories, icon: Tags, color: 'bg-blue-500' },
    { title: 'Total Products', value: stats.counts.products, icon: Package, color: 'bg-green-500' },
    { title: 'Active Sliders', value: stats.counts.sliders, icon: ImageIcon, color: 'bg-purple-500' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 border border-gray-100">
            <div className={`p-4 rounded-lg text-white ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Recently Added Products</h2>
          <Link href="/admin/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {product.images?.[0] ? (
                        <img src={product.images[0].url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Package size={16} className="text-gray-400" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.category?.name || 'Uncategorized'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {stats.recentProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No products found. Start adding some!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
