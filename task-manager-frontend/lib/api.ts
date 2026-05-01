import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    
    // Nuclear cache-buster to prevent stale dashboard data
    config.params = { ...config.params, _cb: Date.now() };

    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      console.warn('[API] No access token found in localStorage for request:', config.url);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
