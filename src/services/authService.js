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

export const register = async (userData) => {
  try {
    const response = await apiClient.post('/user/auth/register', userData);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Registration failed';
    console.error('Registration Error:', message);
    throw new Error(message);
  }
};

export const verifyOtp = async (userId, otp) => {
  try {
    const response = await apiClient.post('/user/auth/verify-otp', { userId, otp });
    
    // Extract token if the user is automatically logged in upon OTP verification
    const authHeader = response.headers.authorization || response.headers.Authorization;
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '');
      localStorage.setItem('token', token);
    } else if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }

    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'OTP Verification failed';
    console.error('Verify OTP Error:', message);
    throw new Error(message);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post('/user/auth/forgot-password', { email });
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to request password reset';
    console.error('Forgot Password Error:', message);
    throw new Error(message);
  }
};

export const resetPassword = async (email, token, password) => {
  try {
    const response = await apiClient.post('/user/auth/reset-password', { email, token, password });
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to reset password';
    console.error('Reset Password Error:', message);
    throw new Error(message);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
