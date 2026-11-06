import React, { useState, useEffect } from 'react';
import { useNav } from '../context/NavigationContext';
import { fetchApi } from '../api';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
  const { navigate } = useNav();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await fetchApi('/restaurant');
        if (data.restaurants) {
          // Take top 3-4 featured restaurants
          setFeaturedRestaurants(data.restaurants.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading featured restaurants:', err);
        setError('Unable to load featured restaurants from database.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/restaurants', { keyword: searchTerm });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <span className="badge bg-warning text-dark px-3 py-2 text-uppercase mb-3 fw-bold" style={{ letterSpacing: '1px' }}>
                Curated Fine Dining & Bistros
              </span>
              <h1 className="hero-title">
                Discover & Reserve Your Perfect Dining Experience
              </h1>
              <p className="hero-subtitle">
                Explore handpicked culinary havens, artisanal trattorias, and rooftop lounges.
                Secure prime tables in seconds with real-time restaurant confirmation.
              </p>

              {/* Search Bar */}
              <div className="card shadow-lg border-0 p-2 mx-auto" style={{ maxWidth: '720px', borderRadius: '50px' }}>
                <form onSubmit={handleSearch} className="d-flex flex-column flex-md-row align-items-center gap-2 p-1">
                  <div className="d-flex align-items-center flex-grow-1 px-3 w-100">
                    <i className="bi bi-search text-muted me-2 fs-5"></i>
                    <input
                      type="text"
                      className="form-control border-0 shadow-none ps-0"
                      placeholder="Search by restaurant name, cuisine, or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-burgundy rounded-pill px-4 py-2 w-100 w-md-auto text-nowrap">
                    <i className="bi bi-compass me-1"></i> Explore Restaurants
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section (Fetched from MongoDB) */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-cream)' }}>
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="text-uppercase fw-bold small text-danger" style={{ letterSpacing: '1px' }}>
                Culinary Highlights
              </span>
              <h2 className="fw-bold mb-1 text-dark" style={{ fontFamily: 'var(--font-serif)' }}>
                Featured Dining Destinations
              </h2>
              <p className="text-secondary small mb-0">
                Top-rated venues currently accepting immediate online reservations.
              </p>
            </div>
            <button
              className="btn btn-outline-burgundy btn-sm mt-3 mt-md-0"
              onClick={() => navigate('/restaurants')}
            >
              View All Restaurants <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading restaurants...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-warning text-center">{error}</div>
          ) : featuredRestaurants.length === 0 ? (
            <div className="alert alert-info text-center">No restaurants currently available.</div>
          ) : (
            <div className="row">
              {featuredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-uppercase fw-bold small text-warning" style={{ letterSpacing: '1px' }}>
              Effortless Booking
            </span>
            <h2 className="fw-bold text-dark mt-1" style={{ fontFamily: 'var(--font-serif)' }}>
              How GourmetReserve Works
            </h2>
            <p className="text-secondary small">From discovery to a celebratory table in three straightforward steps.</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 rounded-3 h-100 border" style={{ backgroundColor: 'var(--bg-cream)' }}>
                <div className="display-5 text-danger mb-3">
                  <i className="bi bi-compass"></i>
                </div>
                <h4 className="fw-bold mb-2">1. Discover Venues</h4>
                <p className="text-secondary small mb-0">
                  Browse authentic dining spaces filtered by cuisine, ambiance, seating sections, and city location.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-3 h-100 border" style={{ backgroundColor: 'var(--bg-cream)' }}>
                <div className="display-5 text-warning mb-3">
                  <i className="bi bi-calendar2-check"></i>
                </div>
                <h4 className="fw-bold mb-2">2. Reserve Your Table</h4>
                <p className="text-secondary small mb-0">
                  Select your desired date, seating time, preferred dining area, and submit any dietary requests.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-3 h-100 border" style={{ backgroundColor: 'var(--bg-cream)' }}>
                <div className="display-5 text-success mb-3">
                  <i className="bi bi-cup-hot"></i>
                </div>
                <h4 className="fw-bold mb-2">3. Dine & Celebrate</h4>
                <p className="text-secondary small mb-0">
                  Receive instant tracking on your reservation status and enjoy an unforgettable gastronomic experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-ivory)' }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="text-uppercase fw-bold small text-danger" style={{ letterSpacing: '1px' }}>
                Excellence in Hospitality
              </span>
              <h2 className="fw-bold text-dark mt-1 mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                Why Discerning Diners Choose GourmetReserve
              </h2>
              <p className="text-secondary mb-4">
                We bridge the gap between discerning food connoisseurs and premier restaurateurs through an intuitive, real-time table management architecture.
              </p>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-3 align-items-start">
                  <div className="bg-white p-2 rounded-circle shadow-sm text-danger fs-5">
                    <i className="bi bi-patch-check-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Direct Restaurant Confirmation</h6>
                    <p className="small text-secondary mb-0">Bookings are confirmed directly by executive restaurant staff and chefs.</p>
                  </div>
                </div>

                <div className="d-flex gap-3 align-items-start">
                  <div className="bg-white p-2 rounded-circle shadow-sm text-warning fs-5">
                    <i className="bi bi-layers-half"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Specific Seating Area Selection</h6>
                    <p className="small text-secondary mb-0">Choose between open-air terraces, private dining rooms, or chef counters.</p>
                  </div>
                </div>

                <div className="d-flex gap-3 align-items-start">
                  <div className="bg-white p-2 rounded-circle shadow-sm text-success fs-5">
                    <i className="bi bi-shield-lock-fill"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Transparent & Secure Platform</h6>
                    <p className="small text-secondary mb-0">Encrypted authentication and complete reservation history tracking.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80"
                  alt="Fine Dining Experience"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxHeight: '440px', width: '100%', objectFit: 'cover' }}
                />
                <div className="position-absolute bottom-0 start-0 m-4 p-3 bg-white rounded-3 shadow d-flex align-items-center gap-3">
                  <div className="fs-3 text-warning">⭐</div>
                  <div>
                    <div className="fw-bold text-dark">4.9 / 5.0 Rating</div>
                    <div className="small text-muted">Across 2,500+ Curated Diners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-5 bg-white border-top">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-uppercase fw-bold small text-danger" style={{ letterSpacing: '1px' }}>
              Diner Voices
            </span>
            <h2 className="fw-bold text-dark mt-1" style={{ fontFamily: 'var(--font-serif)' }}>
              What Our Guests Experience
            </h2>
            <p className="text-secondary small fst-italic">
              (Illustrative sample reviews presented for college project demonstration)
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 border rounded-3 h-100 shadow-sm" style={{ backgroundColor: 'var(--bg-cream)' }}>
                <div className="text-warning mb-2 fs-5">★★★★★</div>
                <p className="small text-secondary mb-3 fst-italic">
                  "Reserving a private terrace table at L’Osteria Bella Vita took less than a minute. The chef accommodated our dietary notes perfectly. A benchmark for modern hospitality!"
                </p>
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px' }}>
                    S
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark small">Siddharth Rao</h6>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Culinary Critic</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 border rounded-3 h-100 shadow-sm" style={{ backgroundColor: 'var(--bg-cream)' }}>
                <div className="text-warning mb-2 fs-5">★★★★★</div>
                <p className="small text-secondary mb-3 fst-italic">
                  "As a restaurant owner, managing table bookings and approving party requests in the owner dashboard has made our floor management 100% stress-free."
                </p>
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px' }}>
                    A
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark small">Chef Alessandro</h6>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Restaurateur & Partner</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 border rounded-3 h-100 shadow-sm" style={{ backgroundColor: 'var(--bg-cream)' }}>
                <div className="text-warning mb-2 fs-5">★★★★★</div>
                <p className="small text-secondary mb-3 fst-italic">
                  "The ability to preview dining areas and receive status updates on whether our table is pending or confirmed gave our anniversary celebration total peace of mind."
                </p>
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px' }}>
                    M
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark small">Meera Kapoor</h6>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Verified Customer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, var(--burgundy-primary), #3b0910)', color: '#ffffff' }}>
        <div className="container text-center py-4">
          <h2 className="fw-bold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
            Ready for an Unforgettable Culinary Journey?
          </h2>
          <p className="mb-4 text-light mx-auto" style={{ maxWidth: '600px' }}>
            Join thousands of food lovers enjoying effortless table reservations at the city's finest dining destinations.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-gold btn-lg px-4" onClick={() => navigate('/restaurants')}>
              <i className="bi bi-calendar-event me-2"></i> Book a Table Now
            </button>
            <button className="btn btn-outline-light btn-lg px-4" onClick={() => navigate('/register')}>
              Create Free Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

