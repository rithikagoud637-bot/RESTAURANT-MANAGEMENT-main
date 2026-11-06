import React from 'react';
import { useNav } from '../context/NavigationContext';

const About = () => {
  const { navigate } = useNav();

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <div className="container py-4">
        {/* Header */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '750px' }}>
          <span className="text-uppercase fw-bold small text-danger" style={{ letterSpacing: '1px' }}>
            Our Heritage & Vision
          </span>
          <h1 className="fw-bold text-dark mt-1" style={{ fontFamily: 'var(--font-serif)' }}>
            Elevating the Art of Dining
          </h1>
          <p className="text-secondary">
            GourmetReserve was engineered as an all-encompassing restaurant reservation and hospitality management platform designed to connect culinary creators with passionate food connoisseurs.
          </p>
        </div>

        {/* Story Section */}
        <div className="row align-items-center g-5 mb-5">
          <div className="col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
              alt="Restaurant Ambiance"
              className="img-fluid rounded-4 shadow"
            />
          </div>
          <div className="col-lg-6">
            <h3 className="fw-bold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              Curated Dining, Seamless Technology
            </h3>
            <p className="text-secondary">
              Finding the right table at an exceptional restaurant should be as delightful as the meal itself. Traditional reservation processes often suffer from phone tag, outdated table availability, and double bookings.
            </p>
            <p className="text-secondary">
              GourmetReserve eliminates friction through real-time synchronization between diners and restaurateurs. Customers can choose custom dining areas—whether an intimate starlight rooftop or a lively open courtyard—while restaurateurs retain total autonomy to review and approve booking requests.
            </p>
            <div className="row g-3 pt-2">
              <div className="col-6">
                <div className="p-3 bg-white border rounded-3 text-center">
                  <h3 className="fw-bold text-danger mb-0">100%</h3>
                  <small className="text-muted">Real-Time Sync</small>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-white border rounded-3 text-center">
                  <h3 className="fw-bold text-warning mb-0">Zero</h3>
                  <small className="text-muted">Booking Fees</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Pillars */}
        <div className="bg-white p-5 rounded-4 shadow-sm border mb-5">
          <div className="text-center mb-4">
            <h3 className="fw-bold" style={{ fontFamily: 'var(--font-serif)' }}>Built for Three Key Roles</h3>
          </div>
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-3">
                <div className="fs-1 text-danger mb-2"><i className="bi bi-person-heart"></i></div>
                <h5 className="fw-bold">For Diners</h5>
                <p className="text-secondary small">
                  Effortless discovery, seating preferences, real-time status updates from Pending to Confirmed, and streamlined cancellation control.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <div className="fs-1 text-warning mb-2"><i className="bi bi-shop-window"></i></div>
                <h5 className="fw-bold">For Restaurant Owners</h5>
                <p className="text-secondary small">
                  Dedicated control room to manage dining sections, update operating hours, and review customer reservations with one-click approval.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <div className="fs-1 text-primary mb-2"><i className="bi bi-shield-check"></i></div>
                <h5 className="fw-bold">For Administrators</h5>
                <p className="text-secondary small">
                  Comprehensive dashboard monitoring system metrics, vetting restaurant listings, managing user roles, and ensuring platform reliability.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button className="btn btn-burgundy btn-lg px-4" onClick={() => navigate('/restaurants')}>
            Explore Curated Restaurants
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;

