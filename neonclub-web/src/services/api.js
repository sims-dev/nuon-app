import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add detailed logging for Axios requests and responses
api.interceptors.request.use((config) => {
  console.log('[AXIOS REQUEST]', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging for network and OTP issues
    console.error('[WEB API ERROR]', {
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      message: error?.message,
      responseData: error?.response?.data,
      networkDetails: {
        baseURL: error?.config?.baseURL,
        timeout: error?.config?.timeout,
        headers: error?.config?.headers,
        userAgent: navigator?.userAgent,
        online: navigator?.onLine,
      },
    });

    // Log client IP information for debugging
    console.log('[WEB API] Client network info:', {
      currentURL: window.location.href,
      origin: window.location.origin,
      hostname: window.location.hostname,
      port: window.location.port,
      protocol: window.location.protocol,
      apiURL: process.env.REACT_APP_API_URL,
    });

    // Log detailed error information
    console.error('[WEB API ERROR DETAILS]', {
      url: error?.config?.url,
      fullURL: error?.config?.baseURL + error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      message: error?.message,
      code: error?.code,
      responseData: error?.response?.data,
      requestHeaders: error?.config?.headers,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;