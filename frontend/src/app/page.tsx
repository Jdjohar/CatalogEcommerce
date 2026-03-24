'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { ProductSkeleton, CategorySkeleton } from '@/components/SkeletonLoader';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slidersRes, catsRes, prodsRes] = await Promise.all([
          api.get('/sliders'),
          api.get('/categories'),
          api.get('/products')
        ]);
        
        setSliders(slidersRes.data.filter((s:any) => s.active));
        setCategories(catsRes.data.filter((c:any) => c.active).slice(0, 8)); // Top 8
        setFeaturedProducts(prodsRes.data.filter((p:any) => p.active && p.featured).slice(0, 8));
      } catch (err) {
        console.error('Error fetching home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-advance slider
  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === sliders.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders.length]);

  return (
    <div className="bg-gray-50 flex-col min-h-screen">
      
      {/* Hero Slider */}
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-gray-900 overflow-hidden">
        {loading ? (
          <div className="w-full h-full animate-pulse bg-gray-800" />
        ) : sliders.length > 0 ? (
          <>
            {sliders.map((slider, idx) => (
              <div
                key={slider._id}
                className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img src={slider.image.url} className="w-full h-full object-cover opacity-60" alt="Hero Slider" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4 max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight translate-y-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                      {slider.title}
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                      {slider.subtitle}
                    </p>
                    {slider.ctaText && (
                      <Link href={slider.ctaLink || '/categories'} className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-700 transition-all opacity-0 animate-fade-in-up hover:scale-105" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                        {slider.ctaText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Slider Controls */}
            {sliders.length > 1 && (
              <>
                <button onClick={() => setCurrentSlide(prev => prev === 0 ? sliders.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition backdrop-blur-sm">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={() => setCurrentSlide(prev => prev === sliders.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition backdrop-blur-sm">
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                  {sliders.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to CatalogApp</h1>
            <p className="text-xl text-gray-400">Premium products await</p>
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-gray-500">Explore our wide range of collections</p>
          </div>
          <Link href="/categories" className="hidden md:flex text-blue-600 font-semibold items-center hover:text-blue-700 transition-colors">
            View All <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => <CategorySkeleton key={i} />)
          ) : (
            categories.map(category => (
              <Link key={category._id} href={`/categories/${category.slug}`} className="group bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all text-center flex flex-col items-center hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <span className="text-blue-600 font-bold text-xl group-hover:text-white">{category.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
              </Link>
            ))
          )}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link href="/categories" className="inline-flex text-blue-600 font-semibold items-center hover:text-blue-700 transition-colors">
            View All Categories <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Handpicked selection of our finest offerings, curated specifically for you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No featured products currently available.
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Global simple animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
      `}}/>
    </div>
  );
}
