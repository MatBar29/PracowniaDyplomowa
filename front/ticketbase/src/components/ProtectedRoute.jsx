import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Załóżmy, że masz AuthContext

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Sprawdź, czy użytkownik jest zalogowany

  if (!isAuthenticated) {
    // Jeśli użytkownik nie jest zalogowany, przekieruj go do logowania
    return <Navigate to="/login" />;
  }

  return children; // Zwróć dzieci, jeśli użytkownik jest zalogowany
};

export default ProtectedRoute;
