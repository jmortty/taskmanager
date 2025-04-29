// src/api/projects.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/projects'; // Adjust port if needed

// Function to get all projects for the logged-in user
export const getProjects = async () => {
  try {
    axios.get('/api/v1/projects', { withCredentials: true })
    const response = await axios.get(API_URL);
    return response.data.data; // Assuming your backend returns { success: true, count: ..., data: [...] }
  } catch (error) {
    throw error.response.data; // Throw the error response data
  }
};

// Function to get a single project by ID
export const getProjectById = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/${projectId}`);
    return response.data.data; // Assuming your backend returns { success: true, data: { ... } }
  } catch (error) {
    throw error.response.data;
  }
};

// Function to create a new project
export const createProject = async (projectData) => {
    try {
        const response = await axios.post(API_URL, projectData);
        return response.data.data; // Assuming your backend returns the created project
    } catch (error) {
        throw error.response.data;
    }
};

// Function to update a project by ID
export const updateProject = async (projectId, updateData) => {
    try {
        const response = await axios.put(`${API_URL}/${projectId}`, updateData);
        return response.data.data; // Assuming your backend returns the updated project
    } catch (error) {
        throw error.response.data;
    }
};

// Function to delete a project by ID
export const deleteProject = async (projectId) => {
    try {
        await axios.delete(`${API_URL}/${projectId}`);
        return true; // Indicate success
    } catch (error) {
        throw error.response.data;
    }
};

// Function to add a member to a project
export const addProjectMember = async (projectId, memberId) => {
    try {
        const response = await axios.put(`${API_URL}/${projectId}/members`, { memberId });
        return response.data.data; // Assuming backend returns updated members list
    } catch (error) {
        throw error.response.data;
    }
};

// Function to remove a member from a project
export const removeProjectMember = async (projectId, memberId) => {
    try {
        const response = await axios.delete(`${API_URL}/${projectId}/members/${memberId}`);
         return response.data.data; // Assuming backend returns updated members list
    } catch (error) {
        throw error.response.data;
    }
};