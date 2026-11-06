import React, { useState, useEffect } from 'react';
import { useNav } from '../../context/NavigationContext';
import { fetchApi } from '../../api';

const ManageRestaurants = () => {
  const { navigate } = useNav();

  const [restaurants, setRestaurants] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const loadRestaurants = async () => {
    setLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      else queryParams.append('status', 'all');
      if (keyword) queryParams.append('keyword', keyword);

      const queryStr = `?${queryParams.toString()}`;
      const data = await fetchApi(`/restaurant${queryStr}`);
      setRestaurants(data.restaurants || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch restaurants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadRestaurants();
  };

  const handleUpdateApproval = async (id, approvalStatus) => {
    try {
      await fetchApi(`/restaurant/${id}/approval`, {
        method: 'PUT',
        body: JSON.stringify({ approvalStatus })
      });
      setActionMsg(`Restaurant listing updated to ${approvalStatus}.`);
      loadRestaurants();
    } catch (err) {
      setError(err.message || 'Failed to update approval status.');
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant and remove it from the platform?')) return;

    try {
      await fetchApi(`/restaurant/${id}`, {
        method: 'DELETE'
      });
      setActionMsg('Restaurant deleted successfully.');
      loadRestaurants();
    } catch (err) {
      setError(err.message || 'Failed to delete restaurant.');
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
              Restaurant Catalog & Approvals
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
                  placeholder="Search restaurant by name, cuisine, or city..."
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
                <option value="all">All Approval Statuses</option>
                <option value="Approved">Approved Only</option>
                <option value="Pending">Pending Approval</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="col-md-2">
              <button type="submit" className="btn btn-burgundy w-100">
                Filter
              </button>
            </div>
          </form>
        </div>

        {/* Restaurant Table */}
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">
              Found <strong>{restaurants.length}</strong> dining venues in database
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status"></div>
              <p className="mt-2 text-muted small">Loading venues...</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-shop display-4 d-block mb-3"></i>
              <h6>No Restaurants Found</h6>
              <p className="small mb-0">No restaurant listings matching current filters.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>Restaurant Details</th>
                    <th>Cuisine</th>
                    <th>Location</th>
                    <th>Contact & Owner</th>
                    <th>Status</th>
                    <th className="text-end">Manage Listing</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {restaurants.map((r) => (
                    <tr key={r._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={r.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80'}
                            alt={r.restaurantName}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <div>
                            <strong className="text-dark d-block">{r.restaurantName}</strong>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                              ID: <code>{r._id.substring(r._id.length - 8)}</code>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-danger-subtle text-danger border">
                          {r.cuisine}
                        </span>
                      </td>
                      <td>
                        {r.city}<br />
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{r.address}</span>
                      </td>
                      <td>
                        <div><i className="bi bi-telephone text-muted me-1"></i> {r.contactNumber}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Owner: {r.owner?.name || 'Assigned Owner'}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${r.approvalStatus === 'Approved' ? 'bg-success' : r.approvalStatus === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                          {r.approvalStatus}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          {r.approvalStatus !== 'Approved' && (
                            <button
                              className="btn btn-outline-success"
                              onClick={() => handleUpdateApproval(r._id, 'Approved')}
                              title="Approve Listing"
                            >
                              <i className="bi bi-check-lg"></i> Approve
                            </button>
                          )}
                          {r.approvalStatus !== 'Rejected' && (
                            <button
                              className="btn btn-outline-warning"
                              onClick={() => handleUpdateApproval(r._id, 'Rejected')}
                              title="Reject Listing"
                            >
                              <i className="bi bi-x-lg"></i> Reject
                            </button>
                          )}
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteRestaurant(r._id)}
                            title="Delete Record"
                          >
                            <i className="bi bi-trash"></i>
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

export default ManageRestaurants;

