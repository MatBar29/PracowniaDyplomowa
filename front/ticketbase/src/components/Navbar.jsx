import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicketAlt, faPlus, faSignOutAlt,
  faUserShield, faSignInAlt, faUserCircle
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { isAuthenticated, logout, currentUser } = useAuth(); // Pobranie stanu autoryzacji i danych użytkownika
  const navigate = useNavigate(); // Hook do nawigacji między stronami

  // Funkcja obsługująca wylogowanie użytkownika
  const handleLogout = async () => {
    try {
      await api.post("/login/logout", {}, { withCredentials: true }); // Wylogowanie w API
      logout(); // Wyczyszczenie stanu autoryzacji
      navigate("/"); // Przekierowanie na stronę główną
    } catch (error) {
      console.error("Logout error:", error);
      alert("Wystąpił błąd podczas wylogowywania. Spróbuj ponownie.");
    }
  };

  // Funkcja do generowania inicjałów użytkownika na podstawie imienia i nazwiska
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* Logo aplikacji z linkiem do strony głównej */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FontAwesomeIcon icon={faTicketAlt} className="me-2" />
          <strong>TicketBase</strong>
        </Link>
        {/* Przycisk rozwijania menu na urządzeniach mobilnych */}
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
                {/* Link do listy zgłoszeń */}
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm" to="/ticket-list">
                    <FontAwesomeIcon icon={faTicketAlt} className="me-1" />
                    Lista
                  </Link>
                </li>
                {/* Link do tworzenia nowego zgłoszenia */}
                <li className="nav-item">
                  <Link className="btn btn-outline-success btn-sm" to="/new-ticket">
                    <FontAwesomeIcon icon={faPlus} className="me-1" />
                    Nowy Ticket
                  </Link>
                </li>

                {/* Dropdown z opcjami użytkownika */}
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                    {currentUser?.name} {/* Wyświetlenie imienia użytkownika */}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end mt-2" aria-labelledby="userDropdown">
                    <li>
                      <span className="dropdown-item-text text-muted">
                        Rola: <strong>{currentUser?.role}</strong> {/* Wyświetlenie roli użytkownika */}
                      </span>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    {/* Link do panelu administratora, jeśli użytkownik jest adminem */}
                    {currentUser?.role === 'admin' && (
                      <li>
                        <Link className="dropdown-item" to="/admin">
                          <FontAwesomeIcon icon={faUserShield} className="me-2" />
                          Panel Admina
                        </Link>
                      </li>
                    )}
                    {/* Przycisk wylogowania */}
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                        Wyloguj
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              // Link do logowania, jeśli użytkownik nie jest zalogowany
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

export default Navbar; // Eksport komponentu nawigacji
