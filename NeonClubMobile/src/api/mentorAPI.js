import { IP_ADDRESS } from '../config/ipConfig';

// Fallback base URL (uses backend port 5000 and global /api prefix)
const FALLBACK_BASE_URL = `http://${IP_ADDRESS || '192.168.0.3'}:5000/api`;

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
      return await response.json();
    } catch (error) {
      console.error('Error fetching mentors:', error);
      throw error;
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
      throw error;
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

  // Get my bookings
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
      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
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
};

export { mentorAPI };