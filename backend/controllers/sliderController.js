const Slider = require('../models/Slider');
const cloudinary = require('../config/cloudinary');

exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort('order');
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createSlider = async (req, res) => {
  try {
    const { title, subtitle, ctaText, ctaLink, active } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'sliders' });

    const order = await Slider.countDocuments();

    const slider = new Slider({
      title, subtitle, ctaText, ctaLink, active, order,
      image: { url: result.secure_url, public_id: result.public_id }
    });
    
    await slider.save();
    res.status(201).json(slider);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, ctaText, ctaLink, active } = req.body;
    
    const slider = await Slider.findById(id);
    if (!slider) return res.status(404).json({ message: 'Slider not found' });

    if (title !== undefined) slider.title = title;
    if (subtitle !== undefined) slider.subtitle = subtitle;
    if (ctaText !== undefined) slider.ctaText = ctaText;
    if (ctaLink !== undefined) slider.ctaLink = ctaLink;
    if (active !== undefined) slider.active = active;

    if (req.file) {
      if (slider.image && slider.image.public_id) {
        await cloudinary.uploader.destroy(slider.image.public_id);
      }
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
      const result = await cloudinary.uploader.upload(dataURI, { folder: 'sliders' });
      slider.image = { url: result.secure_url, public_id: result.public_id };
    }

    await slider.save();
    res.json(slider);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await Slider.findByIdAndDelete(id);
    if (!slider) return res.status(404).json({ message: 'Slider not found' });
    
    if (slider.image && slider.image.public_id) {
      await cloudinary.uploader.destroy(slider.image.public_id);
    }
    
    res.json({ message: 'Slider deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.reorderSliders = async (req, res) => {
  try {
    const { sliders } = req.body; // Array of { id, order }
    
    const bulkOps = sliders.map(slide => ({
      updateOne: {
        filter: { _id: slide.id },
        update: { order: slide.order }
      }
    }));
    
    await Slider.bulkWrite(bulkOps);
    res.json({ message: 'Sliders reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
