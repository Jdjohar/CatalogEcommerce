const Subcategory = require('../models/Subcategory');
const slugify = require('slugify');

exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('category', 'name');
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ category: req.params.categoryId });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const { name, category, active } = req.body;
    let slug = slugify(name, { lower: true, strict: true });
    
    let existing = await Subcategory.findOne({ slug, category });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const subcategory = new Subcategory({ name, slug, category, active });
    await subcategory.save();

    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, active } = req.body;
    
    const updateData = { category, active };
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }

    const subcategory = await Subcategory.findByIdAndUpdate(id, updateData, { new: true });
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });

    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findByIdAndDelete(id);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
