const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  title: { type: String },
  subtitle: { type: String },
  ctaText: { type: String },
  ctaLink: { type: String },
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Slider', sliderSchema);
