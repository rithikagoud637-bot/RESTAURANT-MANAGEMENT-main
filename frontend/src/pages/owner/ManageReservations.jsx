import React, { useState, useEffect } from 'react';
import { useNav } from '../../context/NavigationContext';
import { fetchApi } from '../../api';

const ManageReservations = () => {
  const { navigate } = useNav();
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const loadReservations = async () => {
    setLoading(true);
    try {
      const url = activeTab === 'all' ? '/reservation/owner' : `/reservation/owner?status=${activeTab}`;
      const data = await fetchApi(url);
      setReservations(data.reservations || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [activeTab]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await fetchApi(`/reservation/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setActionMsg(`Reservation updated to ${status}.`);
      loadReservations();
    } catch (err) {
      setError(err.message || 'Failed to update reservation.');
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
              Table Inquiries
            </span>
            <h2 className="fw-bold text-dark mt-1 mb-0" style={{ fontFamily: 'var(--font-serif)' }}>
              Manage Table Reservations
            </h2>
          </div>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/owner/dashboard')}>
            <i className="bi bi-speedometer2 me-1"></i> Owner Dashboard
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

        {/* Status Filter Tabs */}
        <div className="card border-0 shadow-sm rounded-4 bg-white p-3 mb-4">
          <ul className="nav nav-pills gap-2">
            {['all', 'Pending', 'Confirmed', 'Rejected', 'Cancelled'].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link btn-sm ${activeTab === tab ? 'active bg-danger' : 'text-dark bg-light'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'all' ? 'All Bookings' : tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Table */}
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status"></div>
              <p className="mt-2 text-muted small">Loading reservations...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox display-4 d-block mb-3"></i>
              <h6>No Reservations Found</h6>
              <p className="small mb-0">No booking requests found under status "{activeTab}".</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>Customer Name</th>
                    <th>Contact Info</th>
                    <th>Date & Seating</th>
                    <th>Party Size</th>
                    <th>Section</th>
                    <th>Special Requests</th>
                    <th>Status</th>
                    <th className="text-end">Manage Action</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {reservations.map((res) => (
                    <tr key={res._id}>
                      <td className="fw-bold">
                        {res.firstName} {res.lastName}
                        <div className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                          ID: <code>{res._id.substring(res._id.length - 8)}</code>
                        </div>
                      </td>
                      <td>
                        <div><i className="bi bi-envelope me-1 text-muted"></i> {res.email}</div>
                        <div><i className="bi bi-telephone me-1 text-muted"></i> {res.phone}</div>
                      </td>
                      <td>
                        <i className="bi bi-calendar-event me-1 text-danger"></i> {res.date}<br />
                        <span className="text-muted"><i className="bi bi-clock me-1"></i> {res.time}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {res.guests} Guests
                        </span>
                      </td>
                      <td>{res.diningArea}</td>
                      <td>
                        <span className="text-secondary fst-italic">
                          {res.specialRequests || 'None'}
                        </span>
                      </td>
                      <td>
                        <span className={getBadgeClass(res.status)}>
                          {res.status}
                        </span>
                      </td>
                      <td className="text-end">
                        {res.status === 'Pending' ? (
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-success"
                              onClick={() => handleUpdateStatus(res._id, 'Confirmed')}
                              title="Approve Table"
                            >
                              <i className="bi bi-check-lg"></i> Approve
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleUpdateStatus(res._id, 'Rejected')}
                              title="Decline Table"
                            >
                              <i className="bi bi-x-lg"></i> Reject
                            </button>
                          </div>
                        ) : res.status === 'Confirmed' ? (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleUpdateStatus(res._id, 'Rejected')}
                          >
                            Mark Rejected
                          </button>
                        ) : res.status === 'Rejected' ? (
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleUpdateStatus(res._id, 'Confirmed')}
                          >
                            Reinstate
                          </button>
                        ) : (
                          <span className="text-muted small">Cancelled by diner</span>
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

export default ManageReservations;

