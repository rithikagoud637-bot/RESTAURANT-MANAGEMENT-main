import React, { useState, useEffect } from 'react';
import { useNav } from '../../context/NavigationContext';
import { fetchApi } from '../../api';

const ManageReservations = () => {
  const { navigate } = useNav();

  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const loadReservations = async () => {
    setLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (keyword) queryParams.append('keyword', keyword);

      const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const data = await fetchApi(`/reservation/all${queryStr}`);
      setReservations(data.reservations || []);
    } catch (err) {
      setError(err.message || 'Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadReservations();
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await fetchApi(`/reservation/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setActionMsg(`Reservation updated to ${status}.`);
      loadReservations();
    } catch (err) {
      setError(err.message || 'Failed to update reservation status.');
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
              Administration
            </span>
            <h2 className="fw-bold text-dark mt-1 mb-0" style={{ fontFamily: 'var(--font-serif)' }}>
              Master Reservation Ledger
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
                  placeholder="Search by diner first/last name, email, or phone..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending Review</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-md-2">
              <button type="submit" className="btn btn-burgundy w-100">
                Filter
              </button>
            </div>
          </form>
        </div>

        {/* Reservations Table */}
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">
              Found <strong>{reservations.length}</strong> table bookings in total
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status"></div>
              <p className="mt-2 text-muted small">Auditing reservation records...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar2-x display-4 d-block mb-3"></i>
              <h6>No Reservations Found</h6>
              <p className="small mb-0">No booking records matching the given criteria.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>Diner Details</th>
                    <th>Restaurant Venue</th>
                    <th>Date & Seating</th>
                    <th>Party</th>
                    <th>Area</th>
                    <th>Status</th>
                    <th className="text-end">Administrative Override</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {reservations.map((res) => (
                    <tr key={res._id}>
                      <td>
                        <strong>{res.firstName} {res.lastName}</strong>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {res.email} • {res.phone}
                        </div>
                      </td>
                      <td>
                        <strong className="text-dark d-block">
                          {res.restaurant?.restaurantName || 'Restaurant'}
                        </strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {res.restaurant?.city}
                        </span>
                      </td>
                      <td>
                        <i className="bi bi-calendar-event me-1 text-danger"></i> {res.date}<br />
                        <span className="text-muted">{res.time}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {res.guests} Guests
                        </span>
                      </td>
                      <td>{res.diningArea}</td>
                      <td>
                        <span className={getBadgeClass(res.status)}>
                          {res.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-success"
                            onClick={() => handleUpdateStatus(res._id, 'Confirmed')}
                            title="Confirm Booking"
                            disabled={res.status === 'Confirmed'}
                          >
                            <i className="bi bi-check-lg"></i> Confirm
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleUpdateStatus(res._id, 'Rejected')}
                            title="Reject Booking"
                            disabled={res.status === 'Rejected'}
                          >
                            <i className="bi bi-x-lg"></i> Reject
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

export default ManageReservations;

