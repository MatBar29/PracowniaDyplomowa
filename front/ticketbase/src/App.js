import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AddTicket from './components/AddTicket';
import './App.css';

function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Możesz pokazać ładowanie, dopóki status nie będzie sprawdzony
  }

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home /> // Jeśli zalogowany, renderuj Home
              ) : (
                <Navigate to="/login" /> // Przekierowanie do logowania
              )
            }
          />
          <Route
            path="/new-ticket"
            element={
              isAuthenticated ? (
                <AddTicket />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
