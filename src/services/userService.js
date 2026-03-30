import apiClient from './apiClient';

const userService = {
  /**
   * Fetch a list of users with optional filtering.
   * @param {Object} params - Search parameters (gender, min_age, max_age, etc.)
   * @returns {Promise} - Axios promise with user list data
   */
  fetchUsers: async (params = {}) => {
    try {
      const response = await apiClient.get('/user/common/user/list', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Fetch a single user's public profile by slug.
   * @param {string} slug - The user's slug
   * @returns {Promise} - Axios promise with the user's profile data
   */
  fetchUserProfile: async (slug) => {
    try {
      const response = await apiClient.get(`/user/common/user/profile/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
};

export default userService;
