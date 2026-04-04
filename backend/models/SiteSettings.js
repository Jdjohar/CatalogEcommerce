const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  aboutUs: {
    type: String,
    default: 'Your premium destination for the best products. Quality, trust, and excellence delivered daily.'
  },
  logo: {
    url: String,
    public_id: String
  },
  whatsappNumber: { type: String, default: '1234567890' },
  whatsappMessage: { type: String, default: "Hello, I'm interested in your product: {product_name} (SKU: {product_sku})." },
  inquiryEmail: { type: String, default: '' },
  emailMessage: { type: String, default: "Hello,\n\nI would like more information about the following product:\n\nName: {product_name}\nSKU: {product_sku}\n\nPlease let me know about availability and pricing.\n\nThank you." },
  openaiApiKey: { type: String, default: '' },
  contact: {
    address: { type: String, default: '123 Commerce Blvd, Tech City, ST 12345' },
    phone: { type: String, default: '+1 (234) 567-890' },
    email: { type: String, default: 'info@catalogapp.com' }
  },
  socialLinks: {
    facebook: { type: String, default: '#' },
    twitter: { type: String, default: '#' },
    instagram: { type: String, default: '#' }
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
