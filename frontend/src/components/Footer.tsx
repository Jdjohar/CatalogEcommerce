import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, MessageCircle, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight text-white mb-6">Reet Jewellers 916</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Your premium destination for the best products. Quality, trust, and excellence delivered daily.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"><Globe size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-all"><MessageCircle size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all"><Share2 size={18} /></a>
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
              <li><Link href="/categories/electronics" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Electronics</Link></li>
              <li><Link href="/categories/fashion" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Fashion</Link></li>
              <li><Link href="/categories/home" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">Home & Kitchen</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white hover:underline transition-colors text-sm">View All &rarr;</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-100">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-gray-400">
                <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
                <span>123 Commerce Blvd, Tech City, ST 12345</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <a href="mailto:info@catalogapp.com" className="hover:text-white transition-colors">info@catalogapp.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} CatalogApp. All rights reserved.</p>
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
