const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  aboutUs: {
    type: String,
    default: 'Your premium destination for the best products. Quality, trust, and excellence delivered daily.'
  },
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
