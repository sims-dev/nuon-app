import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../utils/config';
import { IP_ADDRESS } from '../../config/ipConfig';

const BASE_URL = `http://${IP_ADDRESS}:5000/api`;

// Helper for fetch requests
async function fetchApi(endpoint, { method = 'GET', body, params, headers = {} } = {}) {
  let url = BASE_URL + endpoint;
  if (params && typeof params === 'object') {
    const query = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    url += `?${query}`;
  }
  const token = await AsyncStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  const options = {
    method,
    headers,
    ...(body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  };
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { response: { status: res.status, data }, message: data.message || res.statusText };
  return { data };
}

// Remove any previously saved overrides to avoid conflicting bases
(async () => {
  try {
    await AsyncStorage.removeItem('api.base.override');
  } catch {}
})();

// Keep signature but make it a no-op to enforce a single base
export async function setBaseOverride() {
  return BASE_URL;
}

// ultra-light GET cache to reduce repeated loads and perceived latency
const __getCache = new Map(); // key -> { ts, data }
const __CACHE_TTL = 60 * 1000; // 60s
async function cachedGet(url, config = {}) {
  const key = JSON.stringify([BASE_URL, url, config.params || null]);
  const now = Date.now();
  const cached = __getCache.get(key);
  if (cached && (now - cached.ts) < __CACHE_TTL) {
    return { data: cached.data };
  }
  const res = await fetchApi(url, { method: 'GET', params: config.params });
  __getCache.set(key, { ts: now, data: res.data });
  return res;
}

export const getBaseURL = () => BASE_URL;
export const getCurrentBaseURL = () => BASE_URL;

// Expose quick dev helpers on global to tweak base without rebuilding
if (__DEV__) {
  try {
    // @ts-ignore
    global.__setApiBase = setBaseOverride;
    // @ts-ignore
    global.__apiBase = () => BASE_URL;
  } catch {}
}

// Explicit connectivity probe that tries known candidates and switches baseURL
let __lastProbeAt = 0;
const __PROBE_TTL_MS = 120_000; // 2 minutes cache to avoid repeated probes
export async function probeAndFixBase() {
  // Only use BASE_URL for fetch
  return BASE_URL;
}

// Pre-probe localhost (adb reverse) in dev to avoid initial request failures
// Note: We now auto-probe on first network error to handle different environments
if (__DEV__) {
  // Probe once on startup to set correct base URL
  setTimeout(() => {
    probeAndFixBase().catch(() => {});
  }, 1000);
}

// Add auth token to requests
function genReqId() {
  const r = Math.random().toString(36).slice(2, 7);
  return `m_${Date.now()}_${r}`;
}

// Simple in-memory token cache to avoid fetching Firebase token on every request
let __cachedIdToken = null;
let __cachedAt = 0;
const TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes

// All axios interceptors removed; only fetch and named exports are used now

// Removed all axios error handling blocks. Use fetch error handling in API functions if needed.

// Auth APIs
export const authAPI = {
  register: (userData) => fetchApi('/register', { method: 'POST', body: userData }),
  login: (credentials) => fetchApi('/login', { method: 'POST', body: credentials }),
  getProfile: () => fetchApi('/user/me'),
  sendOTP: async (endpoint, data) => {
    try {
      const response = await fetchApi(endpoint, { method: 'POST', body: data });
      if (__DEV__ && response.data?.debugOtp) {
        console.log(`[DEV OTP] Use this OTP to verify: ${response.data.debugOtp}`);
      }
      return response;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  },
  verifyOTP: (data) => fetchApi('/otp/verify', { method: 'POST', body: data }),
  updateProfile: (profileData) => fetchApi('/profile', { method: 'PUT', body: profileData }),
};

// User/Settings APIs
export const settingsAPI = {
  getNotificationSettings: () => fetchApi('/profile/notification-settings'),
  updateNotificationSettings: (settings) => fetchApi('/profile/notification-settings', { method: 'PUT', body: settings }),
};

// Catalog APIs
export const catalogAPI = {
  // Try common catalog endpoints and normalize response to an array of items with `type` field
  getCatalog: async () => {
    // prefer /catalog
    const tryEndpoints = ['/catalog', '/courses', '/items'];
    for (let ep of tryEndpoints) {
      try {
        const res = await fetchApi(ep);
        // backend may return grouped object { events:[], workshops:[], courses:[] }
        if (res.data) {
          if (Array.isArray(res.data)) return { data: res.data };
          if (res.data.events || res.data.workshops || res.data.courses) {
            const items = [];
            if (res.data.events) items.push(...res.data.events.map(i => ({ ...i, type: 'event' })));
            if (res.data.workshops) items.push(...res.data.workshops.map(i => ({ ...i, type: 'workshop' })));
            if (res.data.courses) items.push(...res.data.courses.map(i => ({ ...i, type: 'course' })));
            return { data: items };
          }
          // unknown shape, attempt to coerce
          return { data: Array.isArray(res.data) ? res.data : [res.data] };
        }
      } catch (e) {
        // try next
      }
    }
    return { data: [] };
  },

  getCatalogItem: async (id) => {
    const tryEndpoints = [`/catalog/${id}`, `/courses/${id}`, `/items/${id}`];
    for (let ep of tryEndpoints) {
      try {
        const res = await fetchApi(ep);
        return res;
      } catch (e) {
        // continue
      }
    }
    return Promise.reject(new Error('Not found'));
  },
};

// Course APIs
export const courseAPI = {
  getCourses: () => cachedGet('/courses'),
  getCourse: (id) => cachedGet(`/courses/${id}`),
  purchaseCourse: (courseId, isFree = false) => fetchApi(`/courses/${courseId}/purchase`, { method: 'POST', body: isFree ? { paymentMethod: 'free', paymentId: 'free', courseId } : { courseId } }),
  getMyCourses: () => cachedGet('/courses/my'),
};

// Event APIs
export const eventAPI = {
  getEvents: () => cachedGet('/events'),
  getEvent: (id) => cachedGet(`/events/${id}`),
  registerForEvent: (eventId, paymentData) => fetchApi(`/events/${eventId}/register`, { method: 'POST', body: paymentData }),
  getMyEvents: () => cachedGet('/events/my/events'),
  getAllEvents: () => cachedGet('/events'),
};

// Workshop APIs
export const workshopAPI = {
  getWorkshops: () => cachedGet('/workshops'),
  getWorkshop: (id) => cachedGet(`/workshops/${id}`),
  registerForWorkshop: (workshopId, paymentData) => fetchApi(`/workshops/${workshopId}/register`, { method: 'POST', body: paymentData }),
  getMyWorkshops: () => cachedGet('/workshops/my/workshops'),
  getWorkshopMaterials: (workshopId) => cachedGet(`/workshops/${workshopId}/materials`),
  getAllWorkshops: () => cachedGet('/workshops'),
};

// Progress APIs
export const progressAPI = {
  getUserProgress: (courseId) => fetchApi(`/progress/${courseId}`),
  updateLessonProgress: (courseId, lessonId, data) => fetchApi(`/progress/${courseId}/lessons/${lessonId}`, { method: 'PUT', body: data }),
  getAllUserProgress: () => fetchApi('/progress'),
  downloadCertificate: (courseId) => fetchApi(`/progress/${courseId}/certificate`),
};

// Booking APIs
export const bookingAPI = {
  createBooking: (bookingData) => fetchApi('/bookings', { method: 'POST', body: bookingData }),
  getMyBookings: () => fetchApi('/bookings/my-bookings'),
  updateBooking: (id, data) => fetchApi(`/bookings/${id}`, { method: 'PATCH', body: data }),
};

// Payment APIs
export const paymentAPI = {
  initiatePayment: (paymentData) => fetchApi('/payments/initiate', { method: 'POST', body: paymentData }),
  initiateMentorshipPayment: (paymentData) => fetchApi('/payments/mentorship-payment', { method: 'POST', body: paymentData }),
  getPaymentHistory: () => fetchApi('/payments/history'),
};

// Assessment APIs
export const assessmentAPI = {
  getAssessments: () => fetchApi('/assessments'),
  getAssessment: (id) => fetchApi(`/assessments/${id}`),
  submitAssessment: (id, answers) => fetchApi(`/assessments/${id}/submit`, { method: 'POST', body: { answers } }),
  getResults: (id) => fetchApi(`/assessments/${id}/result`),
};

// NCC APIs
export const nccAPI = {
  getNCCStatus: () => fetchApi('/ncc'),
  updateNCCStep: (stepData) => fetchApi('/ncc/step', { method: 'POST', body: stepData }),
  markInterest: () => fetchApi('/ncc/interest', { method: 'POST' }),
  getUiNumber: () => fetchApi('/ncc/ui-number'),
};

// News APIs
export const newsAPI = {
  getLatest: async () => {
    try {
      const res = await cachedGet('/dashboard/news');
      return { data: Array.isArray(res?.data?.news) ? res.data.news : (Array.isArray(res?.data) ? res.data : []) };
    } catch {}
    try {
      const res = await cachedGet('/news');
      return { data: Array.isArray(res?.data?.news) ? res.data.news : (Array.isArray(res?.data) ? res.data : []) };
    } catch {}
    return { data: [] };
  },
  getFeatured: async () => {
    try {
      const res = await cachedGet('/dashboard/news/featured');
      const list = Array.isArray(res?.data?.news) ? res.data.news : (Array.isArray(res?.data) ? res.data : []);
      return { data: list };
    } catch {
      return { data: [] };
    }
  },
  getAllNews: async (params = {}) => {
    try {
      const res = await cachedGet('/news', { params });
      return { data: Array.isArray(res?.data?.news) ? res.data.news : (Array.isArray(res?.data) ? res.data : []) };
    } catch {
      return { data: [] };
    }
  },
};

// Mentor APIs
export const mentorAPI = {
  // Prefer public mentors endpoint; fall back to admin (will usually be blocked) but keep for compatibility
  getMentors: async () => {
    try {
      console.log('Fetching public mentors');
      const res = await cachedGet('/mentor/public/mentors');
      let list = Array.isArray(res?.data?.mentors) ? res.data.mentors : (Array.isArray(res?.data) ? res.data : []);
      // No mock fallback; show empty state on UI if none
      return { data: list };
    } catch {}
    try {
      const res = await cachedGet('/admin/users?role=mentor');
      return { data: Array.isArray(res?.data) ? res.data : [] };
    } catch {
      return { data: [] };
    }
  },
  getAvailability: (mentorId, params = {}) => fetchApi(`/mentor/${mentorId}/availability`, { params }),
  bookMentorship: (mentorData) => fetchApi('/mentor/book', { method: 'POST', body: mentorData }),
  getMyBookings: () => fetchApi('/mentor/bookings/my'),
  apply: (data) => {
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      return fetchApi('/mentor/apply', { method: 'POST', body: data, headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return fetchApi('/mentor/apply', { method: 'POST', body: data });
  },
};

// Notifications APIs
export const notificationsAPI = {
  list: (userId) => fetchApi('/notifications', { params: userId ? { userId } : undefined }),
  create: (payload) => fetchApi('/notifications', { method: 'POST', body: payload }),
};

// Activities feed APIs
export const activitiesAPI = {
  getMy: (type) => fetchApi('/activities/my', { params: type ? { type } : {} }),
  create: async (payload) => {
    try {
      const raw = await AsyncStorage.getItem('user');
      let merged = payload || {};
      if (raw) {
        try {
          const u = JSON.parse(raw);
          const client = u ? { id: u._id || u.id, name: u.name, email: u.email, role: u.role } : undefined;
          merged = { ...payload, meta: { ...(payload?.meta || {}), client } };
        } catch {}
      }
      return fetchApi('/activities', { method: 'POST', body: merged });
    } catch {
      return fetchApi('/activities', { method: 'POST', body: payload });
    }
  },
};

// Fetch mentors function
export async function fetchPublicMentors() {
  try {
    const response = await fetchApi('/mentor/public/mentors');
    console.log('Fetched mentors:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return [];
  }
}

export default {
  fetchApi,
  authAPI,
  settingsAPI,
  catalogAPI,
  courseAPI,
  eventAPI,
  workshopAPI,
  progressAPI,
  bookingAPI,
  paymentAPI,
  assessmentAPI,
  nccAPI,
  newsAPI,
  mentorAPI,
  notificationsAPI,
  activitiesAPI,
  fetchPublicMentors,
};