import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Hook do używania kontekstu

const Home = () => {
  const navigate = useNavigate();

  const handleNewTicket = () => {
    navigate('/new-ticket'); // Przekierowanie do strony tworzenia nowego zgłoszenia
  };

  return (
    <div className="container mt-5">
      {/* Hero Section */}
      <div className="row mb-5 text-center">
        <div className="col">
          <h1 className="display-1">Witamy w TicketBase</h1>
          <p className="lead text-muted">Twój zaufany asystent zgłoszeń!</p>
        </div>
      </div>

    {/* About Us Section */}
    <div className="row mb-5">
      <div className="col-md-6">
        <h2 className="h2 fs-1">O TicketBase</h2> {/* Zwiększ rozmiar czcionki dla nagłówka */}
        <p className="fs-4">TicketBase to narzędzie zaprojektowane aby ułatwić ci zgłaszanie twoich problemów oraz monitorowanie stanu twojego zgłoszenia. Ułatwia on również szybkie reagowanie oraz rozwiązywanie problemów naszemu supportowi aby jak najlepiej i najszybciej pomóc ci w twojej potrzebie</p>
      </div>
      <div className="col-md-6">
        <img src="/img1.jpg" alt="About TicketBase" className="img-fluid rounded" />
      </div>
    </div>


      {/* Recommended Features Section */}
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-lg">
            <img src="https://via.placeholder.com/350x150" className="card-img-top" alt="Manage Tickets" />
            <div className="card-body">
              <h5 className="card-title">Manage Your Tickets</h5>
              <p className="card-text">View, update, and track the status of your open and past tickets.</p>
              <button className="btn btn-outline-primary" onClick={() => navigate('/my-tickets')}>View Tickets</button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow-lg">
            <img src="https://via.placeholder.com/350x150" className="card-img-top" alt="Search Tickets" />
            <div className="card-body">
              <h5 className="card-title">Search Tickets</h5>
              <p className="card-text">Easily find specific tickets by using the advanced search functionality.</p>
              <button className="btn btn-outline-primary" onClick={() => navigate('/search-tickets')}>Search Tickets</button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow-lg">
            <img src="https://via.placeholder.com/350x150" className="card-img-top" alt="Notifications" />
            <div className="card-body">
              <h5 className="card-title">Ticket Notifications</h5>
              <p className="card-text">Receive real-time updates when your ticket status changes or when a response is posted.</p>
              <button className="btn btn-outline-primary" onClick={() => navigate('/notifications')}>View Notifications</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
