const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    type: {
      type: String,
      enum: ['appointment', 'message', 'alert', 'system'],
      default: 'alert',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String }, // optional hyperlink to navigate when clicked
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);