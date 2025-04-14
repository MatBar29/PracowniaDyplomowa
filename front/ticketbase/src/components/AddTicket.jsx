import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const AddTicket = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Utwórz ticket
      const response = await api.post("/ticket/", formData, { withCredentials: true });
      const ticketId = response.data.id;

      // 2. Dodaj załączniki jeśli są
      if (files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          await api.post(`/${ticketId}/attachments`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
          });
        }
      }

      navigate("/ticket-list"); // przekierowanie po dodaniu
    } catch (err) {
      setError("Nie udało się utworzyć zgłoszenia. Spróbuj ponownie.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-4">Nowe Zgłoszenie</h3>

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
              onChange={handleChange}
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
              onChange={handleChange}
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
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="form-control"
              onChange={handleFileChange}
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
