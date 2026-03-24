'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import { ProductSkeleton } from '@/components/SkeletonLoader';
import Link from 'next/link';

export default function CategoryDetailsPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSub, setActiveSub] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ]);
        
        const currentCat = catsRes.data.find((c:any) => c.slug === slug);
        if (!currentCat) {
          setLoading(false);
          return;
        }

        setCategory(currentCat);

        // Fetch subcategories for this category
        const subsRes = await api.get(`/subcategories/category/${currentCat._id}`);
        setSubcategories(subsRes.data.filter((s:any) => s.active));

        // Filter products for this category
        const catProducts = prodsRes.data.filter((p:any) => p.category?._id === currentCat._id && p.active);
        setProducts(catProducts);

      } catch (err) {
        console.error('Failed to load category logic', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);

  // Filter logic
  const displayedProducts = activeSub 
    ? products.filter(p => p.subcategory?._id === activeSub)
    : products;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-10 w-1/3 bg-gray-200 animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <Link href="/categories" className="text-blue-600 hover:underline">Return to Categories</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{category.name}</h1>
          <p className="text-lg text-gray-500">Explore all items in {category.name}</p>
        </div>

        {/* Subcategory Filters */}
        {subcategories.length > 0 && (
          <div className="mb-10 flex border-b border-gray-200 overflow-x-auto pb-px hide-scrollbar">
            <button
              onClick={() => setActiveSub(null)}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm transition-colors border-b-2 ${activeSub === null ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              All {category.name}
            </button>
            {subcategories.map(sub => (
              <button
                key={sub._id}
                onClick={() => setActiveSub(sub._id)}
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm transition-colors border-b-2 ${activeSub === sub._id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {displayedProducts.length > 0 ? (
            displayedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">There are no products available in this section yet.</p>
              {activeSub && (
                <button onClick={() => setActiveSub(null)} className="mt-4 text-blue-600 font-medium hover:underline">
                  View All {category.name}
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
