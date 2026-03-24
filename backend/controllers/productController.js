const Product = require('../models/Product');
const slugify = require('slugify');
const cloudinary = require('../config/cloudinary');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort('-createdAt');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name')
      .populate('subcategory', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, subcategory, price, featured, sku, active } = req.body;
    let slug = slugify(name, { lower: true, strict: true });
    
    let existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        let dataURI = 'data:' + file.mimetype + ';base64,' + b64;
        const result = await cloudinary.uploader.upload(dataURI, { folder: 'products' });
        images.push({ url: result.secure_url, public_id: result.public_id });
      }
    }

    const product = new Product({
      name, slug, description, category, subcategory: subcategory || null, 
      price, images, featured, sku: sku || slug.split('-')[0].toUpperCase() + Math.floor(Math.random() * 10000), active
    });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, subcategory, price, featured, sku, active } = req.body;
    
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) product.description = description;
    if (category) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory || null;
    if (price !== undefined) product.price = price;
    if (featured !== undefined) product.featured = featured;
    if (sku) product.sku = sku;
    if (active !== undefined) product.active = active;

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        let dataURI = 'data:' + file.mimetype + ';base64,' + b64;
        const result = await cloudinary.uploader.upload(dataURI, { folder: 'products' });
        product.images.push({ url: result.secure_url, public_id: result.public_id });
      }
    }

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteProductImage = async (req, res) => {
  try {
    const { id, public_id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    await cloudinary.uploader.destroy(public_id);
    product.images = product.images.filter(img => img.public_id !== public_id);
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    for (const image of product.images) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    const products = await Product.find({ _id: { $in: ids } });
    
    for (const prod of products) {
      for (const image of prod.images) {
         if (image.public_id) await cloudinary.uploader.destroy(image.public_id);
      }
    }
    
    await Product.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Products deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
