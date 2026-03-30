import apiClient from './apiClient';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/user/auth/login', { email, password });
    
    // Extract token from Authorization header if present
    const authHeader = response.headers.authorization || response.headers.Authorization;
    if (authHeader) {
      // Remove 'Bearer ' prefix if it exists
      const token = authHeader.replace(/^Bearer\s+/i, '');
      localStorage.setItem('token', token);
    }
    
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed';
    console.error('Login Error:', message);
    throw new Error(message);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
