import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNav } from '../context/NavigationContext';
import { fetchApi } from '../api';

const BookingForm = ({ restaurant, onBookingSuccess }) => {
  const { user } = useAuth();
  const { navigate } = useNav();

  // Compute minimum selectable date (today in YYYY-MM-DD format)
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: todayStr,
    time: '07:00 PM',
    guests: 2,
    diningArea: '',
    specialRequests: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Prepopulate customer details if logged in
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').trim().split(' ');
      const fName = nameParts[0] || '';
      const lName = nameParts.slice(1).join(' ') || '';

      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || fName,
        lastName: prev.lastName || lName,
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }

    if (restaurant && restaurant.diningAreas && restaurant.diningAreas.length > 0) {
      setFormData((prev) => ({
        ...prev,
        diningArea: prev.diningArea || restaurant.diningAreas[0]
      }));
    }
  }, [user, restaurant]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please log in with a customer account to make a table reservation.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.date || !formData.time || !formData.diningArea) {
      setError('Please fill in all required fields.');
      return;
    }

    // Check date not in past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError('Reservation date cannot be in the past.');
      return;
    }

    if (formData.guests < 1 || formData.guests > 50) {
      setError('Guest count must be between 1 and 50.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetchApi('/reservation', {
        method: 'POST',
        body: JSON.stringify({
          restaurantId: restaurant._id,
          ...formData
        })
      });

      setSuccess(res.message || 'Your reservation has been received and is currently Pending owner confirmation!');
      if (onBookingSuccess) onBookingSuccess(res.reservation);
    } catch (err) {
      setError(err.message || 'Failed to submit reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
      <div className="border-bottom pb-3 mb-4">
        <h4 className="fw-bold text-dark mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
          <i className="bi bi-calendar-heart text-danger me-2"></i>
          Reserve a Table
        </h4>
        <p className="text-muted small mb-0">
          Instant booking at <strong className="text-dark">{restaurant.restaurantName}</strong>. Initial status will be <span className="badge badge-pending">Pending</span>.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger py-2 small d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="alert alert-success py-3" role="alert">
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-check-circle-fill me-2 fs-5 text-success"></i>
            <strong>Reservation Confirmed!</strong>
          </div>
          <p className="small mb-2">{success}</p>
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => navigate('/customer/reservations')}
          >
            <i className="bi bi-calendar-check me-1"></i> View in My Reservations
          </button>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold">First Name *</label>
              <input
                type="text"
                name="firstName"
                className="form-control form-control-sm"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Last Name *</label>
              <input
                type="text"
                name="lastName"
                className="form-control form-control-sm"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control form-control-sm"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-control form-control-sm"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555-0199"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Reservation Date *</label>
              <input
                type="date"
                name="date"
                min={todayStr}
                className="form-control form-control-sm"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Seating Time *</label>
              <select
                name="time"
                className="form-select form-select-sm"
                value={formData.time}
                onChange={handleChange}
                required
              >
                <option value="12:00 PM">12:00 PM (Lunch)</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="06:00 PM">06:00 PM (Dinner)</option>
                <option value="06:30 PM">06:30 PM</option>
                <option value="07:00 PM">07:00 PM</option>
                <option value="07:30 PM">07:30 PM</option>
                <option value="08:00 PM">08:00 PM</option>
                <option value="08:30 PM">08:30 PM</option>
                <option value="09:00 PM">09:00 PM</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Number of Guests *</label>
              <input
                type="number"
                name="guests"
                min="1"
                max="50"
                className="form-control form-control-sm"
                value={formData.guests}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Dining Area *</label>
              <select
                name="diningArea"
                className="form-select form-select-sm"
                value={formData.diningArea}
                onChange={handleChange}
                required
              >
                {restaurant.diningAreas && restaurant.diningAreas.length > 0 ? (
                  restaurant.diningAreas.map((area, idx) => (
                    <option key={idx} value={area}>{area}</option>
                  ))
                ) : (
                  <option value="Main Dining Hall">Main Dining Hall</option>
                )}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold">Special Requests (Optional)</label>
              <textarea
                name="specialRequests"
                rows="2"
                className="form-control form-control-sm"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Dietary requirements, anniversary celebration, preferred corner table, etc."
              ></textarea>
            </div>

            <div className="col-12 mt-4">
              <button
                type="submit"
                className="btn btn-burgundy w-100 py-2 d-flex align-items-center justify-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Securing Table...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle fs-5"></i>
                    <span>Confirm Table Reservation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookingForm;

