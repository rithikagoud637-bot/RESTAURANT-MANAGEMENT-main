import React, { useState } from 'react';
import { useNav } from '../context/NavigationContext';
import { fetchApi } from '../api';

const Register = () => {
  const { navigate } = useNav();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetchApi('/user/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      setSuccess(res.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '80vh' }}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-6">
            <div className="card shadow-sm border-0 p-4 p-md-5" style={{ backgroundColor: '#ffffff', borderRadius: '14px' }}>
              <div className="text-center mb-4">
                <span className="fs-1 text-danger">🍷</span>
                <h3 className="fw-bold mt-2 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                  Create an Account
                </h3>
                <p className="text-secondary small">
                  Join GourmetReserve to book fine dining tables or manage your restaurant.
                </p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
                  <div>{error}</div>
                </div>
              )}

              {success && (
                <div className="alert alert-success py-2 small d-flex align-items-center mb-3">
                  <i className="bi bi-check-circle-fill me-2 fs-6"></i>
                  <div>{success}</div>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Maya Patel"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="+1 555-0123"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Select Account Role *</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="customer">Customer (Book and manage dining tables)</option>
                    <option value="owner">Restaurant Owner (List & manage restaurant bookings)</option>
                  </select>
                  <div className="form-text small">
                    {formData.role === 'customer'
                      ? 'You can browse restaurants, submit booking requests, and track reservations.'
                      : 'You will gain access to the Owner Dashboard to manage your venue and approve diners.'}
                  </div>
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Password *</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-burgundy w-100 py-2 mb-3 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-check"></i>
                      <span>Complete Registration</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-3 border-top pt-3">
                <span className="small text-secondary">Already have an account? </span>
                <button
                  className="btn btn-link p-0 small fw-bold text-danger text-decoration-none"
                  onClick={() => navigate('/login')}
                >
                  Sign in here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

