const Category = require('../models/Category');
const slugify = require('slugify');
const cloudinary = require('../config/cloudinary');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('order');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, active } = req.body;
    let slug = slugify(name, { lower: true, strict: true });
    
    // Ensure unique slug
    let existing = await Category.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const order = await Category.countDocuments();

    let image = {};
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
      const result = await cloudinary.uploader.upload(dataURI, { folder: 'categories' });
      image = { url: result.secure_url, public_id: result.public_id };
    }

    const category = new Category({ name, slug, active, order, image: image.url ? image : undefined });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, active } = req.body;
    
    const updateData = { active: active === 'true' || active === true };
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
      // In real-world, might need to ensure slug uniqueness again
    }

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
      const result = await cloudinary.uploader.upload(dataURI, { folder: 'categories' });
      updateData.image = { url: result.secure_url, public_id: result.public_id };
    }

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    if (category.image && category.image.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    // Should also delete related subcategories/products or handle cascading
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body; // Array of { id, order }
    
    const bulkOps = categories.map(cat => ({
      updateOne: {
        filter: { _id: cat.id },
        update: { order: cat.order }
      }
    }));
    
    await Category.bulkWrite(bulkOps);
    res.json({ message: 'Categories reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
