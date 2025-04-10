import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import moment from 'moment';
import 'moment/locale/pl';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    fetchTicketDetails();
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
      await fetchTicketDetails(); // odśwież komentarze
    } catch (err) {
      console.error('Błąd przy dodawaniu komentarza:', err);
    } finally {
      setSubmitting(false);
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
          <p className="card-text">
            <strong>Opis:</strong> {ticket.description}
          </p>
          <div className="row mb-2">
            <div className="col-md-6">
              <strong>Status:</strong>{' '}
              <span className="badge bg-info text-dark">{ticket.status}</span>
            </div>
            <div className="col-md-6">
              <strong>Priorytet:</strong>{' '}
              <span className="badge bg-warning text-dark">{ticket.priority}</span>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-md-6">
              <strong>Utworzył:</strong> {ticket.creator.name}
            </div>
            <div className="col-md-6">
              <strong>Przypisany do:</strong>{' '}
              {ticket.assigned_to ? ticket.assigned_to.name : 'Nieprzypisane'}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <strong>Utworzono:</strong> {moment(ticket.created_at).format('LLL')}
            </div>
            <div className="col-md-6">
              <strong>Aktualizacja:</strong> {moment(ticket.updated_at).format('LLL')}
            </div>
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
              <div
                key={index}
                className="d-flex"
                style={{ justifyContent: isAuthor ? 'flex-start' : 'flex-end' }}
              >
                <div
                  className="d-flex align-items-end gap-2"
                  style={{
                    flexDirection: isAuthor ? 'row' : 'row-reverse',
                    maxWidth: '70%',
                  }}
                >
                  <div
                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40 }}
                  >
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
