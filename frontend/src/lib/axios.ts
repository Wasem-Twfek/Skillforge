import axios from 'axios';

// Fix: Use Vite's import.meta.env for environment variables.
// The dev fallback is intentionally relative (''): all API calls stay
// same-origin and resolve through the Vite dev proxy (/api -> backend),
// exactly like production behind nginx. An absolute fallback
// (http://localhost:3001) bypasses the proxy and is CORS-blocked by the
// backend on any origin other than the configured FRONTEND_URL.
const API_URL = import.meta.env?.VITE_API_URL ?? '';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;