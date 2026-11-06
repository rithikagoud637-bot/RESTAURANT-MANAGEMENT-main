import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNav } from '../context/NavigationContext';
import { fetchApi } from '../api';

const Login = () => {
  const { login } = useAuth();
  const { navigate } = useNav();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetchApi('/user/login', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      setSuccess('Login successful! Redirecting to dashboard...');
      login(res.user, res.token);

      setTimeout(() => {
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (res.user.role === 'owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }, 700);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for demonstration testing
  const fillDemoAccount = (role) => {
    if (role === 'admin') {
      setFormData({ email: 'admin@restaurant.com', password: 'AdminPassword123!' });
    } else if (role === 'owner') {
      setFormData({ email: 'owner@bistrogold.com', password: 'OwnerPassword123!' });
    } else if (role === 'customer') {
      setFormData({ email: 'customer@gmail.com', password: 'CustomerPassword123!' });
    }
    setError('');
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '80vh' }}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="card shadow-sm border-0 p-4 p-md-5" style={{ backgroundColor: '#ffffff', borderRadius: '14px' }}>
              <div className="text-center mb-4">
                <span className="fs-1 text-danger">🍷</span>
                <h3 className="fw-bold mt-2 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                  Welcome Back
                </h3>
                <p className="text-secondary small">
                  Sign in to manage table reservations or explore dining destinations.
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

              <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control border-start-0 ps-0"
                      placeholder="••••••••"
                      value={formData.password}
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
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right"></i>
                      <span>Sign In to Account</span>
                    </>
                  )}
                </button>
              </form>

              {/* Demo Accounts Pill Box for College Evaluators */}
              <div className="p-3 bg-light rounded-3 border mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-bold text-dark" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
                    Demo Accounts (1-Click Fill)
                  </span>
                </div>
                <div className="d-grid gap-1">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm text-start py-1"
                    style={{ fontSize: '0.78rem' }}
                    onClick={() => fillDemoAccount('customer')}
                  >
                    👤 <strong>Customer:</strong> customer@gmail.com
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm text-start py-1"
                    style={{ fontSize: '0.78rem' }}
                    onClick={() => fillDemoAccount('owner')}
                  >
                    👨‍🍳 <strong>Owner:</strong> owner@bistrogold.com
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm text-start py-1"
                    style={{ fontSize: '0.78rem' }}
                    onClick={() => fillDemoAccount('admin')}
                  >
                    🛡️ <strong>Admin:</strong> admin@restaurant.com
                  </button>
                </div>
              </div>

              <div className="text-center mt-4 border-top pt-3">
                <span className="small text-secondary">Don't have an account yet? </span>
                <button
                  className="btn btn-link p-0 small fw-bold text-danger text-decoration-none"
                  onClick={() => navigate('/register')}
                >
                  Register here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

