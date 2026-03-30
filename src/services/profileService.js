import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProfileDetails = async () => {
  try {
    const response = await api.get('/user/profile/detail');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch profile details';
    console.error('Profile Fetch Error:', message);
    throw new Error(message);
  }
};
