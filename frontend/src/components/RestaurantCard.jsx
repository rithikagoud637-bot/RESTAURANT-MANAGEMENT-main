import React from 'react';
import { useNav } from '../context/NavigationContext';

const RestaurantCard = ({ restaurant }) => {
  const { navigate } = useNav();

  const fallbackImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
  const displayImage = restaurant.images && restaurant.images.length > 0 ? restaurant.images[0] : fallbackImage;

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card custom-card h-100">
        <div className="card-img-container">
          <img
            src={displayImage}
            alt={restaurant.restaurantName}
            onError={(e) => { e.target.src = fallbackImage; }}
            loading="lazy"
          />
          <span className="cuisine-badge">
            <i className="bi bi-tag-fill me-1"></i>
            {restaurant.cuisine}
          </span>
        </div>

        <div className="card-body d-flex flex-column p-4">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title fw-bold mb-0 text-dark" style={{ fontFamily: 'var(--font-serif)' }}>
              {restaurant.restaurantName}
            </h5>
          </div>

          <p className="text-muted small mb-2">
            <i className="bi bi-geo-alt-fill text-danger me-1"></i>
            {restaurant.city} • <span className="text-secondary">{restaurant.address}</span>
          </p>

          <p className="card-text text-secondary small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {restaurant.description}
          </p>

          <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-3">
            <button
              className="btn btn-outline-burgundy btn-sm px-3"
              onClick={() => navigate(`/restaurant/${restaurant._id}`, { restaurantId: restaurant._id })}
            >
              <i className="bi bi-info-circle me-1"></i> Details
            </button>
            <button
              className="btn btn-burgundy btn-sm px-3"
              onClick={() => navigate(`/restaurant/${restaurant._id}`, { restaurantId: restaurant._id, openBooking: true })}
            >
              <i className="bi bi-calendar2-plus me-1"></i> Book Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

