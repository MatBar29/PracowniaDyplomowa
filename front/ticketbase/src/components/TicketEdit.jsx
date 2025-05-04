import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Komponent do edycji zgłoszenia
const TicketEdit = () => {
  const { id } = useParams(); // Pobranie ID zgłoszenia z parametrów URL
  const navigate = useNavigate(); // Hook do nawigacji między stronami

  // Stany komponentu
  const [ticket, setTicket] = useState(null); // Szczegóły zgłoszenia
  const [users, setUsers] = useState([]); // Lista użytkowników
  const [formData, setFormData] = useState({
    status: '', // Status zgłoszenia
    priority: '', // Priorytet zgłoszenia
    assigned_to: '', // Przypisany użytkownik
    estimated_hours: '', // Przewidywany czas realizacji
    worked_hours: '' // Wykonany czas pracy
  });
  const [error, setError] = useState(null); // Komunikat o błędzie
  const [userRole, setUserRole] = useState(null); // Rola aktualnie zalogowanego użytkownika

  // Pobranie danych zgłoszenia, użytkowników i statusu użytkownika po załadowaniu komponentu
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(`/ticket/${id}`); // Pobranie szczegółów zgłoszenia z API
        setTicket(response.data); // Ustawienie szczegółów zgłoszenia
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
        const res = await api.get('/user/service/'); // Pobranie listy użytkowników z rolą "service"
        setUsers(res.data);
      } catch (err) {
        console.error('Błąd przy pobieraniu użytkowników:', err);
      }
    };

    const fetchUserStatus = async () => {
      try {
        const response = await api.get('/user/status/', { withCredentials: true }); // Pobranie statusu zalogowanego użytkownika
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Błąd przy pobieraniu danych użytkownika:', error);
      }
    };

    fetchTicket();
    fetchUsers();
    fetchUserStatus();
  }, [id]);

  // Obsługa zmiany wartości w polach formularza
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value })); // Aktualizacja stanu formularza
  };

  // Obsługa wysyłania formularza edycji zgłoszenia
  const handleSubmit = async e => {
    e.preventDefault(); // Zapobiega przeładowaniu strony
  
    try {
      const payload = {
        status: formData.status || null, // Status zgłoszenia
        priority: formData.priority || null, // Priorytet zgłoszenia
        assigned_to: formData.assigned_to !== '' ? parseInt(formData.assigned_to, 10) : null // Przypisany użytkownik
      };
        
      await api.put(`/ticket/${id}`, payload); // Aktualizacja zgłoszenia w API
  
      // Dodatkowe operacje dla administratora
      if (userRole === 'admin' && formData.estimated_hours !== '') {
        await api.put(`/ticket/${id}/estimate`, {
          estimated_hours: parseFloat(formData.estimated_hours) // Aktualizacja przewidywanego czasu realizacji
        });
      }
  
      // Dodatkowe operacje dla serwisanta
      if (userRole === 'service' && formData.worked_hours !== '') {
        await api.put(`/ticket/${id}/log-time`, {
          worked_hours: parseFloat(formData.worked_hours) // Aktualizacja przepracowanego czasu
        });
      }
  
      navigate('/ticket-list'); // Przekierowanie na listę zgłoszeń po sukcesie
    } catch (err) {
      console.error('Błąd przy aktualizacji:', err);
      setError('Błąd przy aktualizacji ticketa.'); // Ustawienie komunikatu o błędzie
    }
  };  

  // Wyświetlenie komunikatu podczas ładowania danych zgłoszenia
  if (!ticket) return <div className="text-center mt-5">Ładowanie danych ticketa...</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow border-0">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Edytuj Ticket</h3>

          {/* Wyświetlenie komunikatu o błędzie */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Formularz edycji zgłoszenia */}
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

              {/* Pole dla administratora do ustawienia przewidywanego czasu */}
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

              {/* Pole dla serwisanta do ustawienia przepracowanego czasu */}
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

              {/* Przyciski do zapisania zmian i powrotu do listy */}
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
            // Komunikat o braku uprawnień
            <div className="alert alert-danger mt-3">Brak uprawnień do edycji tego ticketu.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketEdit; // Eksport komponentu edycji zgłoszenia
