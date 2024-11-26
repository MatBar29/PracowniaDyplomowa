import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

// Tworzymy kontekst
export const AuthContext = createContext();

// Komponent dostarczający kontekst
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    // Sprawdzenie statusu autentykacji przy załadowaniu komponentu
    useEffect(() => {
      const checkAuthStatus = async () => {
        try {
          const response = await api.get('/login/status', { withCredentials: true });
          if (response.status === 200) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          setIsAuthenticated(false);
        }
      };
  
      checkAuthStatus();
    }, []); // Tylko jedno wywołanie przy pierwszym renderze
  
    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

// Hook do używania kontekstu
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
