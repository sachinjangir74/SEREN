const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  category: { type: String },
  benefits: [{ type: String }],
  recommendedFor: { type: String },
  modules: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    content: { type: String }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Program', programSchema);
