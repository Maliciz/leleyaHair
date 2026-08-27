import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('leleya_admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired auth session if on admin pages
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('leleya_admin_token');
        localStorage.removeItem('leleya_admin_user');
        window.location.href = '#/admin/login';
      }
    }
    return Promise.reject(error);
  }
);
