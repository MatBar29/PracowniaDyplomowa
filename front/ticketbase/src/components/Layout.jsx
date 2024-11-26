import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="container mt-4">
        {children}
      </main>
    </>
  );
};

export default Layout;
