import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const TicketList = () => {
  const { isAuthenticated, currentUser } = useAuth(); // Zakładam, że masz dostęp do isAuthenticated i currentUser
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Nowy stan dla roli użytkownika
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTickets = async () => {
        try {
          const response = await api.get('/ticket');
          setTickets(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Błąd podczas pobierania ticketów:', error);
          setError('Błąd podczas pobierania ticketów');
          setLoading(false);
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
      

      fetchTickets();
      fetchUserStatus();  // Pobranie statusu użytkownika (rola)
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="ticket-list-container">
      <h2>Lista Ticketów</h2>
      {tickets.length === 0 ? (
        <div>Brak dostępnych ticketów.</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Tytuł</th>
              <th>Status</th>
              <th>Priorytet</th>
              <th>Przypisane do</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.assigned_to ? ticket.assigned_to.name : 'Nieprzypisane'}</td>
                <td>
                  {/* Sprawdzamy rolę użytkownika przed wyświetleniem opcji "Edytuj" i "Usuń" */}
                  {userRole === 'admin'? (
                    <>
                      <Link to={`/tickets/edit/${ticket.id}`} className="btn btn-warning btn-sm">
                        <FontAwesomeIcon icon={faEdit} />
                        Edytuj
                      </Link>
                      <button className="btn btn-danger btn-sm ml-2">
                        <FontAwesomeIcon icon={faTrash} />
                        Usuń
                      </button>
                    </>
                  ) : (
                    <span>Brak dostępu</span> // Alternatywnie możesz wyświetlić komunikat, że użytkownik nie ma dostępu
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TicketList;
