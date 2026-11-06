import React, { useState, useEffect } from 'react';
import { useNav } from '../../context/NavigationContext';
import { fetchApi } from '../../api';

const MyReservations = () => {
  const { navigate } = useNav();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/reservation/my');
      setReservations(data.reservations || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Are you sure you wish to cancel this reservation?')) return;

    try {
      await fetchApi(`/reservation/${id}/cancel`, {
        method: 'PUT'
      });
      setActionMsg('Reservation cancelled successfully.');
      loadReservations();
    } catch (err) {
      setError(err.message || 'Failed to cancel reservation.');
    }
  };

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
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <span className="text-uppercase fw-bold small text-danger" style={{ letterSpacing: '1px' }}>
              My Dining Schedule
            </span>
            <h2 className="fw-bold text-dark mt-1 mb-0" style={{ fontFamily: 'var(--font-serif)' }}>
              My Table Reservations
            </h2>
          </div>
          <button className="btn btn-burgundy btn-sm" onClick={() => navigate('/restaurants')}>
            <i className="bi bi-plus-circle me-1"></i> Book Another Table
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

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="mt-2 text-muted small">Loading your reservations from MongoDB...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 bg-white p-5 text-center mx-auto" style={{ maxWidth: '500px' }}>
            <i className="bi bi-calendar2-x display-4 text-muted mb-3"></i>
            <h4>No Reservations Found</h4>
            <p className="text-secondary small mb-4">
              You haven't made any restaurant reservations yet. Browse our handpicked culinary venues to reserve your first table!
            </p>
            <button className="btn btn-burgundy" onClick={() => navigate('/restaurants')}>
              Explore Restaurants
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {reservations.map((res) => (
              <div key={res._id} className="col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                  <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
                    <div>
                      <h5 className="fw-bold text-dark mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                        {res.restaurant?.restaurantName || 'Restaurant Venue'}
                      </h5>
                      <span className="text-muted small">
                        <i className="bi bi-geo-alt me-1 text-danger"></i>
                        {res.restaurant?.address}, {res.restaurant?.city}
                      </span>
                    </div>
                    <span className={getBadgeClass(res.status)}>
                      {res.status}
                    </span>
                  </div>

                  <div className="row g-2 small mb-3">
                    <div className="col-6">
                      <strong className="text-muted d-block">Reservation Date:</strong>
                      <span className="text-dark fw-bold">
                        <i className="bi bi-calendar-event me-1 text-danger"></i>
                        {res.date}
                      </span>
                    </div>
                    <div className="col-6">
                      <strong className="text-muted d-block">Seating Time:</strong>
                      <span className="text-dark fw-bold">
                        <i className="bi bi-clock me-1 text-warning"></i>
                        {res.time}
                      </span>
                    </div>
                    <div className="col-6">
                      <strong className="text-muted d-block">Party Size:</strong>
                      <span className="text-dark">
                        <i className="bi bi-people me-1"></i> {res.guests} Guests
                      </span>
                    </div>
                    <div className="col-6">
                      <strong className="text-muted d-block">Dining Area:</strong>
                      <span className="text-dark">
                        <i className="bi bi-door-open me-1"></i> {res.diningArea}
                      </span>
                    </div>
                  </div>

                  {res.specialRequests && (
                    <div className="p-2 bg-light rounded-2 small text-secondary mb-3">
                      <strong>Special Request:</strong> "{res.specialRequests}"
                    </div>
                  )}

                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Booking ID: <code>{res._id.substring(res._id.length - 8)}</code>
                    </span>

                    {res.status !== 'Cancelled' && res.status !== 'Rejected' && (
                      <button
                        className="btn btn-outline-danger btn-sm py-1 px-3"
                        onClick={() => handleCancelReservation(res._id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;

