const axios = require('axios');
const { serverUrl } = require('../config/botConfig');

const sendUserData = async (userData) => {
  console.log('Sending user data to server:', {
    url: `${serverUrl}/api/users/sync`,
    userData
  });

  try {
    const response = await axios.post(`${serverUrl}/api/users/sync`, userData);
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

