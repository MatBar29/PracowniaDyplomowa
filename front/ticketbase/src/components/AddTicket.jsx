import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Zdefiniowane połączenie z backendem

const AddTicket = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/ticket/', formData, { withCredentials: true });
      navigate('/'); // Po utworzeniu wróć do strony głównej
    } catch (err) {
      setError('Failed to create ticket. Please try again.');
    }
  };

  return (
    <div className="add-ticket-container">
      <h2>Utwórz nowy Ticket</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="Tytuł" className="form-label">Tytuł</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Opis" className="form-label">Opis</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Create Ticket</button>
      </form>
    </div>
  );
};

export default AddTicket;