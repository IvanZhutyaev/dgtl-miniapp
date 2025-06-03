import axios from 'axios';

// Use relative paths by default, only use absolute URL if explicitly configured
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const mineralService = {
  // Сохранить собранный минерал
  collectMineral: async (userId, atomicNumber, levelId) => {
    try {
      const response = await axios.post('/api/minerals/collect', {
        userId,
        atomicNumber,
        levelId
      });
      return response.data;
    } catch (error) {
      console.error('Error collecting mineral:', error);
      throw error;
    }
  },

  // Получить все собранные минералы пользователя
  getUserMinerals: async (userId) => {
    try {
      const response = await axios.get(`/api/minerals/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user minerals:', error);
      throw error;
    }
  },

  // Получить все уровни, на которых собран конкретный минерал
  getMineralLevels: async (userId, atomicNumber) => {
    try {
      const response = await axios.get(`/api/minerals/element/${atomicNumber}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting mineral levels:', error);
      throw error;
    }
  }
}; 