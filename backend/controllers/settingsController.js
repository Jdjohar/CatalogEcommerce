const SiteSettings = require('../models/SiteSettings');

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
    const { aboutUs, contact, socialLinks } = req.body;
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = new SiteSettings();
    }
    
    if (aboutUs !== undefined) settings.aboutUs = aboutUs;
    if (contact) settings.contact = { ...settings.contact, ...contact };
    if (socialLinks) settings.socialLinks = { ...settings.socialLinks, ...socialLinks };
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating site settings', error: error.message });
  }
};
