import React, { useState, useEffect } from 'react';
import { useNav } from '../context/NavigationContext';
import { fetchApi } from '../api';
import RestaurantCard from '../components/RestaurantCard';

const Restaurants = () => {
  const { params } = useNav();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [keyword, setKeyword] = useState(params.keyword || '');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const loadRestaurants = async () => {
    setLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams();
      if (keyword) queryParams.append('keyword', keyword);
      if (selectedCuisine) queryParams.append('cuisine', selectedCuisine);
      if (selectedCity) queryParams.append('city', selectedCity);

      const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const data = await fetchApi(`/restaurant${queryStr}`);
      setRestaurants(data.restaurants || []);
    } catch (err) {
      setError(err.message || 'Failed to load restaurants from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, [selectedCuisine, selectedCity]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadRestaurants();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCuisine('');
    setSelectedCity('');
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-cream)', minHeight: '85vh' }}>
      <div className="container py-3">
        {/* Header */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '700px' }}>
          <span className="text-uppercase fw-bold small text-danger" style={{ letterSpacing: '1px' }}>
            Curated Venues
          </span>
          <h1 className="fw-bold text-dark mt-1" style={{ fontFamily: 'var(--font-serif)' }}>
            Explore Dining Destinations
          </h1>
          <p className="text-secondary small">
            Browse verified culinary spaces dynamically fetched from the MongoDB database. Select your venue to inspect seating areas and reserve your table.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="card shadow-sm border-0 p-3 p-md-4 mb-5" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
          <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label small fw-bold text-muted">Search by Keyword</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Restaurant name or description..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-bold text-muted">Cuisine</label>
              <select
                className="form-select"
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
              >
                <option value="">All Cuisines</option>
                <option value="Italian">Italian & Mediterranean</option>
                <option value="Indian">North Indian Fine Dining</option>
                <option value="French">French Contemporary</option>
                <option value="Japanese">Japanese & Asian Fusion</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-bold text-muted">City</label>
              <select
                className="form-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Cities</option>
                <option value="New York">New York</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Chicago">Chicago</option>
                <option value="Seattle">Seattle</option>
              </select>
            </div>

            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-burgundy w-100 py-2">
                Filter
              </button>
              {(keyword || selectedCuisine || selectedCity) && (
                <button
                  type="button"
                  className="btn btn-outline-secondary py-2"
                  onClick={handleResetFilters}
                  title="Reset Filters"
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading venues...</span>
            </div>
            <p className="mt-2 text-muted small">Fetching culinary destinations from MongoDB...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center p-4">
            <i className="bi bi-exclamation-triangle display-6 d-block mb-2"></i>
            <h5>Error Loading Restaurants</h5>
            <p className="small mb-0">{error}</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="card text-center p-5 border-0 shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
            <i className="bi bi-search display-4 text-muted mb-3"></i>
            <h4 className="fw-bold">No Restaurants Found</h4>
            <p className="text-secondary small mb-4">
              We couldn't find any dining destinations matching your current filter criteria.
            </p>
            <button className="btn btn-outline-burgundy btn-sm mx-auto" onClick={handleResetFilters}>
              Clear Search Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">
                Showing <strong>{restaurants.length}</strong> available dining venues
              </span>
            </div>
            <div className="row">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;

