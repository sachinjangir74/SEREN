const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  questions: [{
    text: { type: String, required: true },
    options: [{
      label: { type: String, required: true },
      score: { type: Number, required: true }
    }]
  }],
  scoreThresholds: [{
    minScore: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    severity: { type: String, required: true },
    recommendation: { type: String, required: true },
    suggestedProgramSlug: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
