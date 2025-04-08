import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get('/login/status', { withCredentials: true });
        if (response.status === 200) {
          setIsAuthenticated(true);
          setCurrentUser(response.data.user); // Sprawdź, czy response.data.user zawiera role
          console.log("Current user:", response.data.user); // Dodaj to w celu debugowania
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);
  

  const login = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    // Opcjonalnie: zapisuj dane użytkownika w localStorage
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
