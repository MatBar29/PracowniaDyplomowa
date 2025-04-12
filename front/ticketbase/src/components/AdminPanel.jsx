import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
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
    } catch (err) {
      alert('Nie udało się zaktualizować roli.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    const matchEmail = user.email.toLowerCase().includes(emailSearch.toLowerCase());
    return matchRole && matchEmail;
  });

  if (loading) return <div className="text-center mt-5">Ladowanie danych...</div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Panel Administratora</h2>

      {userRole === 'admin' ? (
        <>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
            <input
              type="text"
              className="form-control w-100 w-md-50"
              placeholder="Szukaj po email..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
            />
            <select
              className="form-select w-100 w-md-25"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Wszystkie role</option>
              <option value="user">user</option>
              <option value="service">service</option>
              <option value="menager">menager</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div className="d-flex flex-column gap-3">
            {filteredUsers.map(user => (
              <div key={user.id} className="card shadow-sm bg-light border-0">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                  <div className="mb-3 mb-md-0">
                    <h5 className="mb-1">{user.name}</h5>
                    <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                    <p className="mb-0">
                      <strong>Aktualna rola:</strong>{' '}
                      <span className="badge bg-secondary">{user.role}</span>
                    </p>
                  </div>
                  <div>
                    <label className="form-label mb-1 fw-bold">Zmień rolę</label>
                    <select
                      className="form-select"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.email, e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="service">service</option>
                      <option value="menager">menager</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="alert alert-danger text-center">
          Brak dostępu – tylko administrator może zarządzać rolami użytkowników.
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
