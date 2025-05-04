import React from 'react';
import Navbar from './Navbar'; // Import komponentu nawigacji

// Komponent Layout - szkielet aplikacji
const Layout = ({ children }) => {
  return (
    <>
      {/* Komponent nawigacji wyświetlany na każdej stronie */}
      <Navbar />
      {/* Główna zawartość strony */}
      <main className="container mt-4">
        {children} {/* Renderowanie dzieci przekazanych do Layout */}
      </main>
    </>
  );
};

export default Layout; // Eksport komponentu Layout
