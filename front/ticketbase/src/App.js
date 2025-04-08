import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AddTicket from './components/AddTicket';
import ProtectedRoute from './components/ProtectedRoute';
import TicketList from './components/TicketList';
import TicketEdit from './components/TicketEdit';
import './App.css';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-ticket"
          element={
            <ProtectedRoute>
              <AddTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket-list"
          element={
            <ProtectedRoute>
              <TicketList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/edit/:id"
          element={
            <ProtectedRoute>
              <TicketEdit />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
