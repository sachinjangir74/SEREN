const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    senderType: {
      type: String,
      enum: ['user', 'ai', 'therapist', 'admin'],
      required: true,
      default: 'user',
    },
    room: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
  },
  {
    timestamps: true,
  }
);

// Optimize query for fetching room history
chatMessageSchema.index({ room: 1, createdAt: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
