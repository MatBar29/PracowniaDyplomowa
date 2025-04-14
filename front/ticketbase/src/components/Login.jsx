import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await api.post("/login/", formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true
      });

      const token = response.data.token;
      if (token) {
        Cookies.set('jwt_token', token, { expires: 7 });

        const statusResponse = await api.get("/user/status/", { withCredentials: true });
        login(statusResponse.data);
        navigate("/");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || 'Niepoprawne dane logowania');
      } else {
        setError('Wystąpił problem z połączeniem');
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Logowanie</h2>
          <p className="text-muted">Zaloguj się do TicketBase</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Hasło:</label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
            Zaloguj się
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">Nie masz konta? </span>
          <a href="/register" className="text-decoration-none fw-semibold">Zarejestruj się</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
