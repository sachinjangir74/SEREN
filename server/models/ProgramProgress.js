const mongoose = require('mongoose');

const programProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    programSlug: {
      type: String,
      required: true,
      index: true
    },
    completedSteps: [
      {
        type: String // step IDs
      }
    ],
    lastAccessed: {
      type: Date,
      default: Date.now
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound index to quickly find a user's progress on a specific program
programProgressSchema.index({ user: 1, programSlug: 1 }, { unique: true });

module.exports = mongoose.model('ProgramProgress', programProgressSchema);