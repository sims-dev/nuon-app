import { IP_ADDRESS } from '../config/ipConfig';

// Base URL for API calls
const BASE_URL = `http://${IP_ADDRESS}:5000/api`;

const api = {
  // Authentication
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Mentor APIs
  getMentorBookings: async (token) => {
    const response = await fetch(`${BASE_URL}/mentors/mentor/bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  acceptBooking: async (bookingId, token) => {
    const response = await fetch(`${BASE_URL}/mentors/booking/${bookingId}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  rejectBooking: async (bookingId, token) => {
    const response = await fetch(`${BASE_URL}/mentors/booking/${bookingId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  startSession: async (bookingId, token, meetingLink) => {
    const response = await fetch(`${BASE_URL}/mentors/booking/${bookingId}/start-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ meetingLink }),
    });
    return response.json();
  },

  rescheduleBooking: async (bookingId, newDateTime, token) => {
    const response = await fetch(`${BASE_URL}/mentors/booking/${bookingId}/reschedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ newDateTime }),
    });
    return response.json();
  },

  getMentorAvailability: async (token, options = {}) => {
    const params = new URLSearchParams();
    if (options.upcoming) params.append('upcoming', 'true');
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());

    const response = await fetch(`${BASE_URL}/mentors/mentor/availability?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  createAvailability: async (data, token) => {
    const response = await fetch(`${BASE_URL}/mentors/mentor/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateAvailability: async (slotId, data, token) => {
    const response = await fetch(`${BASE_URL}/mentors/mentor/availability/${slotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteAvailability: async (slotId, token) => {
    const response = await fetch(`${BASE_URL}/mentors/mentor/availability/${slotId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getMentorStats: async (token) => {
    const response = await fetch(`${BASE_URL}/mentors/mentor/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  updateMentorProfile: async (data, token) => {
    const response = await fetch(`${BASE_URL}/mentors/mentor/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export default api;