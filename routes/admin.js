const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');
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

// Admin dashboard statistics (protected)
router.get('/stats', auth, adminController.getStats);

// User management (protected)
router.get('/users', auth, adminController.getUsers);
router.post('/users', auth, upload.single('profileImage'), adminController.createUser);
router.put('/users/:id', auth, adminController.updateUser);
router.delete('/users/:id', auth, adminController.deleteUser);

// Admin bookings overview (protected)
router.get('/bookings', auth, adminController.getBookings);

// Admin payments overview (protected)
router.get('/payments', auth, adminController.getPayments);

// Admin feedback overview (protected)
router.get('/feedback', auth, adminController.getFeedback);

// Analytics data (protected)
router.get('/analytics', auth, adminController.getAnalytics);

// Admin messaging routes (protected)
router.get('/messages/:mentorId', auth, adminController.getMessages);
router.post('/messages/:mentorId', auth, adminController.sendMessage);

// Add admin-specific endpoints for managing mentors
router.post('/mentors', auth, adminController.addMentor); // Add a new mentor
router.put('/mentors/:id', auth, adminController.updateMentor); // Update mentor details
router.delete('/mentors/:id', auth, adminController.deleteMentor); // Delete a mentor

module.exports = router;