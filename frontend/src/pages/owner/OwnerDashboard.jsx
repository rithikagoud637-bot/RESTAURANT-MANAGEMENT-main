import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNav } from '../../context/NavigationContext';
import { fetchApi } from '../../api';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { navigate } = useNav();

  const [restaurant, setRestaurant] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const loadOwnerData = async () => {
    setLoading(true);
    try {
      // 1. Get owner's restaurant
      const restData = await fetchApi('/restaurant/owner/my');
      setRestaurant(restData.restaurant);

      // 2. Get reservations
      const resData = await fetchApi('/reservation/owner');
      setReservations(resData.reservations || []);
    } catch (err) {
      setError(err.message || 'Failed to load owner data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetchApi(`/reservation/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      setActionMsg(`Reservation marked as ${newStatus}.`);
      loadOwnerData();
    } catch (err) {
      setError(err.message || 'Failed to update reservation status.');
    }
  };

  const total = reservations.length;
  const pending = reservations.filter((r) => r.status === 'Pending').length;
  const confirmed = reservations.filter((r) => r.status === 'Confirmed').length;
  const rejected = reservations.filter((r) => r.status === 'Rejected').length;
  const cancelled = reservations.filter((r) => r.status === 'Cancelled').length;

  const pendingRequests = reservations.filter((r) => r.status === 'Pending').slice(0, 4);

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '85vh' }}>
      <div className="container py-3">
        {/* Banner */}
        <div className="card border-0 shadow-sm p-4 p-md-5 mb-4 rounded-4" style={{ background: 'linear-gradient(135deg, #2b1115, #4a151e)', color: '#ffffff' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <span className="badge bg-warning text-dark text-uppercase fw-bold mb-2">Restaurateur Management Suite</span>
              <h2 className="fw-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                {restaurant ? restaurant.restaurantName : 'Owner Dashboard'}
              </h2>
              <p className="text-light small mb-0 opacity-75">
                {restaurant
                  ? `${restaurant.cuisine} • ${restaurant.city} • Status: ${restaurant.approvalStatus}`
                  : `Welcome Chef ${user?.name || ''}. Setup or manage your dining establishment.`}
              </p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-gold btn-sm px-3" onClick={() => navigate('/owner/restaurant')}>
                <i className="bi bi-gear-wide-connected me-1"></i> Edit Restaurant Details
              </button>
              <button className="btn btn-outline-light btn-sm px-3" onClick={() => navigate('/owner/reservations')}>
                <i className="bi bi-calendar-check me-1"></i> Manage Bookings
              </button>
            </div>
          </div>
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

        {/* Reservation Counters */}
        <div className="row g-3 mb-5">
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card border-0 shadow-sm p-3 rounded-3 bg-white text-center">
              <div className="display-6 fw-bold text-dark">{total}</div>
              <span className="text-muted small fw-semibold">Total Requests</span>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card border-0 shadow-sm p-3 rounded-3 bg-white text-center">
              <div className="display-6 fw-bold text-warning">{pending}</div>
              <span className="text-muted small fw-semibold">Pending Review</span>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card border-0 shadow-sm p-3 rounded-3 bg-white text-center">
              <div className="display-6 fw-bold text-success">{confirmed}</div>
              <span className="text-muted small fw-semibold">Confirmed</span>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card border-0 shadow-sm p-3 rounded-3 bg-white text-center">
              <div className="display-6 fw-bold text-danger">{rejected}</div>
              <span className="text-muted small fw-semibold">Rejected</span>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card border-0 shadow-sm p-3 rounded-3 bg-white text-center">
              <div className="display-6 fw-bold text-secondary">{cancelled}</div>
              <span className="text-muted small fw-semibold">Cancelled</span>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card border-0 shadow-sm p-3 rounded-3 bg-white text-center">
              <div className="display-6 fw-bold text-primary">
                {restaurant?.approvalStatus === 'Approved' ? 'Live' : 'Pending'}
              </div>
              <span className="text-muted small fw-semibold">Listing Status</span>
            </div>
          </div>
        </div>

        {/* Pending Booking Requests Section */}
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-serif)' }}>
                Pending Reservation Approvals ({pending})
              </h5>
              <p className="text-muted small mb-0">Approve or decline customer seating requests.</p>
            </div>
            <button className="btn btn-outline-burgundy btn-sm" onClick={() => navigate('/owner/reservations')}>
              All Reservations <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border spinner-border-sm text-danger" role="status"></div>
              <span className="ms-2 small text-muted">Loading reservations...</span>
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              <i className="bi bi-check-all display-6 text-success d-block mb-2"></i>
              All pending booking requests have been reviewed!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>Customer</th>
                    <th>Date & Seating</th>
                    <th>Guests</th>
                    <th>Section</th>
                    <th>Special Notes</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {pendingRequests.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <strong>{req.firstName} {req.lastName}</strong>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {req.email} • {req.phone}
                        </div>
                      </td>
                      <td>
                        <i className="bi bi-calendar-event me-1 text-danger"></i> {req.date}<br />
                        <span className="text-muted">{req.time}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {req.guests} Guests
                        </span>
                      </td>
                      <td>{req.diningArea}</td>
                      <td>
                        <span className="text-secondary fst-italic">
                          {req.specialRequests || 'None'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-success"
                            onClick={() => handleUpdateStatus(req._id, 'Confirmed')}
                            title="Approve Reservation"
                          >
                            <i className="bi bi-check-lg me-1"></i> Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                            title="Reject Reservation"
                          >
                            <i className="bi bi-x-lg me-1"></i> Reject
                          </button>
                        </div>
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

export default OwnerDashboard;

