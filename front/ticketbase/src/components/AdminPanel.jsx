import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailSearch, setEmailSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userStatus = await api.get('/user/status/', { withCredentials: true });
        setUserRole(userStatus.data.role);

        const response = await api.get('/user', { withCredentials: true });
        setUsers(response.data);
      } catch (err) {
        console.error('Błąd podczas pobierania użytkowników:', err);
        setError('Nie udało się pobrać użytkowników.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (email, newRole) => {
    try {
      await api.put(`/user/${email}`, { role: newRole }, { withCredentials: true });
      setUsers(prev =>
        prev.map(user => (user.email === email ? { ...user, role: newRole } : user))
      );
      if (selectedUser?.email === email) {
        setSelectedUser(prev => ({ ...prev, role: newRole }));
      }
    } catch (err) {
      alert('Nie udało się zaktualizować roli.');
    }
  };

  const serviceAndAdminUsers = users.filter(user => user.role === 'admin' || user.role === 'service');
  const otherUsers = users.filter(user =>
    user.role !== 'admin' &&
    user.role !== 'service' &&
    user.email.toLowerCase().includes(emailSearch.toLowerCase())
  );

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
  

  if (loading) return <div className="text-center mt-5">Ladowanie danych...</div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Panel Administratora</h2>

      {userRole === 'admin' ? (
        <div className="row">
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
                        <select
                          className="form-select w-auto"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.email, e.target.value)}
                        >
                          <option value="user">użytokwnik</option>
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

          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Przypisz rolę użytkownikowi</h5>

                <input
                  type="text"
                  className="form-control mb-4"
                  placeholder="Szukaj po email..."
                  value={emailSearch}
                  onChange={(e) => setEmailSearch(e.target.value)}
                />

                <div className="d-flex flex-column gap-3">
                  {otherUsers.map(user => (
                    <div
                      key={user.id}
                      className={`card p-3 ${selectedUser?.id === user.id ? 'border-primary border-2' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedUser(user)}
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
        <div className="alert alert-danger text-center">
          Brak dostępu – tylko administrator może zarządzać rolami użytkowników.
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
