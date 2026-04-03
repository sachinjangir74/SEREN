const mongoose = require('mongoose');
const validator = require('validator');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please add a valid email']
    },
    phone: { type: String, default: 'Not provided' },
    doctor: { type: String, required: true },
    mode: { type: String, required: true }, // e.g., Online, In-Person
    date: { type: String, required: true, index: true },
    time: { type: String, required: true },
    timeSlot: { type: String },
    duration: { type: Number, enum: [30, 45, 60, 90], default: 60 },
    service: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['Scheduled', 'Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
  },
  {
    timestamps: true,
  }
);

// Optimize queries for finding user's appointments and sorting by datetime
appointmentSchema.index({ user: 1, date: -1, time: -1 });
appointmentSchema.index({ user: 1, status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
