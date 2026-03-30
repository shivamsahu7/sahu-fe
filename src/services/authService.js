import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/user/auth/login', { email, password });
    
    // Axios returns the data directly in response.data
    // Swagger says 200 OK has No Body, so we just check the status
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed';
    console.error('Login Error:', message);
    throw new Error(message);
  }
};
