import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Hook do uzyskania informacji o logowaniu

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Sprawdzamy, czy użytkownik jest zalogowany

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Przekierowanie na stronę logowania, jeśli użytkownik nie jest zalogowany
  }

  return children; // Jeśli użytkownik jest zalogowany, renderujemy przekazany komponent (Home)
};

export default ProtectedRoute;
