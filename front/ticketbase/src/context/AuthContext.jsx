import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

// Tworzenie kontekstu autoryzacji
export const AuthContext = createContext();

// Provider kontekstu autoryzacji
export const AuthProvider = ({ children }) => {
  // Stan informujący, czy użytkownik jest zalogowany
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Stan ładowania danych autoryzacji
  const [loading, setLoading] = useState(true);
  // Stan przechowujący dane aktualnie zalogowanego użytkownika
  const [currentUser, setCurrentUser] = useState(null);

  // Sprawdzenie statusu autoryzacji po załadowaniu komponentu
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Pobranie statusu użytkownika z API
        const response = await api.get('/user/status/', { withCredentials: true });
        setIsAuthenticated(true); // Ustawienie stanu zalogowania na true
        setCurrentUser(response.data); // Ustawienie danych użytkownika (id, name, email, role)
        console.log("Current user:", response.data);
      } catch (error) {
        // Jeśli wystąpi błąd, ustaw użytkownika jako niezalogowanego
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setLoading(false); // Wyłączenie stanu ładowania
      }
    };
    checkAuthStatus();
  }, []);

  // Funkcja logowania użytkownika
  const login = (user) => {
    setIsAuthenticated(true); // Ustawienie stanu zalogowania na true
    setCurrentUser(user); // Ustawienie danych użytkownika
    // Opcjonalnie: zapisanie danych użytkownika w localStorage
    localStorage.setItem('user', JSON.stringify(user));
  };

  // Funkcja wylogowania użytkownika
  const logout = () => {
    setIsAuthenticated(false); // Ustawienie stanu zalogowania na false
    setCurrentUser(null); // Wyczyszczenie danych użytkownika
    localStorage.removeItem('user'); // Usunięcie danych użytkownika z localStorage
  };

  return (
    // Udostępnienie wartości kontekstu dla dzieci komponentu
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
      {loading ? <div>Loading...</div> : children} {/* Wyświetlenie komunikatu podczas ładowania */}
    </AuthContext.Provider>
  );
};

// Hook do korzystania z kontekstu autoryzacji
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider'); // Rzucenie błędu, jeśli hook jest używany poza AuthProvider
  }
  return context; // Zwrócenie wartości kontekstu
};
