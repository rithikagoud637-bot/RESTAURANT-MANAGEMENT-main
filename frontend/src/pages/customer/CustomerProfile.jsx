import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNav } from '../../context/NavigationContext';
import { fetchApi } from '../../api';

const CustomerProfile = () => {
  const { user, updateUser } = useAuth();
  const { navigate } = useNav();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Name and phone number cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetchApi('/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, phone })
      });

      updateUser(res.user);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '85vh' }}>
      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div
                  className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold fs-3"
                  style={{ width: '64px', height: '64px' }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-serif)' }}>
                    My Account Profile
                  </h4>
                  <p className="text-secondary small mb-0">
                    Role: <span className="badge bg-secondary text-uppercase ms-1">{user?.role}</span>
                  </p>
                </div>
              </div>

              {message && (
                <div className="alert alert-success py-2 small d-flex align-items-center mb-3">
                  <i className="bi bi-check-circle-fill me-2 fs-6"></i>
                  <div>{message}</div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Email Address</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={user?.email || ''}
                    disabled
                  />
                  <div className="form-text small">Email address cannot be changed for security verification.</div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-burgundy px-4 py-2" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-1"></i> Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3 py-2"
                    onClick={() => navigate('/customer/dashboard')}
                  >
                    Back to Dashboard
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;

