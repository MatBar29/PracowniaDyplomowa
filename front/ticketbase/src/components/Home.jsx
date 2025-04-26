import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicketAlt,
  faPlusCircle,
  faEye,
  faSearch,
  faBell
} from '@fortawesome/free-solid-svg-icons';


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

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title fw-bold">
                  <FontAwesomeIcon icon={faTicketAlt} className="me-2 text-primary" />Zarządzaj zgłoszeniami
                </h5>
                <p className="card-text text-muted">Zobacz wszystkie zgłoszenia, filtruj, edytuj i rozwiązuj problemy.</p>
              </div>
              <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/ticket-list')}>
                Przejdź do listy
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title fw-bold">
                  <FontAwesomeIcon icon={faPlusCircle} className="me-2 text-success" />Nowe zgłoszenie
                </h5>
                <p className="card-text text-muted">Masz problem? Zgłoś go szybko i łatwo, a my zajmiemy się resztą.</p>
              </div>
              <button className="btn btn-success mt-3" onClick={() => navigate('/new-ticket')}>
                <FontAwesomeIcon className="me-2" />
                Utwórz zgłoszenie
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
