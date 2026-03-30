import apiClient from './apiClient';

/**
 * Fetch locations (States, Districts, Cities)
 * @param {number} stateId - Optional, to fetch districts
 * @param {number} districtId - Optional, to fetch cities
 */
export const getLocations = async (stateId = null, districtId = null) => {
  try {
    const params = {};
    if (stateId) params.state_id = stateId;
    if (districtId) params.district_id = districtId;

    const response = await apiClient.get('/user/common/location', { params });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch locations';
    console.error('Location Fetch Error:', message);
    throw new Error(message);
  }
};

/**
 * Generic fetcher for common lookup data
 */
const fetchCommonData = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || `Failed to fetch ${endpoint}`;
    console.error(`Fetch Error (${endpoint}):`, message);
    throw new Error(message);
  }
};

export const getEducations = () => fetchCommonData('/user/common/education');
export const getOccupations = () => fetchCommonData('/user/common/occupation');
export const getRashis = () => fetchCommonData('/user/common/rashi');
export const getColors = () => fetchCommonData('/user/common/colors');
