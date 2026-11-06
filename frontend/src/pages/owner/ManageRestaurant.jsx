import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNav } from '../../context/NavigationContext';
import { fetchApi } from '../../api';

const ManageRestaurant = () => {
  const { user } = useAuth();
  const { navigate } = useNav();

  const [restaurantId, setRestaurantId] = useState(null);
  const [formData, setFormData] = useState({
    restaurantName: '',
    description: '',
    cuisine: '',
    address: '',
    city: '',
    contactNumber: '',
    imagesStr: '',
    diningAreasStr: '',
    openingTime: '11:00 AM',
    closingTime: '11:00 PM'
  });

  const [approvalStatus, setApprovalStatus] = useState('Pending');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExisting = async () => {
      setLoading(true);
      try {
        const data = await fetchApi('/restaurant/owner/my');
        if (data.restaurant) {
          const r = data.restaurant;
          setRestaurantId(r._id);
          setApprovalStatus(r.approvalStatus || 'Approved');
          setFormData({
            restaurantName: r.restaurantName || '',
            description: r.description || '',
            cuisine: r.cuisine || '',
            address: r.address || '',
            city: r.city || '',
            contactNumber: r.contactNumber || '',
            imagesStr: (r.images || []).join('\n'),
            diningAreasStr: (r.diningAreas || []).join(', '),
            openingTime: r.availability?.openingTime || '11:00 AM',
            closingTime: r.availability?.closingTime || '11:00 PM'
          });
        }
      } catch (err) {
        console.error('Error fetching owner restaurant:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExisting();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.restaurantName || !formData.description || !formData.cuisine || !formData.address || !formData.city || !formData.contactNumber) {
      setError('Please fill in all mandatory restaurant fields.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    const imagesArray = formData.imagesStr
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const diningAreasArray = formData.diningAreasStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      restaurantName: formData.restaurantName.trim(),
      description: formData.description.trim(),
      cuisine: formData.cuisine.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      contactNumber: formData.contactNumber.trim(),
      images: imagesArray.length > 0 ? imagesArray : undefined,
      diningAreas: diningAreasArray.length > 0 ? diningAreasArray : ['Main Dining Room', 'Patio'],
      availability: {
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      }
    };

    try {
      if (restaurantId) {
        // Update
        const res = await fetchApi(`/restaurant/${restaurantId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setMessage('Restaurant details updated successfully!');
      } else {
        // Create new
        const res = await fetchApi('/restaurant', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setRestaurantId(res.restaurant._id);
        setApprovalStatus(res.restaurant.approvalStatus);
        setMessage('Restaurant created successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to save restaurant details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '85vh' }}>
      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom pb-4 mb-4">
                <div>
                  <span className="badge bg-danger text-uppercase fw-bold mb-1">Restaurateur Portal</span>
                  <h3 className="fw-bold text-dark mb-0" style={{ fontFamily: 'var(--font-serif)' }}>
                    {restaurantId ? 'Edit Restaurant Profile' : 'Register New Restaurant'}
                  </h3>
                </div>

                {restaurantId && (
                  <div className="d-flex align-items-center gap-2">
                    <span className="small text-muted">Status:</span>
                    <span className={`badge ${approvalStatus === 'Approved' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {approvalStatus}
                    </span>
                  </div>
                )}
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

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-danger" role="status"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-bold">Restaurant Name *</label>
                      <input
                        type="text"
                        name="restaurantName"
                        className="form-control"
                        value={formData.restaurantName}
                        onChange={handleChange}
                        placeholder="e.g. Trattoria Bella"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Cuisine Category *</label>
                      <input
                        type="text"
                        name="cuisine"
                        className="form-control"
                        value={formData.cuisine}
                        onChange={handleChange}
                        placeholder="e.g. Italian, Mediterranean"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Description *</label>
                      <textarea
                        name="description"
                        rows="3"
                        className="form-control"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Highlight your menu, ambiance, chef credentials, and unique culinary style..."
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Street Address *</label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="e.g. 42 Grand Avenue"
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-bold">City *</label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. New York"
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Contact Phone *</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        className="form-control"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="+1 555-0100"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Available Dining Sections (comma-separated)</label>
                      <input
                        type="text"
                        name="diningAreasStr"
                        className="form-control"
                        value={formData.diningAreasStr}
                        onChange={handleChange}
                        placeholder="e.g. Main Hall, Open Terrace, Rooftop, Private Dining Room"
                      />
                      <div className="form-text small">
                        Guests will be able to choose from these seating areas during online table booking.
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Opening Time</label>
                      <input
                        type="text"
                        name="openingTime"
                        className="form-control"
                        value={formData.openingTime}
                        onChange={handleChange}
                        placeholder="e.g. 11:30 AM"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Closing Time</label>
                      <input
                        type="text"
                        name="closingTime"
                        className="form-control"
                        value={formData.closingTime}
                        onChange={handleChange}
                        placeholder="e.g. 11:00 PM"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Image URLs (one per line or comma-separated)</label>
                      <textarea
                        name="imagesStr"
                        rows="3"
                        className="form-control"
                        value={formData.imagesStr}
                        onChange={handleChange}
                        placeholder="https://images.unsplash.com/photo-..."
                      ></textarea>
                      <div className="form-text small">
                        Provide links to high-resolution photography showcasing your interior, exterior, and dishes.
                      </div>
                    </div>

                    <div className="col-12 pt-3 border-top d-flex gap-2">
                      <button type="submit" className="btn btn-burgundy px-4 py-2" disabled={saving}>
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-save me-1"></i> Save Restaurant Details
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-3"
                        onClick={() => navigate('/owner/dashboard')}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRestaurant;

