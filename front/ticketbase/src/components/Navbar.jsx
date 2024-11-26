import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Hook do używania kontekstu
import api from '../api';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth(); // Sprawdzamy stan logowania
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/login/logout", {}, { withCredentials: true }); // Wylogowanie
      logout(); // Zmiana stanu logowania w kontekście
      navigate("/"); // Przekierowanie na stronę główną
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand text-white" to="/">
          <strong>TicketBase</strong>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light me-3" to="/home">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-success me-3" to="/new-ticket">
                    New Ticket
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : null} {/* Jeśli użytkownik nie jest zalogowany, nie wyświetlamy nic */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;