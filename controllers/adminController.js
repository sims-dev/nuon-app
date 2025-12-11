const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const CatalogItem = require('../models/CatalogItem');
const Assessment = require('../models/Assessment');
const Feedback = require('../models/Feedback');
const Mentor = require('../models/Mentor');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get dashboard statistics
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalNurses = await User.countDocuments({ role: 'nurse' });
    const totalBookings = await Booking.countDocuments();
    const totalPayments = await Payment.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalUsers,
      totalMentors,
      totalNurses,
      totalBookings,
      totalPayments,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, q, role } = req.query;
    const filter = {};
    if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
    if (role) filter.role = role;
    const users = await User.find(filter).select('-passwordHash')
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .sort({ createdAt: -1 });
    const total = await User.countDocuments(filter);
    res.json({ users, total, page: parseInt(page, 10), limit: parseInt(limit, 10) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    const {
      name, email, phone, role, password,
      specialization, experience, qualification, department, hospital, bio,
      hourlyRate, availability, location, city, state, linkedin, website,
      teachingStyle, preferredTopics
    } = req.body;

    console.log('Creating user:', { name, email, role });

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Accept password in body or generate a temporary one
    let rawPassword = password;
    if (!rawPassword) rawPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Handle file uploads
    let profileImages = [];
    let videos = [];
    let profilePicture = '';

    // Process uploaded files
    if (req.files) {
      // Handle profile image
      if (req.files.profileImage && req.files.profileImage.length > 0) {
        const profileImageFile = req.files.profileImage[0];
        profilePicture = `/uploads/images/${profileImageFile.filename}`;
      }

      // Handle multiple profile images
      if (req.files.profileImages) {
        profileImages = req.files.profileImages.map(file => ({
          url: `/uploads/images/${file.filename}`,
          filename: file.filename,
          contentType: file.mimetype,
          size: file.size,
          uploadedAt: new Date()
        }));
      }

      // Handle videos
      if (req.files.videos) {
        videos = req.files.videos.map(file => ({
          url: `/uploads/videos/${file.filename}`,
          filename: file.filename,
          contentType: file.mimetype,
          size: file.size,
          uploadedAt: new Date()
        }));
      }
    }

    // Parse array fields
    const parsedSpecialization = Array.isArray(specialization) ? specialization :
      (specialization ? specialization.split(',').map(s => s.trim()) : []);
    const parsedPreferredTopics = Array.isArray(preferredTopics) ? preferredTopics :
      (preferredTopics ? preferredTopics.split(',').map(t => t.trim()) : []);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      phone,
      role,
      passwordHash: hashedPassword,
      specialization: parsedSpecialization,
      experience: parseInt(experience) || 0,
      qualification,
      department,
      hospital,
      bio,
      hourlyRate: parseInt(hourlyRate) || 0,
      availability: availability || 'available',
      location,
      city,
      state,
      linkedin,
      website,
      teachingStyle,
      preferredTopics: parsedPreferredTopics,
      profilePicture,
      profileImages,
      videos,
      languages: ['English'], // Default
      isProfileComplete: true
    });

    await user.save();

    console.log('User created successfully:', user._id);
    const safe = user.toObject();
    delete safe.passwordHash;
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: safe,
      tempPassword: rawPassword
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Error creating user', error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    // If password provided, hash it
    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('nurseId mentorId', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId', 'name email');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all feedback
const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('mentorId nurseId', 'name email');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get analytics data
const getAnalytics = async (req, res) => {
  try {
    const usersByType = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const paymentTrends = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const userTypeData = {};
    usersByType.forEach(item => {
      userTypeData[item._id] = item.count;
    });

    res.json({
      usersByType: userTypeData,
      monthlyBookings: monthlyBookings.map(item => ({
        month: item._id,
        bookings: item.bookings
      })),
      paymentTrends: paymentTrends.map(item => ({
        month: item._id,
        amount: item.amount
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages between admin and a specific mentor
const getMessages = async (req, res) => {
  try {
    // For now, return empty array since we're using real-time messaging
    // In a production app, you'd store messages in a database
    res.json({ messages: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send message to mentor (this is handled via socket, but API endpoint for consistency)
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const mentorId = req.params.mentorId;

    // Validate mentor exists
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Emit socket event
    const { emitToUser } = require('../lib/socket');
    emitToUser(mentorId, 'admin_message', {
      from: req.user._id,
      fromName: req.user.name,
      to: mentorId,
      message,
      timestamp: new Date(),
      type: 'admin_to_mentor'
    });

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Simplify mentor creation logic
const createMentor = async (req, res) => {
  try {
    console.log('Create Mentor Request Body:', req.body); // Log incoming request body

    const { name, email, hourlyRate } = req.body;

    // Create mentor with basic details
    console.log('Starting mentor creation in database...');
    const mentor = await Mentor.create({
      name,
      email,
      hourlyRate: parseFloat(hourlyRate) || 0,
      isMentor: true,
      isApproved: true,
      isActive: true,
      isPublic: true, // Ensure mentor is public
      role: 'mentor'
    });

    console.log('Mentor created successfully:', { name, email, hourlyRate });
    res.json({ success: true, message: 'Mentor created successfully', mentor });
  } catch (error) {
    console.error('Create mentor error:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    res.status(500).json({ success: false, message: 'Error creating mentor', error: error.message });
  }
};

// Update mentor details
const updateMentor = async (req, res) => {
  try {
    const updates = { ...req.body };
    const mentor = await Mentor.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, message: 'Mentor updated successfully', mentor });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating mentor', error: error.message });
  }
};

// Delete mentor
const deleteMentor = async (req, res) => {
  try {
    await Mentor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Mentor deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error deleting mentor', error: error.message });
  }
};

// Add mentor
const addMentor = async (req, res) => {
  try {
    const { name, email, specialization, experience, hourlyRate } = req.body;
    const mentor = new Mentor({
      name,
      email,
      specialization,
      experience: experience ? parseInt(experience) : 0,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 0,
      role: 'mentor',
      isMentor: true,      // ✅ Required field added
      isApproved: true,    // ✅ Required field added
      isActive: true,      // ✅ Already present
      isPublic: true,      // ✅ Now valid field
    });
    await mentor.save();
    res.status(201).json({ success: true, message: 'Mentor added successfully', mentor });
  } catch (error) {
    console.error('Add mentor error:', error);
    res.status(400).json({ success: false, message: 'Error adding mentor', error: error.message });
  }
};

module.exports = {
  getStats,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getBookings,
  getPayments,
  getFeedback,
  getAnalytics,
  getMessages,
  sendMessage,
  createMentor,
  updateMentor,
  deleteMentor,
  addMentor,
};