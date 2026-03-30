import apiClient from './apiClient';

export const getProfileDetails = async () => {
  try {
    const response = await apiClient.get('/user/profile/detail');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch profile details';
    console.error('Profile Fetch Error:', message);
    throw new Error(message);
  }
};
export const updateProfile = async (stepData) => {
  try {
    const response = await apiClient.post('/user/profile/update-profile', stepData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to update profile';
    console.error('Profile Update Error:', message);
    throw new Error(message);
  }
};
