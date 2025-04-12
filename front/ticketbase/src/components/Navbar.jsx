import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Navbar = () => {
  const { isAuthenticated, logout, currentUser } = useAuth(); // Dodano currentUser
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/login/logout", {}, { withCredentials: true });
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Wystąpił błąd podczas wylogowywania. Spróbuj ponownie.");
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
                  <Link className="btn btn-outline-light me-3" to="/ticket-list">
                    Lista
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-success me-3" to="/new-ticket">
                    Nowy Ticket
                  </Link>
                </li>
                {currentUser?.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="btn btn-outline-warning me-3" to="/admin">
                      Panel Admina
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Wyloguj
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-outline-primary" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
