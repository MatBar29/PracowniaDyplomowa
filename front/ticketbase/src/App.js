import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Komponent nawigacji
import Home from './components/Home'; // Strona główna
import Login from './components/Login'; // Strona logowania
import Register from './components/Register'; // Strona rejestracji
import AddTicket from './components/AddTicket'; // Formularz dodawania zgłoszenia
import ProtectedRoute from './components/ProtectedRoute'; // Ochrona tras dla zalogowanych użytkowników
import TicketList from './components/TicketList'; // Lista zgłoszeń
import TicketEdit from './components/TicketEdit'; // Edycja zgłoszenia
import './App.css'; // Stylizacja aplikacji
import TicketDetails from './components/TicketDetails'; // Szczegóły zgłoszenia
import AdminPanel from './components/AdminPanel'; // Panel administratora
import Footer from './components/Footer'; // Stopka aplikacji

function App() {
  return (
    <Router>
      {/* Komponent nawigacji wyświetlany na każdej stronie */}
      <Navbar />
      <Routes>
        {/* Trasa logowania */}
        <Route path="/login" element={<Login />} />
        {/* Trasa rejestracji */}
        <Route path="/register" element={<Register />} />

        {/* Trasa strony głównej chroniona dla zalogowanych użytkowników */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* Trasa dodawania nowego zgłoszenia chroniona dla zalogowanych użytkowników */}
        <Route
          path="/new-ticket"
          element={
            <ProtectedRoute>
              <AddTicket />
            </ProtectedRoute>
          }
        />
        {/* Trasa listy zgłoszeń chroniona dla zalogowanych użytkowników */}
        <Route
          path="/ticket-list"
          element={
            <ProtectedRoute>
              <TicketList />
            </ProtectedRoute>
          }
        />
        {/* Trasa edycji zgłoszenia chroniona dla zalogowanych użytkowników */}
        <Route
          path="/tickets/edit/:id"
          element={
            <ProtectedRoute>
              <TicketEdit />
            </ProtectedRoute>
          }
        />
        {/* Trasa szczegółów zgłoszenia chroniona dla zalogowanych użytkowników */}
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetails />
            </ProtectedRoute>
          }
        />
        {/* Trasa panelu administratora chroniona dla zalogowanych użytkowników */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* Komponent stopki wyświetlany na każdej stronie */}
      <Footer />
    </Router>
  );
}

export default App; // Eksport głównego komponentu aplikacji
