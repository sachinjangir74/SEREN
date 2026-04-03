const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please add a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: { type: String, enum: ['user', 'therapist', 'admin'], default: 'user' },
    age: { type: Number, min: 0 },
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'], default: 'prefer_not_to_say' },
    avatar: { type: String, default: null },
    therapistProfile: {
      title: { type: String },
      expertise: [{ type: String }],
      languages: [{ type: String }],
      experienceYears: { type: Number },
      rating: { type: Number, default: 5.0 },
      reviews: { type: Number, default: 0 }
    },
    assessmentResults: [{
      assessmentSlug: { type: String },
      score: { type: Number },
      severity: { type: String },
      date: { type: Date, default: Date.now }
    }],
    enrolledPrograms: [{
      programSlug: { type: String },
      progress: { type: Number, default: 0 },
      startDate: { type: Date, default: Date.now }
    }],
    gamification: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActiveDate: { type: Date },
      badges: [{ type: String }]
    },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      notificationsEnabled: { type: Boolean, default: true }
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
