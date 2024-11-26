import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // Zaimportuj komponent ProtectedRoute
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Poprawne użycie ProtectedRoute w Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home /> {/* Komponent Home będzie renderowany, jeśli użytkownik jest zalogowany */}
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
