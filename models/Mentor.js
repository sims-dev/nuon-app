const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },

  // Professional Details
  specialization: {
    type: [String], // Array of specializations
    default: []
  },
  qualification: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  hospital: {
    type: String,
    trim: true
  },
  experience: {
    type: Number, // Years of experience
    default: 0
  },
  bio: {
    type: String,
    trim: true
  },

  // Pricing & Availability
  hourlyRate: {
    type: Number,
    default: 500
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },

  // Media Content
  profilePicture: {
    type: String, // URL to profile image
    default: ''
  },
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
    title: String,
    description: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  certifications: [{
    title: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    certificateUrl: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Statistics & Ratings
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  completedSessions: {
    type: Number,
    default: 0
  },
  totalStudents: {
    type: Number,
    default: 0
  },

  // Location
  location: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    default: 'India'
  },

  // Status & Permissions
  isMentor: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: 'mentor'
  },

  // Social Links
  linkedin: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },

  // Languages
  languages: {
    type: [String],
    default: ['English']
  },

  // Teaching Style & Preferences
  teachingStyle: {
    type: String,
    trim: true
  },
  preferredTopics: {
    type: [String],
    default: []
  },

  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String, // Document type
    url: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Reviews & Feedback
  reviews: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],

  // Password (for legacy support)
  password: {
    type: String,
    select: false // Don't include in queries by default
  },

  // Profile completion tracking
  isProfileComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
mentorSchema.index({ email: 1 });
mentorSchema.index({ specialization: 1 });
mentorSchema.index({ isActive: 1, isPublic: 1 });
mentorSchema.index({ rating: -1 });
mentorSchema.index({ hourlyRate: 1 });

// Virtual for average rating calculation
mentorSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return this.rating;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / this.reviews.length;
});

// Method to calculate completion percentage
mentorSchema.methods.getProfileCompletion = function() {
  const fields = [
    'name', 'email', 'specialization', 'qualification',
    'experience', 'bio', 'profilePicture', 'hourlyRate'
  ];
  const completedFields = fields.filter(field => {
    if (Array.isArray(this[field])) return this[field].length > 0;
    return this[field] && this[field].toString().trim() !== '';
  });
  return Math.round((completedFields.length / fields.length) * 100);
};

module.exports = mongoose.model('Mentor', mentorSchema);