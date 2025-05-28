const axios = require('axios');
const { serverUrl } = require('../config/botConfig');

const sendUserData = async (userData) => {
  try {
    const response = await axios.post(`${serverUrl}/api/users/sync`, userData);
    return response.data;
  } catch (error) {
    console.error('Error sending user data to server:');
    throw error;
  }
};

module.exports = { sendUserData };

