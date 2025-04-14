import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faUserPlus } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/", formData);
      setSuccess("Rejestracja zakończona sukcesem! Przekierowanie do logowania...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Wystąpił błąd podczas rejestracji");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Rejestracja</h2>
          <p className="text-muted">Załóż nowe konto w TicketBase</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Imię:</label>
            <div className="input-group">
              <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <div className="input-group">
              <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Hasło:</label>
            <div className="input-group">
              <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
            Zarejestruj się
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
