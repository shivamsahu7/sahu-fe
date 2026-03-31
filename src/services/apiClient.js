import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (optional: handle 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only reload/logout if it's NOT a login attempt that failed
    // This allows the login form to show the "Invalid password" error instead of refreshing
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      window.location.reload(); 
    }
    return Promise.reject(error);
  }
);

export default apiClient;
