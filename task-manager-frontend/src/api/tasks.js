// src/api/tasks.js
import axios from 'axios';
axios.get('/api/v1/projects', { withCredentials: true })
const API_URL = 'http://localhost:5000/api/v1/tasks'; // Adjust port if needed

// Function to get tasks, with optional filters
export const getTasks = async (filters = {}) => {
  try {
    // Build query string from filters object
    const queryString = Object.keys(filters)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
      .join('&');

    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    const response = await axios.get(url);
    return response.data.data; // Assuming your backend returns { success: true, count: ..., data: [...] }
  } catch (error) {
    throw error.response.data; // Throw the error response data
  }
};

// Add other Task CRUD functions below (createTask, getTaskById, updateTask, deleteTask)
// ... (rest of your task API functions)