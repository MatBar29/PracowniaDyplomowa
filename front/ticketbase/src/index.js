import React from 'react'; // Import biblioteki React
import ReactDOM from 'react-dom'; // Import biblioteki ReactDOM do renderowania komponentów w DOM
import './index.css'; // Import globalnych stylów CSS
import App from './App'; // Import głównego komponentu aplikacji
import { AuthProvider } from './context/AuthContext'; // Import providera kontekstu autoryzacji

// Renderowanie aplikacji w elemencie o ID "root"
ReactDOM.render(
  <AuthProvider> {/* Owijanie aplikacji w provider kontekstu autoryzacji */}
    <App /> {/* Główny komponent aplikacji */}
  </AuthProvider>,
  document.getElementById('root') // Element DOM, w którym aplikacja zostanie wyrenderowana
);
