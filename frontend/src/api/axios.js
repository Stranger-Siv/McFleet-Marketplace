import axios from 'axios';

// Create axios instance with baseURL from environment variable
const apiClient = axios.create({
  // Default to local API for testing; override with VITE_API_BASE_URL when deploying
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://mcfleet-marketplace-susu.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach JWT token to Authorization header
apiClient.interceptors.request.use(
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

// Response interceptor: Handle 401 unauthorized responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Optionally redirect to login or home page
      // window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default apiClient;

