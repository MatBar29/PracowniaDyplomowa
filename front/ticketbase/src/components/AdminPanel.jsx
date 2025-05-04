import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminPanel = () => {
  // Stan dla listy użytkowników
  const [users, setUsers] = useState([]);
  // Stan dla ładowania danych
  const [loading, setLoading] = useState(true);
  // Stan dla błędów
  const [error, setError] = useState(null);
  // Stan dla roli aktualnie zalogowanego użytkownika
  const [userRole, setUserRole] = useState(null);
  // Stan dla wybranego użytkownika
  const [selectedUser, setSelectedUser] = useState(null);
  // Stan dla wyszukiwania użytkowników po e-mailu
  const [emailSearch, setEmailSearch] = useState('');

  // Pobieranie danych użytkowników i roli aktualnie zalogowanego użytkownika
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Pobranie roli aktualnie zalogowanego użytkownika
        const userStatus = await api.get('/user/status/', { withCredentials: true });
        setUserRole(userStatus.data.role);

        // Pobranie listy użytkowników
        const response = await api.get('/user', { withCredentials: true });
        setUsers(response.data);
      } catch (err) {
        console.error('Błąd podczas pobierania użytkowników:', err);
        setError('Nie udało się pobrać użytkowników.');
      } finally {
        setLoading(false); // Ustawienie stanu ładowania na false
      }
    };

    fetchUsers();
  }, []);

  // Obsługa zmiany roli użytkownika
  const handleRoleChange = async (email, newRole) => {
    try {
      // Aktualizacja roli użytkownika w API
      await api.put(`/user/${email}`, { role: newRole }, { withCredentials: true });
      // Aktualizacja roli użytkownika w stanie
      setUsers(prev =>
        prev.map(user => (user.email === email ? { ...user, role: newRole } : user))
      );
      // Aktualizacja roli wybranego użytkownika, jeśli jest zaznaczony
      if (selectedUser?.email === email) {
        setSelectedUser(prev => ({ ...prev, role: newRole }));
      }
    } catch (err) {
      alert('Nie udało się zaktualizować roli.');
    }
  };

  // Filtrowanie użytkowników z rolą "admin" lub "service"
  const serviceAndAdminUsers = users.filter(user => user.role === 'admin' || user.role === 'service');
  // Filtrowanie pozostałych użytkowników na podstawie wyszukiwania po e-mailu
  const otherUsers = users.filter(user =>
    user.role !== 'admin' &&
    user.role !== 'service' &&
    user.email.toLowerCase().includes(emailSearch.toLowerCase())
  );

  // Funkcja do tłumaczenia ról na czytelne nazwy
  const translateRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'service':
        return 'Serwisant';
      case 'user':
        return 'Użytkownik';
      default:
        return 'Nieznana rola';
    }
  };

  // Wyświetlenie komunikatu podczas ładowania danych
  if (loading) return <div className="text-center mt-5">Ładowanie danych...</div>;
  // Wyświetlenie błędu, jeśli wystąpił
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Panel Administratora</h2>

      {userRole === 'admin' ? (
        <div className="row">
          {/* Sekcja dla użytkowników z rolą administrator/serwisant */}
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Użytkownicy z rolą administrator/serwisant</h5>
                <ul className="list-group">
                  {serviceAndAdminUsers.map(user => (
                    <li key={user.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span>{user.name}</span>
                          <div className="text-muted small">{user.email}</div>
                        </div>
                        {/* Dropdown do zmiany roli użytkownika */}
                        <select
                          className="form-select w-auto"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.email, e.target.value)}
                        >
                          <option value="user">użytkownik</option>
                          <option value="service">serwisant</option>
                          <option value="admin">administrator</option>
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sekcja dla przypisywania ról użytkownikom */}
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Przypisz rolę użytkownikowi</h5>

                {/* Pole wyszukiwania użytkowników po e-mailu */}
                <input
                  type="text"
                  className="form-control mb-4"
                  placeholder="Szukaj po email..."
                  value={emailSearch}
                  onChange={(e) => setEmailSearch(e.target.value)}
                />

                {/* Lista użytkowników spełniających kryteria wyszukiwania */}
                <div className="d-flex flex-column gap-3">
                  {otherUsers.map(user => (
                    <div
                      key={user.id}
                      className={`card p-3 ${selectedUser?.id === user.id ? 'border-primary border-2' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedUser(user)} // Ustawienie wybranego użytkownika
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{user.name}</h6>
                          <p className="mb-0 text-muted small">{user.email}</p>
                        </div>
                        <span className="badge bg-secondary text-uppercase">{translateRole(user.role)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sekcja do zmiany roli wybranego użytkownika */}
                {selectedUser && (
                  <div className="mt-4">
                    <h6 className="fw-bold">Zmień rolę dla: {selectedUser.name}</h6>
                    <select
                      className="form-select mt-2"
                      value={selectedUser.role}
                      onChange={(e) => handleRoleChange(selectedUser.email, e.target.value)}
                    >
                      <option value="user">użytkownik</option>
                      <option value="service">serwisant</option>
                      <option value="admin">administrator</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Komunikat o braku dostępu dla użytkowników bez roli administratora
        <div className="alert alert-danger text-center">
          Brak dostępu – tylko administrator może zarządzać rolami użytkowników.
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
