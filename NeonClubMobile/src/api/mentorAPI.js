import { IP_ADDRESS } from '../config/ipConfig';
import api from '../services/api';

// Fallback base URL (uses backend port 5000 and global /api prefix)
const FALLBACK_BASE_URL = `http://${IP_ADDRESS || '192.168.0.209'}:5000/api`;

// Mock data for offline mode
const mockMentors = [
  {
    _id: 'mock1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Critical Care',
    experience: 12,
    hospital: 'City General Hospital',
    rating: 4.8,
    profilePhoto: null,
    bio: 'Experienced critical care nurse with 12 years in ICU.',
    availability: [],
    hourlyRate: 50
  },
  {
    _id: 'mock2',
    name: 'Dr. Michael Chen',
    specialization: 'Pediatric Nursing',
    experience: 8,
    hospital: 'Children\'s Medical Center',
    rating: 4.9,
    profilePhoto: null,
    bio: 'Pediatric specialist focused on neonatal care.',
    availability: [],
    hourlyRate: 45
  },
  {
    _id: 'mock3',
    name: 'Dr. Emily Davis',
    specialization: 'Emergency Nursing',
    experience: 15,
    hospital: 'Emergency General Hospital',
    rating: 4.7,
    profilePhoto: null,
    bio: 'ER nurse with extensive trauma experience.',
    availability: [],
    hourlyRate: 55
  }
];

const mockBookings = [
  {
    _id: 'book1',
    mentorId: 'mock1',
    mentorName: 'Dr. Sarah Johnson',
    dateTime: new Date().toISOString(),
    status: 'confirmed',
    topic: 'Critical Care Training'
  }
];

const mentorAPI = {
  // Get all mentors
  async getAllMentors() {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.mentors || [];
    } catch (error) {
      console.error('Error fetching mentors:', error);
      // Return empty array on error
      return [];
    }
  },

  // Get mentor availability
  async fetchMentorAvailability(mentorId) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/${mentorId}/available-slots`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching availability:', error);
      return []; // Return empty array on error
    }
  },

  // Book a session
  async bookSession(bookingData, token) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error booking session:', error);
      throw error;
    }
  },

  // Get my bookings using axios
  async getMyBookings(token) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/my-bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.bookings || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Return empty array on error
      return [];
    }
  },

  // Get mentor by ID
  async getMentorById(mentorId) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/${mentorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching mentor:', error);
      throw error;
    }
  },

  // Accept booking
  async acceptBooking(bookingId, token) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/booking/${bookingId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error accepting booking:', error);
      throw error;
    }
  },

  // Reject booking
  async rejectBooking(bookingId, token) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/booking/${bookingId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      throw error;
    }
  },

  // Start session
  async startSession(bookingId, token, meetingLink) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/booking/${bookingId}/start-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ meetingLink }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  },

  // Reschedule booking
  async rescheduleBooking(bookingId, newDateTime, token) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/booking/${bookingId}/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newDateTime }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      throw error;
    }
  },

  // Join session
  async joinSession(bookingId, token) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/booking/${bookingId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error joining session:', error);
      throw error;
    }
  },

  // Get mentor bookings (for dashboard)
  async getMentorBookings(token) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/mentor/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching mentor bookings:', error);
      throw error;
    }
  },

  // Get mentor availability
  async getMentorAvailability(token) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/mentor/availability?upcoming=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching mentor availability:', error);
      throw error;
    }
  },

  // Create availability
  async createAvailability(data, token) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/mentor/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating availability:', error);
      throw error;
    }
  },

  // Delete availability
  async deleteAvailability(slotId, token) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/mentor/availability/${slotId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting availability:', error);
      throw error;
    }
  },

  // Confirm booking
  async confirmBooking(bookingId, token) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/booking/${bookingId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
    }
  },

  // Get mentor profile
  async getMentorProfile(token) {
    try {
      const response = await fetch(`${FALLBACK_BASE_URL}/mentors/mentor/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching mentor profile:', error);
      throw error;
    }
  },
};

export { mentorAPI };
