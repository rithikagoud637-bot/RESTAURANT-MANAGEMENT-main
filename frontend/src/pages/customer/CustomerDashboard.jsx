import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNav } from '../../context/NavigationContext';
import { fetchApi } from '../../api';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { navigate } = useNav();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await fetchApi('/reservation/my');
        setReservations(data.reservations || []);
      } catch (err) {
        setError(err.message || 'Unable to load reservations.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const totalBookings = reservations.length;
  const pendingBookings = reservations.filter((r) => r.status === 'Pending').length;
  const confirmedBookings = reservations.filter((r) => r.status === 'Confirmed').length;
  const cancelledBookings = reservations.filter((r) => r.status === 'Cancelled').length;

  const recentReservations = reservations.slice(0, 3);

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'badge-confirmed';
      case 'Pending': return 'badge-pending';
      case 'Rejected': return 'badge-rejected';
      case 'Cancelled': return 'badge-cancelled';
      default: return 'badge bg-secondary';
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '85vh' }}>
      <div className="container py-3">
        {/* Welcome Banner */}
        <div className="card border-0 shadow-sm p-4 p-md-5 mb-4 rounded-4" style={{ background: 'linear-gradient(135deg, #2b1115, #4a151e)', color: '#ffffff' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <span className="badge bg-warning text-dark text-uppercase fw-bold mb-2">Customer Portal</span>
              <h2 className="fw-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                Welcome, {user?.name || 'Guest'}!
              </h2>
              <p className="text-light small mb-0 opacity-75">
                Manage your upcoming dining experiences, view reservation history, and discover new tables.
              </p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-gold btn-sm px-3" onClick={() => navigate('/restaurants')}>
                <i className="bi bi-compass me-1"></i> Explore Venues
              </button>
              <button className="btn btn-outline-light btn-sm px-3" onClick={() => navigate('/customer/profile')}>
                <i className="bi bi-person-gear me-1"></i> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Counters Grid */}
        <div className="row g-3 mb-5">
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm p-3 rounded-3 bg-white text-center">
              <div className="display-6 fw-bold text-dark">{totalBookings}</div>
              <span className="text-muted small fw-semibold">Total Reservations</span>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm p-3 rounded-3 bg-white text-center">
              <div className="display-6 fw-bold text-warning">{pendingBookings}</div>
              <span className="text-muted small fw-semibold">Pending Requests</span>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm p-3 rounded-3 bg-white text-center">
              <div className="display-6 fw-bold text-success">{confirmedBookings}</div>
              <span className="text-muted small fw-semibold">Confirmed Tables</span>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm p-3 rounded-3 bg-white text-center">
              <div className="display-6 fw-bold text-secondary">{cancelledBookings}</div>
              <span className="text-muted small fw-semibold">Cancelled / Past</span>
            </div>
          </div>
        </div>

        {/* Recent Reservations Table */}
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-serif)' }}>
              Recent Booking Requests
            </h5>
            <button className="btn btn-outline-burgundy btn-sm" onClick={() => navigate('/customer/reservations')}>
              View All ({totalBookings}) <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border spinner-border-sm text-danger" role="status"></div>
              <span className="ms-2 small text-muted">Loading reservations...</span>
            </div>
          ) : error ? (
            <div className="alert alert-warning small mb-0">{error}</div>
          ) : recentReservations.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar2-x display-5 text-muted mb-3 d-block"></i>
              <h6>No Reservations Yet</h6>
              <p className="text-secondary small mb-3">You haven't reserved any dining tables yet.</p>
              <button className="btn btn-burgundy btn-sm" onClick={() => navigate('/restaurants')}>
                Browse Restaurants & Book
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>Restaurant</th>
                    <th>Date & Time</th>
                    <th>Guests</th>
                    <th>Seating Section</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {recentReservations.map((res) => (
                    <tr key={res._id}>
                      <td className="fw-bold">
                        {res.restaurant?.restaurantName || 'Restaurant Venue'}
                        <div className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                          {res.restaurant?.city || ''}
                        </div>
                      </td>
                      <td>
                        <i className="bi bi-calendar3 me-1 text-muted"></i> {res.date}<br />
                        <span className="text-muted">{res.time}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          <i className="bi bi-people-fill me-1"></i> {res.guests} Guests
                        </span>
                      </td>
                      <td>{res.diningArea}</td>
                      <td>
                        <span className={getBadgeClass(res.status)}>
                          {res.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-secondary btn-sm py-1 px-2"
                          onClick={() => navigate('/customer/reservations')}
                        >
                          Details
                        </button>
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

export default CustomerDashboard;

