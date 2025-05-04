import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faUserPlus } from "@fortawesome/free-solid-svg-icons";

// Komponent rejestracji użytkownika
const Register = () => {
  // Stan dla danych formularza rejestracji
  const [formData, setFormData] = useState({
    name: "", // Imię użytkownika
    email: "", // Adres e-mail użytkownika
    password: "", // Hasło użytkownika
    role: "user", // Domyślna rola użytkownika
  });

  // Stan dla komunikatów o błędach
  const [error, setError] = useState("");
  // Stan dla komunikatów o sukcesie
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Hook do nawigacji między stronami

  // Obsługa zmiany wartości w polach formularza
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Aktualizacja stanu formularza
  };

  // Obsługa wysyłania formularza rejestracji
  const handleRegister = async (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony

    const password = formData.password;

    // Walidacja hasła: min. 8 znaków i przynajmniej jedna cyfra
    const hasMinimumLength = password.length >= 8;
    const hasNumber = /\d/.test(password);

    if (!hasMinimumLength || !hasNumber) {
      setError("Hasło musi mieć co najmniej 8 znaków i zawierać przynajmniej jedną cyfrę.");
      return;
    }

    try {
      // Wysłanie danych rejestracyjnych do API
      await api.post("/user/", formData);
      setSuccess("Rejestracja zakończona sukcesem! Przekierowanie do logowania...");
      setError(""); // Wyczyść ewentualny wcześniejszy błąd
      setTimeout(() => navigate("/login"), 2000); // Przekierowanie do logowania po 2 sekundach
    } catch (err) {
      setError("Wystąpił błąd podczas rejestracji"); // Ustawienie błędu w przypadku niepowodzenia
      setSuccess(""); // Wyczyść ewentualny wcześniejszy sukces
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Rejestracja</h2>
          <p className="text-muted">Załóż nowe konto w TicketBase</p>
        </div>

        {/* Wyświetlenie komunikatu o błędzie, jeśli wystąpił */}
        {error && <div className="alert alert-danger">{error}</div>}
        {/* Wyświetlenie komunikatu o sukcesie, jeśli wystąpił */}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Formularz rejestracji */}
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
                onChange={handleInputChange} // Obsługa zmiany wartości
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
                onChange={handleInputChange} // Obsługa zmiany wartości
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
                onChange={handleInputChange} // Obsługa zmiany wartości
                required
              />
            </div>
          </div>

          {/* Przycisk rejestracji */}
          <button type="submit" className="btn btn-primary w-100">
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
            Zarejestruj się
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register; // Eksport komponentu rejestracji
