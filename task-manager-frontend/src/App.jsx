import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import TaskListPage from './pages/TaskListPage';
import TaskCreatePage from './pages/TaskCreatePage';
import TaskEditPage from './pages/TaskEditPage';
import TaskDetailPage from './pages/TaskDetailPage';
import ProjectListPage from './pages/ProjectListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute><ProjectListPage /></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><TaskListPage /></PrivateRoute>} />
      <Route path="/tasks/create" element={<PrivateRoute><TaskCreatePage /></PrivateRoute>} />
      <Route path="/tasks/:id" element={<PrivateRoute><TaskDetailPage /></PrivateRoute>} />
      <Route path="/tasks/:id/edit" element={<PrivateRoute><TaskEditPage /></PrivateRoute>} />

      {/* Fallback Route */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
