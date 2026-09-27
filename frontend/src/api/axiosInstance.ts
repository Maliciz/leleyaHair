import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const axiosInstance = axios.create({
  baseURL,
  timeout: 60000,
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
      // Clear expired auth session if on admin or barber pages
      const hash = window.location.hash || '';
      if ((hash.includes('/admin') || hash.includes('/barber')) && !hash.includes('/login')) {
        localStorage.removeItem('leleya_admin_token');
        localStorage.removeItem('leleya_admin_user');
        window.location.hash = '#/admin/login';
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);
