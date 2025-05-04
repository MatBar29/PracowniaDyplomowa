import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import kontekstu autoryzacji

// Komponent chroniący trasę - dostęp tylko dla zalogowanych użytkowników
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Sprawdzenie, czy użytkownik jest zalogowany

  if (!isAuthenticated) {
    // Jeśli użytkownik nie jest zalogowany, przekieruj go na stronę logowania
    return <Navigate to="/login" />;
  }

  return children; // Jeśli użytkownik jest zalogowany, renderuj przekazane dzieci
};

export default ProtectedRoute; // Eksport komponentu chroniącego trasę
