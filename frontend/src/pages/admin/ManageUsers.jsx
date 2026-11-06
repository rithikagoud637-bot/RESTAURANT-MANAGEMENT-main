import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNav } from '../../context/NavigationContext';
import { fetchApi } from '../../api';

const ManageUsers = () => {
  const { user: currentAdmin } = useAuth();
  const { navigate } = useNav();

  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams();
      if (roleFilter !== 'all') queryParams.append('role', roleFilter);
      if (keyword) queryParams.append('keyword', keyword);

      const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const data = await fetchApi(`/admin/users${queryStr}`);
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await fetchApi(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      setActionMsg(`User role updated to ${newRole}.`);
      loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user account? This action cannot be undone.')) return;

    try {
      await fetchApi(`/admin/users/${userId}`, {
        method: 'DELETE'
      });
      setActionMsg('User account deleted successfully.');
      loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '85vh' }}>
      <div className="container py-3">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <span className="text-uppercase fw-bold small text-danger" style={{ letterSpacing: '1px' }}>
              Administration
            </span>
            <h2 className="fw-bold text-dark mt-1 mb-0" style={{ fontFamily: 'var(--font-serif)' }}>
              User Account Management
            </h2>
          </div>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/admin/dashboard')}>
            <i className="bi bi-speedometer2 me-1"></i> Admin Dashboard
          </button>
        </div>

        {actionMsg && (
          <div className="alert alert-success alert-dismissible fade show py-2 small" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i> {actionMsg}
            <button type="button" className="btn-close py-2" onClick={() => setActionMsg('')}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        {/* Filter / Search Bar */}
        <div className="card border-0 shadow-sm rounded-4 bg-white p-3 mb-4">
          <form onSubmit={handleSearch} className="row g-2 align-items-center">
            <div className="col-md-7">
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search user by name, email, or phone..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="customer">Customers Only</option>
                <option value="owner">Restaurant Owners Only</option>
                <option value="admin">Administrators Only</option>
              </select>
            </div>

            <div className="col-md-2">
              <button type="submit" className="btn btn-burgundy w-100">
                Filter Users
              </button>
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">
              Found <strong>{users.length}</strong> registered user accounts
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status"></div>
              <p className="mt-2 text-muted small">Loading accounts...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-people display-4 d-block mb-3"></i>
              <h6>No Users Found</h6>
              <p className="small mb-0">No registered accounts matching your current search criteria.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>User Information</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Current Role</th>
                    <th>Change Role</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="fw-bold">
                        {u.name}
                        {u._id === currentAdmin?._id && (
                          <span className="badge bg-primary ms-1" style={{ fontSize: '0.65rem' }}>You</span>
                        )}
                        <div className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                          Registered: {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>
                        <span className={`badge text-uppercase ${u.role === 'admin' ? 'bg-danger' : u.role === 'owner' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          style={{ width: '130px' }}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={u._id === currentAdmin?._id}
                        >
                          <option value="customer">customer</option>
                          <option value="owner">owner</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="text-end">
                        {u._id !== currentAdmin?._id ? (
                          <button
                            className="btn btn-outline-danger btn-sm py-1 px-2"
                            onClick={() => handleDeleteUser(u._id)}
                            title="Delete Account"
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        ) : (
                          <span className="text-muted small fst-italic">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;

