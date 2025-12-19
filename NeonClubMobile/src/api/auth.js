import axios from 'axios';

// Base API client for authenticated requests to the backend
// Uses dev bypass header by default in debug builds so you can exercise protected endpoints
// Adjust BASE_URL if your backend API runs elsewhere
const BASE_URL = process.env.API_BASE_URL;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach an interceptor to include Authorization or dev-bypass header as needed
client.interceptors.request.use(async (config) => {
  // Inject token if you store it in AsyncStorage/Context; placeholder for now
  // const token = await AsyncStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;

  // For local development on Android emulator, use dev bypass to hit protected endpoints
  if (__DEV__ && !config.headers.Authorization) {
    config.headers['x-dev-bypass'] = 'dev_secret';
  }

  return config;
});

export default client;
