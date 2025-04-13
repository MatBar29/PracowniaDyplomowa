import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt, faPlus, faSignOutAlt, faUserShield, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { isAuthenticated, logout, currentUser } = useAuth();
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

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FontAwesomeIcon icon={faTicketAlt} className="me-2" />
          <strong>TicketBase</strong>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm" to="/ticket-list">
                    <FontAwesomeIcon icon={faTicketAlt} className="me-1" />
                    Lista
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-success btn-sm" to="/new-ticket">
                    <FontAwesomeIcon icon={faPlus} className="me-1" />
                    Nowy Ticket
                  </Link>
                </li>
                {currentUser?.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="btn btn-outline-warning btn-sm" to="/admin">
                      <FontAwesomeIcon icon={faUserShield} className="me-1" />
                      Panel Admina
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                    Wyloguj
                  </button>
                </li>
                <li className="nav-item">
                  <span className="badge bg-secondary ms-2 text-uppercase">
                    {getInitials(currentUser?.name)}
                  </span>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-outline-primary btn-sm" to="/login">
                  <FontAwesomeIcon icon={faSignInAlt} className="me-1" />
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
