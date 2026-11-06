import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNav } from '../../context/NavigationContext';
import { fetchApi } from '../../api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { navigate } = useNav();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await fetchApi('/admin/stats');
        setStats(data.stats);
      } catch (err) {
        setError(err.message || 'Failed to load administrator statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '85vh' }}>
      <div className="container py-3">
        {/* Banner */}
        <div className="card border-0 shadow-sm p-4 p-md-5 mb-4 rounded-4" style={{ background: 'linear-gradient(135deg, #16181b, #2b2f36)', color: '#ffffff' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <span className="badge bg-danger text-uppercase fw-bold mb-2">Master Administrator</span>
              <h2 className="fw-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                System Control & Analytics
              </h2>
              <p className="text-light small mb-0 opacity-75">
                Monitoring system health, users, restaurant listings, and real-time reservations.
              </p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-warning btn-sm" onClick={() => navigate('/admin/users')}>
                <i className="bi bi-people me-1"></i> Users
              </button>
              <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/admin/restaurants')}>
                <i className="bi bi-shop me-1"></i> Restaurants
              </button>
              <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/admin/reservations')}>
                <i className="bi bi-calendar2-range me-1"></i> Reservations
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="mt-2 text-muted small">Loading system analytics...</p>
          </div>
        ) : (
          <div>
            <h5 className="fw-bold text-dark mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              Core Platform Metrics
            </h5>

            <div className="row g-3 mb-5">
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small fw-bold text-uppercase">Registered Diners</span>
                    <i className="bi bi-person-heart text-danger fs-4"></i>
                  </div>
                  <div className="display-5 fw-bold text-dark">{stats?.totalCustomers ?? 0}</div>
                  <small className="text-success"><i className="bi bi-arrow-up-right"></i> Active customer accounts</small>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small fw-bold text-uppercase">Restaurant Owners</span>
                    <i className="bi bi-person-badge text-warning fs-4"></i>
                  </div>
                  <div className="display-5 fw-bold text-dark">{stats?.totalOwners ?? 0}</div>
                  <small className="text-muted">Registered restaurateurs</small>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small fw-bold text-uppercase">Total Restaurants</span>
                    <i className="bi bi-shop text-primary fs-4"></i>
                  </div>
                  <div className="display-5 fw-bold text-dark">{stats?.totalRestaurants ?? 0}</div>
                  <small className="text-muted">
                    {stats?.pendingRestaurants > 0 ? (
                      <span className="text-danger fw-bold">{stats.pendingRestaurants} pending approval</span>
                    ) : (
                      'All approved & live'
                    )}
                  </small>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small fw-bold text-uppercase">Total Reservations</span>
                    <i className="bi bi-calendar-check text-success fs-4"></i>
                  </div>
                  <div className="display-5 fw-bold text-dark">{stats?.totalReservations ?? 0}</div>
                  <small className="text-muted">
                    <span className="text-warning fw-bold">{stats?.pendingReservations ?? 0} pending</span> •{' '}
                    <span className="text-success fw-bold">{stats?.confirmedReservations ?? 0} confirmed</span>
                  </small>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <h5 className="fw-bold text-dark mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              Administrative Workflows
            </h5>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                  <div className="fs-1 text-danger mb-2"><i className="bi bi-people-fill"></i></div>
                  <h5 className="fw-bold">User Account Control</h5>
                  <p className="text-secondary small">
                    Inspect all customer, owner, and admin registrations. Change roles or remove invalid accounts.
                  </p>
                  <button className="btn btn-outline-burgundy btn-sm mt-auto" onClick={() => navigate('/admin/users')}>
                    Manage Users & Accounts
                  </button>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                  <div className="fs-1 text-warning mb-2"><i className="bi bi-building-check"></i></div>
                  <h5 className="fw-bold">Restaurant Vetting & Catalog</h5>
                  <p className="text-secondary small">
                    Review incoming restaurant submissions, verify images and contact information, and approve or reject listings.
                  </p>
                  <button className="btn btn-outline-burgundy btn-sm mt-auto" onClick={() => navigate('/admin/restaurants')}>
                    Manage Restaurant Listings
                  </button>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                  <div className="fs-1 text-success mb-2"><i className="bi bi-card-checklist"></i></div>
                  <h5 className="fw-bold">Platform-Wide Reservations</h5>
                  <p className="text-secondary small">
                    Audit real-time bookings across all dining partners. Monitor confirmation rates and resolve diner disputes.
                  </p>
                  <button className="btn btn-outline-burgundy btn-sm mt-auto" onClick={() => navigate('/admin/reservations')}>
                    Inspect All Reservations
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

