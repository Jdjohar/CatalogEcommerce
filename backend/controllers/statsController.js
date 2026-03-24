const Category = require('../models/Category');
const Product = require('../models/Product');
const Slider = require('../models/Slider');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalSliders = await Slider.countDocuments();
    
    // Get latest 5 products
    const recentProducts = await Product.find()
      .populate('category', 'name')
      .sort('-createdAt')
      .limit(5);
      
    res.json({
      counts: {
        categories: totalCategories,
        products: totalProducts,
        sliders: totalSliders
      },
      recentProducts
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
