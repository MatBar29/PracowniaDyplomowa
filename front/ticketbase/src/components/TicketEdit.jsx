import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const TicketEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    assigned_to: ''
  });
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); // Nowy stan do przechowywania roli użytkownika

  // Pobierz ticketa
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(`/ticket/${id}`);
        setTicket(response.data);
        setFormData({
          status: response.data.status || '',
          priority: response.data.priority || '',
          assigned_to: response.data.assigned_to?.id || ''
        });
      } catch (err) {
        setError('Nie udało się pobrać ticketa.');
      }
    };

    const fetchUsers = async () => {
        try {
          const res = await api.get('/user/service/');
          console.log("Użytkownicy: ", res.data); // Sprawdzanie odpowiedzi
          setUsers(res.data);
        } catch (err) {
          console.error('Błąd przy pobieraniu użytkowników:', err);
        }
      };
      

    const fetchUserStatus = async () => {
      try {
        const response = await api.get('/user/status/', { withCredentials: true });
        setUserRole(response.data.role);  // Ustawiamy rolę użytkownika
      } catch (error) {
        console.error('Błąd przy pobieraniu danych użytkownika:', error);
      }
    };

    fetchTicket();
    fetchUsers();
    fetchUserStatus();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.put(`/ticket/${id}`, {
        status: formData.status || null,
        priority: formData.priority || null,
        assigned_to: formData.assigned_to || null
      });
      navigate('/ticket-list');
    } catch (err) {
      setError('Błąd przy aktualizacji ticketa.');
    }
  };

  if (!ticket) return <div>Ładowanie danych ticketa...</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Edytuj Ticket</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {userRole === 'admin' || userRole === 'service' ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">-- Wybierz --</option>
              <option value="open">Otwarty</option>
              <option value="in_progress">W trakcie</option>
              <option value="closed">Zamknięty</option>
            </select>
          </div>

          <div className="form-group mt-3">
            <label>Priorytet</label>
            <select
              className="form-control"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="">-- Wybierz --</option>
              <option value="low">Niski</option>
              <option value="medium">Średni</option>
              <option value="high">Wysoki</option>
            </select>
          </div>

          <div className="form-group mt-3">
            <label>Przypisz do</label>
            <select
              className="form-control"
              name="assigned_to"
              value={formData.assigned_to || ''}
              onChange={handleChange}
            >
              <option value="">-- Nieprzypisane --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 d-flex justify-content-between">
            <button className="btn btn-primary" type="submit">
              <FontAwesomeIcon icon={faSave} className="mr-2" /> Zapisz zmiany
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/ticket-list')}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Powrót do listy
            </button>
          </div>
        </form>
      ) : (
        <div className="alert alert-danger">Brak uprawnień do edycji tego ticketu.</div>
      )}
    </div>
  );
};

export default TicketEdit;
