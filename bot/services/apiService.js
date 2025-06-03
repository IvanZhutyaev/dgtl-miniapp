const axios = require('axios');
const { SERVER_URL } = require('../config/botConfig');

const sendUserData = async (userData) => {
  console.log('Sending user data to server:', {
    url: `${SERVER_URL}/api/users/sync`,
    userData
  });

  try {
    const response = await axios.post(`${SERVER_URL}/api/users/sync`, userData);
    console.log('Server response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending user data to server:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

module.exports = { sendUserData };

