import React from 'react';

// Komponent stopki aplikacji
const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        {/* Sekcja z informacją o prawach autorskich */}
        <div>
          <strong>© {new Date().getFullYear()} TicketBase</strong> — Wszystkie prawa zastrzeżone.
        </div>
        {/* Sekcja z informacjami kontaktowymi */}
        <div className="text-end small">
          <div><strong>Kontakt:</strong> support@ticketbase.pl</div>
          <div><strong>Telefon:</strong> +48 123 456 789</div>
          <div><strong>Adres:</strong> ul. Serwisowa 15, 00-001 Olsztyn</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
