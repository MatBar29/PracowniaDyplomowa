import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie'; // Importuj js-cookie


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth(); // zostaje
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

        // 🟡 Pobierz status użytkownika z backendu (w tym rolę!)
        const statusResponse = await api.get("/user/status/", { withCredentials: true });
        login(statusResponse.data); // 🟢 Teraz ustawiamy currentUser z pełną rolą
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
      <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Logowanie</h3>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password">Hasło:</label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-center mt-3">
              <span>Nie masz konta? </span>
              <a href="/register" className="text-primary">Zarejestruj się</a>
          </div>

            <button type="submit" className="btn btn-primary w-100">Zaloguj się</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
