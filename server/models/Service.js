const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, enum: ['therapy', 'psychiatry', 'counseling', 'couples', 'teen'], required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  benefits: [{ type: String }],
  howItWorks: [{
    step: Number,
    title: String,
    description: String
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
