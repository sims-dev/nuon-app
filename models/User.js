const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    lowercase: true,
    sparse: true,
    default: null
  },
  phoneNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  // Make passwordHash optional to support Firebase-authenticated users
  passwordHash: {
    type: String,
    required: false
  },
  // Store firebase UID when user authenticates via Firebase
  firebaseUid: {
    type: String,
    required: false,
    index: true,
    unique: false
  },
  role: {
    type: String,
    enum: ['admin', 'mentor', 'nurse'],
    required: true,
    default: 'nurse'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  // Media files stored in MongoDB as base64 or URLs
  profileImages: [{
    url: String,
    filename: String,
    contentType: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  videos: [{
    url: String,
    filename: String,
    contentType: String,
    size: Number,
    thumbnail: String,
    duration: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  specialization: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    default: ''
  },
  organization: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  // Mentor-specific fields
  qualification: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  hospital: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  }
}, {
  timestamps: true
});

// Removed pre-save hook to avoid double hashing

// Removed comparePassword method - using direct bcrypt.compare

module.exports = mongoose.model('User', userSchema);