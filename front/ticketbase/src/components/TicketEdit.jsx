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
    assigned_to: '',
    estimated_hours: '',
    worked_hours: ''
  });
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(`/ticket/${id}`);
        setTicket(response.data);
        setFormData({
          status: response.data.status || '',
          priority: response.data.priority || '',
          assigned_to: response.data.assigned_to?.id || '',
          estimated_hours: response.data.estimated_hours || '',
          worked_hours: response.data.worked_hours || ''
        });
      } catch (err) {
        setError('Nie udało się pobrać ticketa.');
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await api.get('/user/service/');
        setUsers(res.data);
      } catch (err) {
        console.error('Błąd przy pobieraniu użytkowników:', err);
      }
    };

    const fetchUserStatus = async () => {
      try {
        const response = await api.get('/user/status/', { withCredentials: true });
        setUserRole(response.data.role);
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
      const payload = {
        status: formData.status || null,
        priority: formData.priority || null,
        assigned_to: formData.assigned_to !== '' ? parseInt(formData.assigned_to, 10) : null
      };
        
      await api.put(`/ticket/${id}`, payload);
  
      if (userRole === 'admin' && formData.estimated_hours !== '') {
        await api.put(`/ticket/${id}/estimate`, {
          estimated_hours: parseFloat(formData.estimated_hours)
        });
      }
  
      if (userRole === 'service' && formData.worked_hours !== '') {
        await api.put(`/ticket/${id}/log-time`, {
          worked_hours: parseFloat(formData.worked_hours)
        });
      }
  
      navigate('/ticket-list');
    } catch (err) {
      console.error('Błąd przy aktualizacji:', err);
      setError('Błąd przy aktualizacji ticketa.');
    }
  };  

  if (!ticket) return <div className="text-center mt-5">Ładowanie danych ticketa...</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow border-0">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Edytuj Ticket</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          {userRole === 'admin' || userRole === 'service' ? (
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label fw-bold">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="">-- Wybierz --</option>
                  <option value="new">Nowy</option>
                  <option value="in_progress">W trakcie</option>
                  <option value="resolved">Rozwiązany</option>
                  <option value="closed">Zamknięty</option>
                </select>
              </div>

              <div>
                <label className="form-label fw-bold">Priorytet</label>
                <select
                  className="form-select"
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

              <div>
                <label className="form-label fw-bold">Przypisz do</label>
                <select
                  className="form-select"
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

              {userRole === 'admin' && (
                <div>
                  <label className="form-label fw-bold">Przewidywany czas (h)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    name="estimated_hours"
                    value={formData.estimated_hours}
                    onChange={handleChange}
                  />
                </div>
              )}

              {userRole === 'service' && (
                <div>
                  <label className="form-label fw-bold">Wykonany czas (h)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    name="worked_hours"
                    value={formData.worked_hours}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary" type="submit">
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Zapisz zmiany
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/ticket-list')}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Powrót do listy
                </button>
              </div>
            </form>
          ) : (
            <div className="alert alert-danger mt-3">Brak uprawnień do edycji tego ticketu.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketEdit;
