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
};

export default userService;
