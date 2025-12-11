import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../utils/config';
import { auth as firebaseAuth } from '../firebase';
import { IP_ADDRESS } from '../../config/ipConfig';

const BASE_URL = `http://${IP_ADDRESS}:5000/api`; // Updated to use centralized IP_ADDRESS from ipConfig.js
// Single authoritative base for dev specified in CONFIG

// Always start with CONFIG-derived BASE_URL so physical devices use your LAN IP automatically.
// We'll still attempt localhost and emulator bridges as automatic failovers if needed.
const initialBase = BASE_URL;

const api = axios.create({
  baseURL: initialBase,
  timeout: CONFIG.TIMEOUT,
});

// Remove any previously saved overrides to avoid conflicting bases
(async () => {
  try {
    await AsyncStorage.removeItem('api.base.override');
  } catch {}
})();

// Keep signature but make it a no-op to enforce a single base
export async function setBaseOverride() {
  return api.defaults.baseURL;
}

// ultra-light GET cache to reduce repeated loads and perceived latency
const __getCache = new Map(); // key -> { ts, data }
const __CACHE_TTL = 60 * 1000; // 60s
async function cachedGet(url, config = {}) {
  const key = JSON.stringify([api.defaults.baseURL, url, config.params || null]);
  const now = Date.now();
  const cached = __getCache.get(key);
  if (cached && (now - cached.ts) < __CACHE_TTL) {
    return { data: cached.data };
  }
  const res = await api.get(url, config);
  __getCache.set(key, { ts: now, data: res.data });
  return res;
}

export const getBaseURL = () => BASE_URL;
export const getCurrentBaseURL = () => api.defaults.baseURL;

// Expose quick dev helpers on global to tweak base without rebuilding
if (__DEV__) {
  try {
    // @ts-ignore
    global.__setApiBase = setBaseOverride;
    // @ts-ignore
    global.__apiBase = () => api.defaults.baseURL;
  } catch {}
}

// Explicit connectivity probe that tries known candidates and switches baseURL
let __lastProbeAt = 0;
const __PROBE_TTL_MS = 120_000; // 2 minutes cache to avoid repeated probes
export async function probeAndFixBase() {
  const now = Date.now();
  if (now - __lastProbeAt < __PROBE_TTL_MS) {
    return api.defaults.baseURL;
  }
  __lastProbeAt = now;

  // Try a set of likely dev candidates (LAN IP, localhost, emulator bridge)
  const candidates = [
    `http://${IP_ADDRESS}:5000/api`, // LAN IP from centralized config
    'http://localhost:5000/api', // local dev server (if running on same device/emulator bridge)
    'http://10.0.2.2:5000/api', // Android emulator host mapping
  ];

  for (const candidate of candidates) {
    try {
      const testApi = axios.create({ baseURL: candidate, timeout: 3000 });
      await testApi.get('/api/test'); // Use /api/test to match backend controller route
      api.defaults.baseURL = candidate;
      return candidate;
    } catch (e) {
      // Silently continue to next candidate
    }
  }
  return api.defaults.baseURL;
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

api.interceptors.request.use(async (config) => {
  // Comment out Firebase authentication - using only JWT tokens from AsyncStorage
  /*
  try {
    const currentUser = firebaseAuth().currentUser;
    if (currentUser) {
      let idToken = __cachedIdToken;
      const now = Date.now();
      if (!idToken || (now - __cachedAt) > TOKEN_TTL_MS) {
        idToken = await currentUser.getIdToken();
        if (idToken) { __cachedIdToken = idToken; __cachedAt = now; }
      }
      if (idToken) {
        config.headers.Authorization = `Bearer ${idToken}`;
      }
    } else {
      const token = await AsyncStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  */

  // Use only JWT tokens from AsyncStorage (MongoDB authentication)
  // But skip adding Authorization header for registration endpoint
  if (config.url !== '/register') {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Remove obviously invalid Authorization values (prevents breaking dev-bypass)
  if (config.headers.Authorization && !/^Bearer\s+[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(config.headers.Authorization)) {
    delete config.headers.Authorization;
  }
  // Do not use any dev-bypass headers; require proper auth via JWT tokens
  // attach a client-generated request id for correlation
  if (!config.headers['x-request-id']) {
    config.headers['x-request-id'] = genReqId();
  }
  config.headers['Content-Type'] = 'application/json';
  // Request logging removed for cleaner console output
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If network error and we haven't tried probing yet, try to fix base URL
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      try {
        const newBase = await probeAndFixBase();
        if (newBase !== error.config.baseURL) {
          // Retry the request with new base URL
          const retryConfig = { ...error.config, baseURL: newBase };
          return api.request(retryConfig);
        }
      } catch (probeError) {
        // Silently handle probe failure
      }
    }

    if (error.response?.status === 401) {
      await AsyncStorage.clear();
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  // Legacy methods (for backward compatibility)
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/user/me'),

  // OTP Authentication
  sendOTP: async (endpoint, data) => {
    try {
      const response = await api.post(endpoint, data);
      // OTP debug info removed for cleaner console
      return response;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  },
  verifyOTP: (data) => api.post('/otp/verify', data),

  // Profile management
  updateProfile: (profileData) => api.put('/profile', profileData),
};

// User/Settings APIs
export const settingsAPI = {
  getNotificationSettings: () => api.get('/profile/notification-settings'),
  updateNotificationSettings: (settings) => api.put('/profile/notification-settings', settings),
};

// Catalog APIs
export const catalogAPI = {
  // Try common catalog endpoints and normalize response to an array of items with `type` field
  getCatalog: async () => {
    // prefer /catalog
    const tryEndpoints = ['/catalog', '/courses', '/items'];
    for (let ep of tryEndpoints) {
      try {
        const res = await api.get(ep);
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
        const res = await api.get(ep);
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
  purchaseCourse: (courseId, isFree = false) => api.post(`/courses/${courseId}/purchase`, isFree ? { paymentMethod: 'free', paymentId: 'free', courseId } : { courseId }),
  getMyCourses: () => cachedGet('/courses/my'),
};

// Conference APIs (Learning tab - Academic conferences/webinars)
export const conferenceAPI = {
  getConferences: () => cachedGet('/conferences'),
  getConference: (id) => cachedGet(`/conferences/${id}`),
  registerForConference: (conferenceId, paymentData) => api.post(`/conferences/${conferenceId}/register`, paymentData),
  getMyConferences: () => cachedGet('/conferences/my/conferences'),
  getAllConferences: () => cachedGet('/conferences'),
};

// Event APIs (Engage tab - Community events) - Keep for backward compatibility
export const eventAPI = {
  getEvents: () => cachedGet('/events'),
  getEvent: (id) => cachedGet(`/events/${id}`),
  registerForEvent: (eventId, paymentData) => api.post(`/events/${eventId}/register`, paymentData),
  getMyEvents: () => cachedGet('/events/my/events'),
  getAllEvents: () => cachedGet('/events'),
};

// Workshop APIs
export const workshopAPI = {
  getWorkshops: () => cachedGet('/workshops'),
  getWorkshop: (id) => cachedGet(`/workshops/${id}`),
  registerForWorkshop: (workshopId, paymentData) => api.post(`/workshops/${workshopId}/register`, paymentData),
  getMyWorkshops: () => cachedGet('/workshops/my/workshops'),
  getWorkshopMaterials: (workshopId) => cachedGet(`/workshops/${workshopId}/materials`),
  getAllWorkshops: () => cachedGet('/workshops'),
};

// Progress APIs
export const progressAPI = {
  getUserProgress: (courseId) => api.get(`/progress/${courseId}`),
  updateLessonProgress: (courseId, lessonId, data) => api.put(`/progress/${courseId}/lessons/${lessonId}`, data),
  getAllUserProgress: () => api.get('/progress'),
  downloadCertificate: (courseId) => api.get(`/progress/${courseId}/certificate`),
};

// Booking APIs
export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  updateBooking: (id, data) => api.patch(`/bookings/${id}`, data),
};

// Payment APIs
export const paymentAPI = {
  initiatePayment: (paymentData) => api.post('/payments/initiate', paymentData),
  initiateMentorshipPayment: (paymentData) => api.post('/payments/mentorship-payment', paymentData),
  getPaymentHistory: () => api.get('/payments/history'),
};

// Assessment APIs
export const assessmentAPI = {
  getAssessments: () => api.get('/assessments'),
  getAssessment: (id) => api.get(`/assessments/${id}`),
  submitAssessment: (id, answers) => api.post(`/assessments/${id}/submit`, { answers }),
  getResults: (id) => api.get(`/assessments/${id}/result`),
};

// NCC APIs
export const nccAPI = {
  getNCCStatus: () => api.get('/ncc'),
  updateNCCStep: (stepData) => api.post('/ncc/step', stepData),
  markInterest: () => api.post('/ncc/interest'),
  getUiNumber: () => api.get('/ncc/ui-number'),
};

// News APIs
// ============================================
// BACKEND INTEGRATION READY
// Admin Panel should manage news through these endpoints:
// 
// GET /dashboard/news - Returns latest news for dashboard (used in HomeScreen)
// GET /dashboard/news/featured - Returns featured news
// GET /news - Returns all news with optional filtering
//
// Expected News Object Structure:
// {
//   _id: string,
//   title: string,
//   category: string (e.g., 'Guidelines', 'Education', 'Stories'),
//   type: string (e.g., 'video', 'article'),
//   imageUrl: string (main image URL),
//   thumbnail: string (fallback thumbnail URL),
//   videos: [{ url: string, thumbnail: string }] (optional),
//   publishedAt: string (ISO date),
//   createdAt: string (ISO date),
//   content: string (article content),
//   excerpt: string (short description),
//   featured: boolean,
//   viewCount: number,
//   readingTime: number (minutes)
// }
// ============================================
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
  // Use the correct mentor endpoints that match backend routes
  getMentors: async () => {
    try {
      const res = await cachedGet('/mentors');
      let list = Array.isArray(res?.data?.mentors) ? res.data.mentors : (Array.isArray(res?.data) ? res.data : []);
      return { data: list };
    } catch (error) {
      console.error('Error fetching mentors:', error);
      return { data: [] };
    }
  },
  getMentor: (id) => api.get(`/mentors/${id}`),
  getAvailability: (mentorId, params = {}) => api.get(`/mentors/${mentorId}/availability/public`, { params }),
  bookMentorship: (mentorData) => api.post('/mentors/book', mentorData),
  getMyBookings: () => api.get('/mentors/my-bookings'),
  apply: (data) => {
    // Allow both JSON and FormData. If FormData, don't force JSON content-type.
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      return api.post('/mentors/apply', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/mentors/apply', data);
  },
};

// Notifications APIs
export const notificationsAPI = {
  list: (userId) => api.get('/notifications', { params: userId ? { userId } : undefined }),
  create: (payload) => api.post('/notifications', payload),
};

// Activities feed APIs
export const activitiesAPI = {
  getMy: (type) => api.get('/activities/my', { params: type ? { type } : {} }),
  // Enrich logs with a light snapshot of the current user for easier admin triage
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
      return api.post('/activities', merged);
    } catch {
      return api.post('/activities', payload);
    }
  },
};

// Fetch mentors function
export async function fetchPublicMentors() {
  try {
    const response = await api.get('/mentor/public/mentors');
    return response.data;
  } catch (error) {
    return [];
  }
}

export default api;