import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const AddTicket = () => {
  const navigate = useNavigate(); // Hook do nawigacji między stronami

  // Stan formularza dla tytułu i opisu zgłoszenia
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Stan dla załączonych plików
  const [files, setFiles] = useState([]);

  // Stan dla błędów
  const [error, setError] = useState(null);

  // Obsługa zmiany wartości w polach formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value })); // Aktualizacja stanu formularza
  };

  // Obsługa zmiany załączonych plików
  const handleFileChange = (e) => {
    setFiles(e.target.files); // Przechowywanie wybranych plików
  };

  // Obsługa wysyłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony
    try {
      // 1. Utwórz zgłoszenie w API
      const response = await api.post("/ticket/", formData, { withCredentials: true });
      const ticketId = response.data.id; // Pobranie ID nowo utworzonego zgłoszenia

      // 2. Dodaj załączniki, jeśli zostały wybrane
      if (files.length > 0) {
        for (const file of files) {
          const formData = new FormData(); // Tworzenie obiektu FormData dla każdego pliku
          formData.append("file", file); // Dodanie pliku do FormData
          await api.post(`/${ticketId}/attachments`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" } // Ustawienie nagłówka dla przesyłania plików
          });
        }
      }

      navigate("/ticket-list"); // Przekierowanie na listę zgłoszeń po sukcesie
    } catch (err) {
      setError("Nie udało się utworzyć zgłoszenia. Spróbuj ponownie."); // Ustawienie błędu w przypadku niepowodzenia
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-4">Nowe Zgłoszenie</h3>

        {/* Wyświetlenie błędu, jeśli wystąpił */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label htmlFor="title" className="form-label fw-bold">Tytuł</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-control"
              placeholder="Wprowadź tytuł"
              value={formData.title}
              onChange={handleChange} // Obsługa zmiany wartości
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="form-label fw-bold">Opis</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className="form-control"
              placeholder="Opisz swój problem"
              value={formData.description}
              onChange={handleChange} // Obsługa zmiany wartości
              required
            />
          </div>

          <div>
            <label htmlFor="attachments" className="form-label fw-bold">
              <FontAwesomeIcon icon={faPaperclip} className="me-2" />
              Załącz pliki
            </label>
            <input
              id="attachments"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,image/jpeg,image/png" // Akceptowane typy plików
              className="form-control"
              onChange={handleFileChange} // Obsługa zmiany załączników
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
            Utwórz Zgłoszenie
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTicket;
