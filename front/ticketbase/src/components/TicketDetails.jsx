import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import moment from 'moment';
import 'moment/locale/pl';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [workedHours, setWorkedHours] = useState('');
  const [isSubmittingHours, setIsSubmittingHours] = useState(false);
  const [isClosingTicket, setIsClosingTicket] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const fetchTicketDetails = async () => {
    try {
      const response = await api.get(`/ticket/${id}`);
      setTicket(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Błąd przy pobieraniu szczegółów ticketa:', err);
      setError('Nie udało się pobrać szczegółów ticketa.');
      setLoading(false);
    }
  };

  const fetchAttachments = async () => {
    try {
      const response = await api.get(`/${id}/attachments`, { withCredentials: true });
      setAttachments(response.data);
    } catch (err) {
      console.error('Błąd przy pobieraniu załączników:', err);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const res = await api.get('/user/status/', { withCredentials: true });
      setUserRole(res.data.role);
    } catch (err) {
      console.error('Błąd przy pobieraniu statusu użytkownika:', err);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    fetchAttachments();
    fetchUserStatus();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/comment', {
        ticket_id: parseInt(id),
        comment: newComment
      });
      setNewComment('');
      await fetchTicketDetails();
    } catch (err) {
      console.error('Błąd przy dodawaniu komentarza:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogHours = async (e) => {
    e.preventDefault();
    if (!workedHours || isNaN(workedHours)) return;
    setIsSubmittingHours(true);
    try {
      await api.put(`/ticket/${id}/log-time`, {
        worked_hours: parseFloat(workedHours)
      });
      setWorkedHours('');
      await fetchTicketDetails();
    } catch (err) {
      console.error('Błąd przy dodawaniu godzin:', err);
    } finally {
      setIsSubmittingHours(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!window.confirm('Czy na pewno chcesz oznaczyć ticket jako zakończony?')) return;
    setIsClosingTicket(true);
    try {
      await api.put(`/ticket/${id}`, { status: 'closed' });
      await fetchTicketDetails();
    } catch (err) {
      console.error('Błąd przy zamykaniu ticketa:', err);
    } finally {
      setIsClosingTicket(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0].toUpperCase())
      .join('');
  };

  if (loading) return <div>Ładowanie szczegółów...</div>;
  if (error) return <div>{error}</div>;
  if (!ticket) return <div>Ticket nie znaleziony</div>;

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <button onClick={() => navigate('/ticket-list')} className="btn btn-outline-secondary">
          ← Powrót do listy
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title">{ticket.title}</h3>
          <p className="card-text"><strong>Opis:</strong> {ticket.description}</p>

          <div className="row mb-2 align-items-center">
            <div className="col-md-4">
              <strong>Status:</strong>{' '}
              <span className="badge bg-info text-dark">{ticket.status}</span>
            </div>
            <div className="col-md-4">
              <strong>Priorytet:</strong>{' '}
              <span className="badge bg-warning text-dark">{ticket.priority}</span>
            </div>
            <div className="col-md-4">
              <strong>Przypisany do:</strong>{' '}
              {ticket.assigned_to ? ticket.assigned_to.name : 'Nieprzypisane'}
            </div>
          </div>

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

export default TicketDetails;
