const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  mood: {
    type: String,
    required: true
  },
  note: {
    type: String,
    maxlength: 500
  }
}, { timestamps: true });

const Mood = mongoose.model('Mood', moodSchema);
module.exports = Mood;
