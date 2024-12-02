import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const TicketList = () => {
  const { isAuthenticated } = useAuth(); // Zakładam, że masz dostęp do isAuthenticated
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTickets = async () => {
        try {
          const response = await api.get('/ticket');
          console.log('Odpowiedź z backendu:', response); // Debugowanie odpowiedzi z serwera
          setTickets(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Błąd podczas pobierania ticketów:', error);
          setError('Błąd podczas pobierania ticketów');
          setLoading(false);
        }
      };

      fetchTickets();
    } else {
      setLoading(false); // Ustawienie na false, jeśli użytkownik nie jest zalogowany
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
                  <button className="btn btn-warning btn-sm">Edytuj</button>
                  <button className="btn btn-danger btn-sm ml-2">Usuń</button>
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
