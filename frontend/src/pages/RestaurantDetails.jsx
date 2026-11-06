import React, { useState, useEffect } from 'react';
import { useNav } from '../context/NavigationContext';
import { fetchApi } from '../api';
import BookingForm from '../components/BookingForm';

const RestaurantDetails = ({ id }) => {
  const { navigate, params } = useNav();
  const restaurantId = id || params.restaurantId;

  const [restaurant, setRestaurant] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      if (!restaurantId) {
        setError('No restaurant ID provided.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchApi(`/restaurant/${restaurantId}`);
        setRestaurant(data.restaurant);
      } catch (err) {
        setError(err.message || 'Failed to load restaurant details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-danger mt-5" role="status">
          <span className="visually-hidden">Loading restaurant details...</span>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-exclamation-triangle text-warning display-4 mb-3"></i>
          <h4>Restaurant Not Found</h4>
          <p className="text-secondary small mb-4">{error || 'The requested venue is unavailable.'}</p>
          <button className="btn btn-burgundy" onClick={() => navigate('/restaurants')}>
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  const fallbackImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';
  const images = restaurant.images && restaurant.images.length > 0 ? restaurant.images : [fallbackImage];

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '90vh' }}>
      <div className="container py-3">
        {/* Navigation Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <button className="btn btn-link p-0 text-decoration-none text-secondary" onClick={() => navigate('/')}>Home</button>
            </li>
            <li className="breadcrumb-item">
              <button className="btn btn-link p-0 text-decoration-none text-secondary" onClick={() => navigate('/restaurants')}>Restaurants</button>
            </li>
            <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">{restaurant.restaurantName}</li>
          </ol>
        </nav>

        {/* Hero Gallery */}
        <div className="row g-4 mb-5">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm overflow-hidden rounded-4">
              <div style={{ height: '420px', backgroundColor: '#222' }}>
                <img
                  src={images[activeImageIndex] || fallbackImage}
                  alt={restaurant.restaurantName}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Thumbnails if multiple images exist */}
              {images.length > 1 && (
                <div className="d-flex gap-2 p-2 bg-white border-top overflow-auto">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      onClick={() => setActiveImageIndex(idx)}
                      style={{
                        width: '80px',
                        height: '55px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        border: activeImageIndex === idx ? '2px solid var(--gold-accent)' : '1px solid #ddd'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 h-100 d-flex flex-column justify-content-between rounded-4 bg-white">
              <div>
                <span className="badge bg-danger mb-2 text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                  {restaurant.cuisine}
                </span>
                <h2 className="fw-bold text-dark mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  {restaurant.restaurantName}
                </h2>

                <p className="text-secondary small mb-3">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                  {restaurant.address}, {restaurant.city}
                </p>

                <div className="p-3 bg-light rounded-3 mb-3 small">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-telephone-fill text-warning me-2"></i>
                    <span><strong>Phone:</strong> {restaurant.contactNumber}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-clock-fill text-warning me-2"></i>
                    <span>
                      <strong>Hours:</strong> {restaurant.availability?.openingTime || '11:00 AM'} – {restaurant.availability?.closingTime || '11:00 PM'}
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-calendar-check-fill text-warning me-2"></i>
                    <span><strong>Days:</strong> Open 7 days a week</span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="fw-bold small d-block mb-2 text-dark">Available Dining Sections:</span>
                  <div className="d-flex flex-wrap gap-1">
                    {restaurant.diningAreas && restaurant.diningAreas.map((area, idx) => (
                      <span key={idx} className="badge bg-secondary-subtle text-dark border py-1 px-2" style={{ fontSize: '0.75rem' }}>
                        <i className="bi bi-check2 text-success me-1"></i>
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-top">
                <a href="#reservationSection" className="btn btn-burgundy w-100 py-2 d-flex align-items-center justify-content-center gap-2">
                  <i className="bi bi-calendar-heart fs-5"></i>
                  <span>Reserve Table at this Venue</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content & Booking Form Row */}
        <div className="row g-4" id="reservationSection">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4">
              <h4 className="fw-bold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                About the Dining Experience
              </h4>
              <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                {restaurant.description}
              </p>

              <hr className="my-4" />

              <h5 className="fw-bold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                Dining Guidelines & Venue Policies
              </h5>
              <div className="row g-3 small text-secondary">
                <div className="col-md-6 d-flex gap-2 align-items-start">
                  <i className="bi bi-hourglass-split text-danger fs-5"></i>
                  <div>
                    <strong>Holding Grace Period:</strong>
                    <div>Tables are reserved with a 15-minute courtesy window after designated seating.</div>
                  </div>
                </div>
                <div className="col-md-6 d-flex gap-2 align-items-start">
                  <i className="bi bi-person-check text-success fs-5"></i>
                  <div>
                    <strong>Confirmation Process:</strong>
                    <div>Bookings start as Pending and are reviewed by restaurant reception staff.</div>
                  </div>
                </div>
                <div className="col-md-6 d-flex gap-2 align-items-start">
                  <i className="bi bi-cup-straw text-warning fs-5"></i>
                  <div>
                    <strong>Dress Code:</strong>
                    <div>Smart casual to semi-formal attire recommended for evening dinners.</div>
                  </div>
                </div>
                <div className="col-md-6 d-flex gap-2 align-items-start">
                  <i className="bi bi-x-circle text-danger fs-5"></i>
                  <div>
                    <strong>Cancellation:</strong>
                    <div>Cancellations can be made anytime through your Customer Dashboard.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <BookingForm restaurant={restaurant} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;

