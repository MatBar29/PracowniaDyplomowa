// components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
  
    try {
      // Wysyłanie danych w odpowiednim formacie
      await api.post("/login/", formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true });
  
      // Przekierowanie na stronę główną
      navigate("/home");
    } catch (err) {
      setError("Niepoprawne dane logowania");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
