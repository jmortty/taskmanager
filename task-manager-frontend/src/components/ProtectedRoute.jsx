// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // If still checking auth status, render nothing or a loading spinner
  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner component
  }

  // If authenticated, render the child routes/component
  if (isAuthenticated) {
    // Outlet is used if this route is a parent route containing nested routes
    // Otherwise, if it's a leaf route, you'd just render children: return children;
     return children ? children : <Outlet />;
  }

  // If not authenticated and not loading, redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;