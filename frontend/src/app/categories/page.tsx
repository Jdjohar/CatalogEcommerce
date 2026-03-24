'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { CategorySkeleton } from '@/components/SkeletonLoader';
import { ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.filter((c:any) => c.active));
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">All Categories</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Browse our entire collection mapped across various curated categories.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(8).fill(0).map((_, i) => <CategorySkeleton key={i} />)
          ) : (
            categories.map(category => (
              <Link key={category._id} href={`/categories/${category.slug}`} className="group bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all flex flex-col items-center justify-center hover:-translate-y-1">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <span className="text-blue-600 font-bold text-3xl group-hover:text-white transition-colors">{category.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors text-center">{category.name}</h3>
                <span className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                  Explore <ArrowRight size={16} className="ml-1" />
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
