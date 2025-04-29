// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getMe as apiGetMe, logout as apiLogout } from '../api/auth';

// Create the context
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for initial check

  // Check for authenticated user when the app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // This call will succeed if the httpOnly cookie is valid
        const userData = await apiGetMe();
        setIsAuthenticated(true);
        setUser(userData);
      } catch (error) {
        // If getMe fails (e.g., 401 Unauthorized), the user is not authenticated
        setIsAuthenticated(false);
        setUser(null);
         console.error("Authentication check failed:", error); // Log error in dev
      } finally {
        setLoading(false); // Authentication check is complete
      }
    };

    checkAuth();
  }, []); // Empty dependency array means this runs once on mount

  // Login function to be used by login form
  const login = async (email, password) => {
    setLoading(true);
    try {
      await apiLogin(email, password); // API call handles setting httpOnly cookie
      const userData = await apiGetMe(); // Fetch user data after successful login
      setIsAuthenticated(true);
      setUser(userData);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return { success: false, error: error.error || 'Login failed' };
    }
  };

  // Register function to be used by register form
  const register = async (username, email, password) => {
    setLoading(true);
    try {
      await apiRegister(username, email, password); // API call handles setting httpOnly cookie
       const userData = await apiGetMe(); // Fetch user data after successful registration and login
      setIsAuthenticated(true);
      setUser(userData);
      setLoading(false);
       return { success: true };
    } catch (error) {
      setIsAuthenticated(false); // Registration failure usually means login didn't happen
      setUser(null);
      setLoading(false);
      return { success: false, error: error.error || 'Registration failed' };
    }
  };

   // Logout function
   const logout = async () => {
        setLoading(true);
        try {
            await apiLogout(); // Backend clears the cookie
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
            // Optional: Redirect to login page handled in component using the state change
        } catch (error) {
            setLoading(false);
             // Even if API call fails, clear local state as a fallback
            setIsAuthenticated(false);
            setUser(null);
             console.error("Logout failed:", error);
             return { success: false, error: error.error || 'Logout failed' };
        }
   }


  // Context value to be provided
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};