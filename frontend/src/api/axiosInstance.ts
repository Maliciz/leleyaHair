import axios from 'axios';

// Base URL points to backend API (or current host if proxied by Vite)
const baseURL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Виникла помилка під час звʼязку з сервером. Спробуйте пізніше.';
    if (error.response && error.response.data && error.response.data.message) {
      if (Array.isArray(error.response.data.message)) {
        errorMessage = error.response.data.message.join('. ');
      } else {
        errorMessage = error.response.data.message;
      }
    }
    return Promise.reject(new Error(errorMessage));
  }
);
