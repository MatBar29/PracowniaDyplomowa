import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faTicketAlt } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      {/* Hero Section */}
      <div className="row mb-5 text-center">
        <div className="col">
          <h1 className="display-1 fw-bold text-primary">🎫 TicketBase</h1>
          <p className="lead text-muted fs-4">Twój zaufany asystent zgłoszeń!</p>
        </div>
      </div>

      {/* About Us */}
      <div className="row mb-5 align-items-center">
        <div className="col-md-6">
          <h2 className="fs-1 mb-3 fw-semibold">O TicketBase</h2>
          <p className="fs-5 text-secondary">
            TicketBase to narzędzie zaprojektowane, aby ułatwić ci zgłaszanie problemów oraz monitorowanie ich stanu. Nasz zespół supportu reaguje szybko, by zapewnić ci jak najlepszą pomoc.
          </p>
        </div>
        <div className="col-md-6">
          <img src="/img1.jpg" alt="TicketBase" className="img-fluid rounded shadow-sm" />
        </div>
      </div>

      {/* Features */}
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <img src="https://via.placeholder.com/350x150" className="card-img-top" alt="Manage Tickets" />
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title fw-bold"><FontAwesomeIcon icon={faTicketAlt} className="me-2 text-primary" />Zarządzaj zgłoszeniami</h5>
                <p className="card-text text-muted">Przeglądaj, edytuj i śledź status swoich zgłoszeń w jednym miejscu.</p>
              </div>
              <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/my-tickets')}>
                Przejdź do zgłoszeń
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <img src="https://via.placeholder.com/350x150" className="card-img-top" alt="Search Tickets" />
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title fw-bold"><FontAwesomeIcon icon={faSearch} className="me-2 text-primary" />Wyszukaj zgłoszenie</h5>
                <p className="card-text text-muted">Znajduj zgłoszenia szybko dzięki inteligentnemu filtrowaniu i wyszukiwaniu.</p>
              </div>
              <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/search-tickets')}>
                Wyszukaj zgłoszenie
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <img src="https://via.placeholder.com/350x150" className="card-img-top" alt="Notifications" />
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title fw-bold"><FontAwesomeIcon icon={faBell} className="me-2 text-primary" />Powiadomienia</h5>
                <p className="card-text text-muted">Otrzymuj na bieżąco powiadomienia o odpowiedziach i zmianie statusu.</p>
              </div>
              <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/notifications')}>
                Zobacz powiadomienia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
