// src/api/auth.js
import axios from 'axios';
axios.get('/api/v1/projects', { withCredentials: true })
const API_URL = 'http://localhost:5000/api/v1/auth';

// Function to register a user
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    }, { withCredentials: true }); // Important!
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to login a user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    }, { withCredentials: true }); // Important!
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to get the currently logged-in user
export const getMe = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, { withCredentials: true }); // Important!
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw error.response.data;
  }
};

// Function to log out a user
export const logout = async () => {
  try {
    await axios.get(`${API_URL}/logout`, { withCredentials: true }); // Important!
    return true;
  } catch (error) {
    throw error.response.data;
  }
};
