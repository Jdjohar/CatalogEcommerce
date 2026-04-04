const SiteSettings = require('../models/SiteSettings');
const cloudinary = require('../config/cloudinary');

exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching site settings', error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { aboutUs, contact, socialLinks, whatsappNumber, whatsappMessage, inquiryEmail, emailMessage, openaiApiKey } = req.body;
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = new SiteSettings();
    }
    
    if (aboutUs !== undefined) settings.aboutUs = aboutUs;
    if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber;
    if (whatsappMessage !== undefined) settings.whatsappMessage = whatsappMessage;
    if (inquiryEmail !== undefined) settings.inquiryEmail = inquiryEmail;
    if (emailMessage !== undefined) settings.emailMessage = emailMessage;
    if (openaiApiKey !== undefined) settings.openaiApiKey = openaiApiKey;
    
    if (contact) {
      // Handle the case where contact might be a JSON string from FormData
      const parsedContact = typeof contact === 'string' ? JSON.parse(contact) : contact;
      settings.contact = { ...settings.contact, ...parsedContact };
    }
    if (socialLinks) {
       // Handle the case where socialLinks might be a JSON string from FormData
      const parsedSocial = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
      settings.socialLinks = { ...settings.socialLinks, ...parsedSocial };
    }

    if (req.file) {
      // Delete old logo if it exists
      if (settings.logo && settings.logo.public_id) {
        await cloudinary.uploader.destroy(settings.logo.public_id);
      }
      
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
      const result = await cloudinary.uploader.upload(dataURI, { folder: 'settings' });
      settings.logo = { url: result.secure_url, public_id: result.public_id };
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating site settings', error: error.message });
  }
};
