import apiClient from './apiClient';

let profilePromise = null;

export const getProfileDetails = async () => {
  if (profilePromise) return profilePromise;

  profilePromise = (async () => {
    try {
      const response = await apiClient.get('/user/profile/detail');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch profile details';
      console.error('Profile Fetch Error:', message);
      throw new Error(message);
    } finally {
      // Clear the promise after a short delay so manual refreshes hit the network again
      setTimeout(() => { profilePromise = null; }, 2000);
    }
  })();

  return profilePromise;
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
export const uploadMedia = async (formData) => {
  try {
    const response = await apiClient.post('/user/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to upload media';
    throw new Error(message);
  }
};

export const getMediaList = async () => {
  try {
    const response = await apiClient.get('/user/media/list');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch media list';
    throw new Error(message);
  }
};

export const deleteMedia = async (mediaIds) => {
  try {
    const response = await apiClient.delete('/user/media/delete', {
      data: { media_ids: mediaIds }
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to delete media';
    throw new Error(message);
  }
};

export const updateProfileImage = async (mediaId) => {
  try {
    const response = await apiClient.post('/user/profile/update-image', { media_id: Number(mediaId) });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to update profile image';
    console.error('Update Profile Image Error:', message);
    throw new Error(message);
  }
};
