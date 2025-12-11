// Import IP configuration
const { IP_ADDRESS } = require('./ipConfig');

// API Configuration for NeonClub Mobile App
// Use backend port 5000 and include global API prefix
const API_BASE_URL = `http://${IP_ADDRESS || '192.168.0.116'}:5000/api`;

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },

  // Mentor endpoints
  MENTORS: {
    PUBLIC: `${API_BASE_URL}/mentor/public/mentors`,
    BY_ID: (id) => `${API_BASE_URL}/mentor/public/mentor/${id}`,
    AVAILABILITY: (id) => `${API_BASE_URL}/mentor/availability/${id}`,
  },

  // Mentor Booking endpoints
  MENTOR_BOOKING: {
    BOOK: `${API_BASE_URL}/mentorBooking/book`,
    MY_BOOKINGS: `${API_BASE_URL}/mentorBooking/my-bookings`,
    RESCHEDULE: (id) => `${API_BASE_URL}/mentorBooking/reschedule/${id}`,
    CANCEL: (id) => `${API_BASE_URL}/mentorBooking/cancel/${id}`,
  },

  // Payment endpoints
  PAYMENT: {
    MENTORSHIP: `${API_BASE_URL}/payments/mentorship-payment`,
    VERIFY: `${API_BASE_URL}/payments/verify`,
  },

  // Courses endpoints
  COURSES: `${API_BASE_URL}/courses`,
  
  // Events endpoints
  EVENTS: `${API_BASE_URL}/events`,
  
  // Workshops endpoints
  WORKSHOPS: `${API_BASE_URL}/workshops`,
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Helper function to get auth headers
export const getAuthHeaders = (token) => ({
  ...DEFAULT_HEADERS,
  'Authorization': `Bearer ${token}`,
});

export default {
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  getAuthHeaders,
};