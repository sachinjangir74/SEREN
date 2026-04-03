const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, required: true },
  specialties: [{ type: String }], // 'therapy', 'psychiatry', 'couples', 'teen'
  imageUrl: { type: String, default: 'https://via.placeholder.com/150' },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Therapist', therapistSchema);
