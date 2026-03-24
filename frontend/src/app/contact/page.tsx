'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Mail, Phone, MapPin, Globe, MessageCircle, Share2 } from 'lucide-react';

const Facebook = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const Instagram = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const Twitter = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);
export default function ContactPage() {
  const [contact, setContact] = useState({ address: '', phone: '', email: '' });
  const [social, setSocial] = useState({ facebook: '', twitter: '', instagram: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data) {
          if (res.data.contact) setContact(res.data.contact);
          if (res.data.socialLinks) setSocial(res.data.socialLinks);
        }
      } catch (error) {
        console.error('Failed to load contact info', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-[70vh] bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Contact Us</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            We'd love to hear from you. Please reach out with any questions, comments, or concerns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>

            {loading ? (
              <div className="animate-pulse space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-full shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Our Location</h3>
                    <p className="text-gray-600">{contact.address || 'Address not listed'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-full shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone Number</h3>
                    <p className="text-gray-600">
                      <a href={`tel:${contact.phone}`} className="hover:text-green-600 transition-colors">
                        {contact.phone || 'Phone not listed'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-full shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Address</h3>
                    <p className="text-gray-600">
                      <a href={`mailto:${contact.email}`} className="hover:text-purple-600 transition-colors">
                        {contact.email || 'Email not listed'}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Follow Us</h3>
              <div className="flex space-x-4">
                <a href={social.facebook && social.facebook !== '#' ? social.facebook : '#'} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-md">
                  <Facebook size={20} />
                </a>
                <a href={social.instagram && social.instagram !== '#' ? social.instagram : '#'} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-sm hover:shadow-md">
                  <Instagram size={20} />
                </a>
                <a href={social.twitter && social.twitter !== '#' ? social.twitter : '#'} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-all shadow-sm hover:shadow-md">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('We have received your message and will respond shortly.'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="John" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Doe" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="john@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" placeholder="How can we help you?" required></textarea>
              </div>
              <button type="submit" className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-colors focus:ring-4 focus:ring-blue-200 flex justify-center items-center">
                Send Message <Share2 size={18} className="ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
