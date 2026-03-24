import Link from 'next/link';
import { Eye, Package } from 'lucide-react';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Package size={48} />
          </div>
        )}
        
        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center">
          <Link
            href={`/products/${product.slug}`}
            className="bg-white text-gray-900 rounded-full px-4 py-2 text-sm font-semibold flex items-center shadow-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-50"
          >
            <Eye size={16} className="mr-2" /> View Details
          </Link>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-1 text-xs font-semibold text-blue-600 uppercase tracking-wider">
          {product.category?.name || 'Uncategorized'}
        </div>
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
          <Link href={`/products/${product.slug}`} className="hover:text-blue-600 transition-colors">
            {product.name}
          </Link>
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          {product.price ? (
            <span className="text-xl font-black text-gray-900">${product.price.toFixed(2)}</span>
          ) : (
            <span className="text-sm font-medium text-gray-500 italic">Price on request</span>
          )}
        </div>
      </div>
    </div>
  );
}
