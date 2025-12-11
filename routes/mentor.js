const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { auth } = require('../middleware/auth');

// PUBLIC MENTOR ENDPOINTS (for mobile app and web users)
router.get('/public/mentors', mentorController.getPublicMentors);
router.get('/:mentorId/availability', mentorController.getMentorAvailabilityPublic);

// MENTOR APPLICATION (for users to become mentors)
router.post('/apply', auth, mentorController.applyForMentor);

// Get mentor statistics (protected)
router.get('/stats', mentorController.getStats);

// Get mentor bookings (protected)
router.get('/bookings', auth, mentorController.getBookings);

// Get mentor sessions (protected)
router.get('/sessions', auth, mentorController.getSessions);

// Get mentor feedback (protected)
router.get('/feedback', auth, mentorController.getFeedback);

// Get nurses mentored (protected)
router.get('/nurses', auth, mentorController.getNurses);

// Get mentor profile (protected)
router.get('/profile', auth, mentorController.getProfile);

// Update mentor profile (protected)
router.put('/profile', auth, mentorController.updateProfile);

// Upload mentor profile picture (protected)
router.post('/profile-picture', auth, mentorController.upload.single('image'), mentorController.uploadProfilePicture);

// MENTOR AVAILABILITY MANAGEMENT - Core Feature
// Mentors manage their availability slots for users to book Zoom sessions
router.post('/availability', auth, mentorController.createAvailabilitySlot);
router.get('/availability', auth, mentorController.getMentorAvailability);
router.put('/availability/:id', auth, mentorController.updateAvailabilitySlot);
router.delete('/availability/:id', auth, mentorController.deleteAvailabilitySlot);

// BOOKING MANAGEMENT
router.post('/book', auth, mentorController.bookMentorSession);
router.get('/bookings/my', auth, mentorController.getMyBookings);

module.exports = router;