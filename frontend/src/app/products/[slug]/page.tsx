'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import { Package, MessageCircle, Mail, ArrowLeft } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    if (!settings) fetchSettings();
  }, [settings, fetchSettings]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 aspect-square bg-gray-200 rounded-3xl" />
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-6 w-1/4 bg-gray-200 rounded" />
            <div className="h-10 w-3/4 bg-gray-200 rounded" />
            <div className="h-24 w-full bg-gray-200 rounded" />
            <div className="h-12 w-1/3 bg-gray-200 rounded" />
            <div className="flex gap-4">
              <div className="h-12 w-1/2 bg-gray-200 rounded-lg" />
              <div className="h-12 w-1/2 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link href="/categories" className="text-blue-600 hover:underline">Browse Categories</Link>
      </div>
    );
  }

  const handleWhatsApp = () => {
    let rawNumber = settings?.whatsappNumber || settings?.contact?.phone || "1234567890";
    // WhatsApp format works best with just digits. Remove space, hyphen, plus chars.
    const waNumber = rawNumber.replace(/[^0-9]/g, '');

    let msg = settings?.whatsappMessage || `Hello, I'm interested in your product: {product_name} (SKU: {product_sku}).`;
    
    // Replace placeholders
    msg = msg.replace(/{product_name}/g, product.name);
    msg = msg.replace(/{product_sku}/g, product.sku || 'N/A');

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleEmail = () => {
    const email = settings?.inquiryEmail || settings?.contact?.email || "sales@catalogapp.com";
    const subject = `Inquiry: ${product.name}`;
    let body = settings?.emailMessage || `Hello,\n\nI would like more information about the following product:\n\nName: {product_name}\nSKU: {product_sku}\n\nPlease let me know about availability and pricing.\n\nThank you.`;

    // Replace placeholders
    body = body.replace(/{product_name}/g, product.name);
    body = body.replace(/{product_sku}/g, product.sku || 'N/A');

    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href={`/categories/${product.category?.slug}`} className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to {product.category?.name || 'Category'}
        </Link>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Image Gallery */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[activeImageIdx].url} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <Package size={100} className="text-gray-200" />
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-5 gap-4 mt-6">
                {product.images.map((img: any, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImageIdx(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${idx === activeImageIdx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2 flex items-center space-x-2 text-sm text-gray-500 font-medium">
              <span>{product.category?.name}</span>
              {product.subcategory && (
                <>
                  <span className="text-gray-300">/</span>
                  <span>{product.subcategory.name}</span>
                </>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            {product.sku && (
              <p className="text-sm text-gray-500 font-medium mb-6">SKU: {product.sku}</p>
            )}

            {product.price && (
              <div className="text-3xl font-black text-gray-900 mb-8">
                ${product.price.toFixed(2)}
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-2xl mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Product Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button 
                onClick={handleWhatsApp}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center transition-transform hover:scale-105 shadow-lg shadow-green-500/30"
              >
                <MessageCircle className="mr-3" size={24} /> Enquire on WhatsApp
              </button>
              <button 
                onClick={handleEmail}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center transition-transform hover:scale-105 shadow-lg shadow-blue-600/30"
              >
                <Mail className="mr-3" size={24} /> Send Email
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
