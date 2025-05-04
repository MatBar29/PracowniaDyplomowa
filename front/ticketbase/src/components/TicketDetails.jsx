import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import moment from 'moment';
import 'moment/locale/pl'; // Ustawienie lokalizacji na polską

// Komponent szczegółów zgłoszenia
const TicketDetails = () => {
  const { id } = useParams(); // Pobranie ID zgłoszenia z parametrów URL
  const navigate = useNavigate(); // Hook do nawigacji między stronami

  // Stany komponentu
  const [ticket, setTicket] = useState(null); // Szczegóły zgłoszenia
  const [attachments, setAttachments] = useState([]); // Lista załączników
  const [loading, setLoading] = useState(true); // Stan ładowania danych
  const [error, setError] = useState(null); // Komunikat o błędzie
  const [newComment, setNewComment] = useState(''); // Nowy komentarz
  const [submitting, setSubmitting] = useState(false); // Stan wysyłania komentarza
  const [workedHours, setWorkedHours] = useState(''); // Liczba przepracowanych godzin
  const [isSubmittingHours, setIsSubmittingHours] = useState(false); // Stan wysyłania godzin
  const [isClosingTicket, setIsClosingTicket] = useState(false); // Stan zamykania zgłoszenia
  const [userRole, setUserRole] = useState(null); // Rola aktualnie zalogowanego użytkownika

  // Funkcja do pobierania szczegółów zgłoszenia
  const fetchTicketDetails = async () => {
    try {
      const response = await api.get(`/ticket/${id}`); // Pobranie szczegółów zgłoszenia z API
      setTicket(response.data); // Ustawienie szczegółów zgłoszenia
      setLoading(false); // Wyłączenie stanu ładowania
    } catch (err) {
      console.error('Błąd przy pobieraniu szczegółów ticketa:', err);
      setError('Nie udało się pobrać szczegółów ticketa.');
      setLoading(false);
    }
  };

  // Funkcja do pobierania załączników zgłoszenia
  const fetchAttachments = async () => {
    try {
      const response = await api.get(`/${id}/attachments`, { withCredentials: true });
      setAttachments(response.data); // Ustawienie załączników
    } catch (err) {
      console.error('Błąd przy pobieraniu załączników:', err);
    }
  };

  // Funkcja do pobierania statusu użytkownika
  const fetchUserStatus = async () => {
    try {
      const res = await api.get('/user/status/', { withCredentials: true });
      setUserRole(res.data.role); // Ustawienie roli użytkownika
    } catch (err) {
      console.error('Błąd przy pobieraniu statusu użytkownika:', err);
    }
  };

  // Pobranie danych po załadowaniu komponentu
  useEffect(() => {
    fetchTicketDetails();
    fetchAttachments();
    fetchUserStatus();
  }, [id]);

  // Funkcja do dodawania komentarza
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // Sprawdzenie, czy komentarz nie jest pusty
    setSubmitting(true);
    try {
      await api.post('/comment', {
        ticket_id: parseInt(id),
        comment: newComment
      });
      setNewComment(''); // Wyczyszczenie pola komentarza
      await fetchTicketDetails(); // Odświeżenie szczegółów zgłoszenia
    } catch (err) {
      console.error('Błąd przy dodawaniu komentarza:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Funkcja do logowania przepracowanych godzin
  const handleLogHours = async (e) => {
    e.preventDefault();
    if (!workedHours || isNaN(workedHours)) return; // Sprawdzenie poprawności danych
    setIsSubmittingHours(true);
    try {
      await api.put(`/ticket/${id}/log-time`, {
        worked_hours: parseFloat(workedHours)
      });
      setWorkedHours(''); // Wyczyszczenie pola godzin
      await fetchTicketDetails(); // Odświeżenie szczegółów zgłoszenia
    } catch (err) {
      console.error('Błąd przy dodawaniu godzin:', err);
    } finally {
      setIsSubmittingHours(false);
    }
  };

  // Funkcja do zamykania zgłoszenia
  const handleCloseTicket = async () => {
    if (!window.confirm('Czy na pewno chcesz oznaczyć ticket jako zakończony?')) return;
    setIsClosingTicket(true);
    try {
      await api.put(`/ticket/${id}`, { status: 'closed' });
      await fetchTicketDetails(); // Odświeżenie szczegółów zgłoszenia
    } catch (err) {
      console.error('Błąd przy zamykaniu ticketa:', err);
    } finally {
      setIsClosingTicket(false);
    }
  };

  // Funkcja do generowania inicjałów użytkownika
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0].toUpperCase())
      .join('');
  };

  // Funkcja do tłumaczenia statusu zgłoszenia
  const translateStatus = (status) => {
    switch (status) {
      case 'new':
        return 'Nowy';
      case 'in_progress':
        return 'W trakcie';
      case 'resolved':
        return 'Rozwiązany';
      case 'closed':
        return 'Zamknięty';
      default:
        return status;
    }
  };

  // Funkcja do tłumaczenia priorytetu zgłoszenia
  const translatePriority = (priority) => {
    switch (priority) {
      case 'low':
        return 'Niski';
      case 'medium':
        return 'Średni';
      case 'high':
        return 'Wysoki';
      default:
        return priority;
    }
  };

  // Wyświetlenie komunikatów w zależności od stanu
  if (loading) return <div>Ładowanie szczegółów...</div>;
  if (error) return <div>{error}</div>;
  if (!ticket) return <div>Ticket nie znaleziony</div>;

  return (
    <div className="container mt-4">
      {/* Szczegóły zgłoszenia */}
      <div className="mb-3">
        <button onClick={() => navigate('/ticket-list')} className="btn btn-outline-secondary">
          ← Powrót do listy
        </button>
      </div>

      {/* Wyświetlenie szczegółów zgłoszenia */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title">{ticket.title}</h3>
          <p className="card-text"><strong>Opis:</strong> {ticket.description}</p>

          {/* Wyświetlenie statusu, priorytetu i przypisanego użytkownika */}
          <div className="row mb-2 align-items-center">
            <div className="col-md-4">
              <strong>Status:</strong>{' '}
              <span className="badge bg-info text-dark">{translateStatus(ticket.status)}</span>
            </div>
            <div className="col-md-4">
              <strong>Priorytet:</strong>{' '}
              <span className="badge bg-warning text-dark">{translatePriority(ticket.priority)}</span>
            </div>
            <div className="col-md-4">
              <strong>Przypisany do:</strong>{' '}
              {ticket.assigned_to ? ticket.assigned_to.name : 'Nieprzypisane'}
            </div>
          </div>

          {/* Sekcja dla serwisantów */}
          {userRole === 'service' && (
            <div className="row mb-3">
              <div className="col-md-6 d-flex align-items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="Dodaj godziny"
                  value={workedHours}
                  onChange={(e) => setWorkedHours(e.target.value)}
                />
                <button onClick={handleLogHours} className="btn btn-primary" disabled={isSubmittingHours}>
                  {isSubmittingHours ? 'Zapisuję...' : 'Dodaj godziny'}
                </button>
              </div>
              <div className="col-md-6 text-end">
                {(ticket.status === 'in_progress' || ticket.status === 'resolved') && (
                  <button className="btn btn-success" onClick={handleCloseTicket} disabled={isClosingTicket}>
                    {isClosingTicket ? 'Zamykam...' : 'Zamknij ticket'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Wyświetlenie szczegółów twórcy i dat */}
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Utworzył:</strong> {ticket.creator.name}
            </div>
            <div className="col-md-6">
              <strong>Utworzono:</strong> {moment(ticket.created_at).format('LLL')}
            </div>
          </div>

          <div className="mb-3">
            <strong>Aktualizacja:</strong> {moment(ticket.updated_at).format('LLL')}
          </div>

          {/* Wyświetlenie progresu pracy */}
          {ticket.estimated_hours ? (
            <div className="mb-4">
              <h5 className="mb-2">Progres pracy:</h5>
              <div className="progress" style={{ height: '25px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${Math.min(100, (ticket.worked_hours / ticket.estimated_hours) * 100)}%`
                  }}
                  aria-valuenow={ticket.worked_hours}
                  aria-valuemin="0"
                  aria-valuemax={ticket.estimated_hours}
                >
                  {ticket.worked_hours}h / {ticket.estimated_hours}h
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h5 className="mb-2">Progres pracy:</h5>
              <p className="text-muted">Brak przewidywanego czasu pracy.</p>
            </div>
          )}

          {/* Wyświetlenie załączników */}
          <div className="mt-4">
            <h5 className="mb-3">Załączniki:</h5>
            {attachments.length === 0 ? (
              <p className="text-muted">Brak załączników dla tego ticketa.</p>
            ) : (
              <div className="row g-3">
                {attachments.map(file => {
                  const isImage = /\.(jpg|jpeg|png)$/i.test(file.filename);
                  const fileUrl = `http://localhost:8000/attachments/${file.filename}`;
                  return (
                    <div key={file.id} className="col-6 col-md-4 col-lg-3">
                      <div className="border rounded p-2 text-center bg-white shadow-sm h-100 d-flex flex-column justify-content-between">
                        {isImage ? (
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={fileUrl}
                              alt={file.filename}
                              className="img-fluid rounded mb-2"
                              style={{ maxHeight: '150px', objectFit: 'cover' }}
                            />
                          </a>
                        ) : (
                          <>
                            <p className="mb-2 small text-truncate">{file.filename}</p>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                              Pobierz
                            </a>
                          </>
                        )}
                        <small className="text-muted d-block text-truncate">{file.filename}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wyświetlenie komentarzy */}
      <h4>Komentarze</h4>
      {ticket.comments.length === 0 ? (
        <p>Brak komentarzy.</p>
      ) : (
        <div className="d-flex flex-column gap-3 mb-4">
          {ticket.comments.map((comment, index) => {
            const isAuthor = comment.user?.email === ticket.creator.email;
            const initials = getInitials(comment.user?.name || 'NA');
            return (
              <div key={index} className="d-flex" style={{ justifyContent: isAuthor ? 'flex-start' : 'flex-end' }}>
                <div
                  className="d-flex align-items-end gap-2"
                  style={{ flexDirection: isAuthor ? 'row' : 'row-reverse', maxWidth: '70%' }}
                >
                  <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    {initials}
                  </div>
                  <div
                    className={`p-3 shadow-sm ${isAuthor ? 'bg-light text-dark' : 'bg-primary text-white'}`}
                    style={{
                      borderRadius: '1rem',
                      borderTopLeftRadius: isAuthor ? '0.25rem' : '1rem',
                      borderTopRightRadius: isAuthor ? '1rem' : '0.25rem',
                      minWidth: '100px',
                      maxWidth: '100%',
                    }}
                  >
                    <div className="fw-bold mb-1">{comment.user?.name || 'Nieznany autor'}</div>
                    <div>{comment.comment}</div>
                    <div className="text-muted small mt-2">{moment(comment.created_at).fromNow()}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Formularz dodawania komentarza */}
      <form onSubmit={handleAddComment}>
        <div className="mb-3">
          <label htmlFor="newComment" className="form-label">Dodaj komentarz</label>
          <textarea
            id="newComment"
            className="form-control"
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Wpisz komentarz..."
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Wysyłanie...' : 'Dodaj komentarz'}
        </button>
      </form>
    </div>
  );
};

export default TicketDetails; // Eksport komponentu szczegółów zgłoszenia
