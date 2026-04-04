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
              <Link key={category._id} href={`/categories/${category.slug}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
                <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                  {category.image?.url ? (
                    <img src={category.image.url} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-gray-300 font-bold text-6xl group-hover:text-gray-400 transition-colors">{category.name.charAt(0)}</span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center">
                    <span className="bg-white text-gray-900 rounded-full px-4 py-2 text-sm font-semibold flex items-center shadow-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Explore Category <ArrowRight size={16} className="ml-2" />
                    </span>
                  </div>
                </div>
                <div className="p-6 text-center flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
