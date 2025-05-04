import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faEye,
  faPlusCircle,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import 'moment/locale/pl'; // Ustawienie lokalizacji na polską

// Komponent wyświetlający listę zgłoszeń
const TicketList = () => {
  const { isAuthenticated } = useAuth(); // Sprawdzenie, czy użytkownik jest zalogowany
  const [tickets, setTickets] = useState([]); // Lista zgłoszeń
  const [loading, setLoading] = useState(true); // Stan ładowania danych
  const [error, setError] = useState(null); // Komunikat o błędzie
  const [userRole, setUserRole] = useState(null); // Rola aktualnie zalogowanego użytkownika
  const [userMap, setUserMap] = useState({}); // Mapa użytkowników (ID -> dane użytkownika)
  const [statusFilter, setStatusFilter] = useState('all'); // Filtr statusu zgłoszeń
  const [assignedFilter, setAssignedFilter] = useState('all'); // Filtr przypisania zgłoszeń
  const [currentPage, setCurrentPage] = useState(1); // Aktualna strona paginacji
  const ticketsPerPage = 5; // Liczba zgłoszeń na stronę

  // Mapa statusów zgłoszeń z etykietami i ikonami
  const statusMap = {
    new: { label: 'Nowy', icon: faPlusCircle, className: 'bg-primary text-white' },
    in_progress: { label: 'W trakcie', icon: faSpinner, className: 'bg-warning text-dark' },
    resolved: { label: 'Rozwiązany', icon: faCheckCircle, className: 'bg-success text-white' },
    closed: { label: 'Zamknięty', icon: faTimesCircle, className: 'bg-secondary text-white' }
  };

  // Pobieranie zgłoszeń i danych użytkownika po załadowaniu komponentu
  useEffect(() => {
    if (isAuthenticated) {
      const fetchTickets = async () => {
        try {
          const response = await api.get('/ticket'); // Pobranie zgłoszeń z API
          const sorted = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sortowanie zgłoszeń
          setTickets(sorted);
          setLoading(false);
        } catch (error) {
          console.error('Błąd podczas pobierania ticketów:', error);
          setError('Błąd podczas pobierania ticketów');
          setLoading(false);
        }
      };
  
      const fetchUserStatusAndUsers = async () => {
        try {
          const [statusRes, usersRes] = await Promise.all([
            api.get('/user/status/', { withCredentials: true }), // Pobranie statusu użytkownika
            api.get('/user/') // Pobranie listy użytkowników
          ]);
      
          setUserRole(statusRes.data.role); // Ustawienie roli użytkownika
      
          const map = {};
          usersRes.data.forEach(user => {
            map[user.id] = user; // Tworzenie mapy użytkowników
          });
          setUserMap(map);
        } catch (error) {
          console.error('Błąd przy pobieraniu danych użytkownika:', error);
        }
      };
      
      fetchTickets();
      fetchUserStatusAndUsers();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);  

  // Obsługa usuwania zgłoszenia
  const handleDelete = async (ticketId) => {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć ten ticket?');
    if (!confirmed) return;

    try {
      await api.delete(`/ticket/${ticketId}`, { withCredentials: true }); // Usunięcie zgłoszenia z API
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId)); // Aktualizacja listy zgłoszeń
    } catch (err) {
      console.error('Błąd podczas usuwania ticketu:', err);
      alert('Nie udało się usunąć ticketu.');
    }
  };

  // Filtrowanie zgłoszeń na podstawie statusu i przypisania
  const filteredTickets = tickets.filter(ticket => {
    const matchStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchAssigned =
      assignedFilter === 'all' ||
      (assignedFilter === 'assigned' && ticket.assigned_to_id) ||
      (assignedFilter === 'unassigned' && !ticket.assigned_to_id);
    return matchStatus && matchAssigned;
  });

  // Paginacja zgłoszeń
  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  // Funkcja do tłumaczenia priorytetu zgłoszenia
  const translatePriority = (priority) => {
    switch (priority) {
      case 'low':
        return 'niski';
      case 'medium':
        return 'średni';
      case 'high':
        return 'wysoki';
      default:
        return 'nie znany';
    }
  };

  // Wyświetlenie komunikatów w zależności od stanu
  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      {/* Nagłówek i filtry */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
        <h2 className="mb-0">
          <FontAwesomeIcon icon={faEye} className="me-2 text-primary" />
          Lista Ticketów
        </h2>
        <div className="d-flex gap-2 flex-wrap">
          {/* Filtr statusu */}
          <select
            className="form-select w-auto"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Resetowanie paginacji
            }}
          >
            <option value="all">Wszystkie</option>
            <option value="new">Nowe</option>
            <option value="in_progress">W trakcie</option>
            <option value="resolved">Rozwiązane</option>
            <option value="closed">Zamknięte</option>
          </select>

          {/* Filtr przypisania (tylko dla administratora) */}
          {userRole === 'admin' && (
            <select
              className="form-select w-auto"
              value={assignedFilter}
              onChange={(e) => {
                setAssignedFilter(e.target.value);
                setCurrentPage(1); // Resetowanie paginacji
              }}
            >
              <option value="all">Wszystkie przypisania</option>
              <option value="assigned">Przypisane</option>
              <option value="unassigned">Nieprzypisane</option>
            </select>
          )}
        </div>
      </div>

      {/* Wyświetlenie zgłoszeń */}
      {currentTickets.length === 0 ? (
        <div className="alert alert-info">Brak ticketów do wyświetlenia.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {currentTickets.map(ticket => (
            <div key={ticket.id} className="card shadow-sm bg-light border-0 position-relative">
              <div className="position-absolute top-0 end-0 m-2">
                <span className="badge bg-light text-muted">
                  {moment(ticket.created_at).fromNow()} {/* Wyświetlenie czasu utworzenia */}
                </span>
              </div>
              <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div>
                  <h5 className="card-title mb-1">{ticket.title}</h5>
                  <p className="mb-1">
                    <strong>Status:</strong>{' '}
                    {statusMap[ticket.status] && (
                      <span className={`badge ${statusMap[ticket.status].className}`}>
                        <FontAwesomeIcon icon={statusMap[ticket.status].icon} className="me-1" />
                        {statusMap[ticket.status].label}
                      </span>
                    )}
                  </p>
                  <p className="mb-1">
                    <strong>Priorytet:</strong>{' '}
                    <span className="badge bg-warning text-dark">{translatePriority(ticket.priority)}</span>
                  </p>
                  <p className="mb-1">
                    <strong>Przypisane do:</strong>{' '}
                    {ticket.assigned_to_id
                      ? userMap[ticket.assigned_to_id]?.name || 'Nieznany użytkownik'
                      : 'Nieprzypisane'}
                  </p>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
                  {/* Link do szczegółów zgłoszenia */}
                  <Link to={`/tickets/${ticket.id}`} className="btn btn-info btn-sm px-3">
                    <FontAwesomeIcon icon={faEye} /> Szczegóły
                  </Link>
                  {/* Opcje edycji i usuwania (tylko dla administratora) */}
                  {userRole === 'admin' && (
                    <>
                      <Link to={`/tickets/edit/${ticket.id}`} className="btn btn-warning btn-sm px-3">
                        <FontAwesomeIcon icon={faEdit} /> Edytuj
                      </Link>
                      <button
                        className="btn btn-danger btn-sm px-3"
                        onClick={() => handleDelete(ticket.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Usuń
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginacja */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4 gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} // Przejście do poprzedniej strony
            disabled={currentPage === 1}
          >
            ← Poprzednia
          </button>
          <span className="align-self-center">Strona {currentPage} z {totalPages}</span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} // Przejście do następnej strony
            disabled={currentPage === totalPages}
          >
            Następna →
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketList; // Eksport komponentu listy zgłoszeń
