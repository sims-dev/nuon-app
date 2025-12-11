import { API_ENDPOINTS } from '../config/apiConfig';
const { IP_ADDRESS } = require('../config/ipConfig');

// Fallback base URL (uses backend port 5000 and global /api prefix)
const FALLBACK_BASE_URL = `http://${IP_ADDRESS || '192.168.0.116'}:5000/api`;

class MentorAPI {
  getBaseUrl() {
    try {
      return API_ENDPOINTS.BASE_URL || FALLBACK_BASE_URL;
    } catch (error) {
      console.log('Using fallback base URL');
      return FALLBACK_BASE_URL;
    }
  }

  async fetchMentors() {
    try {
      const baseUrl = this.getBaseUrl();

      // Create a promise that rejects after 5 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 5000);
      });

      const fetchPromise = fetch(`${baseUrl}/mentor/public/mentors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Race the fetch against the timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.mentors || data;
    } catch (error) {
      console.error('Error fetching mentors:', error);
      throw error;
    }
  }

  async fetchMentorById(mentorId) {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/mentor/public/mentor/${mentorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.mentor || data;
    } catch (error) {
      console.error('Error fetching mentor by ID:', error);
      throw error;
    }
  }

  async fetchMentorAvailability(mentorId) {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/mentor/availability/${mentorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.availability || data;
    } catch (error) {
      console.error('Error fetching mentor availability:', error);
      throw error;
    }
  }

  async bookSession(bookingData, token) {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/mentorBooking/book`, {
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error booking session:', error);
      throw error;
    }
  }

  async fetchUserBookings(token) {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/mentorBooking/my-bookings`, {
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
      return data.bookings || data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  async rescheduleSession(sessionId, newTimeSlot, token) {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/mentorBooking/reschedule/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newTimeSlot }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error rescheduling session:', error);
      throw error;
    }
  }

  async cancelSession(sessionId, token) {
    try {
      const baseUrl = this.getBaseUrl();
      const response = await fetch(`${baseUrl}/mentorBooking/cancel/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error canceling session:', error);
      throw error;
    }
  }
}

export const mentorAPI = new MentorAPI();