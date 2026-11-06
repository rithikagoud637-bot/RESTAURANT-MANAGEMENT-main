import React from 'react';
import { useNav } from '../context/NavigationContext';

const Footer = () => {
  const { navigate } = useNav();

  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="d-flex align-items-center gap-2">
              <span>🍷</span> Gourmet<span style={{ color: 'var(--gold-accent)' }}>Reserve</span>
            </h5>
            <p className="small text-secondary pe-lg-3">
              Elevating dining through seamless reservations at top-tier culinary destinations.
              Book handcrafted culinary experiences, rooftop vistas, and intimate dining rooms with immediate confirmation.
            </p>
            <div className="d-flex gap-3 text-secondary fs-5 mt-3">
              <a href="#instagram" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
              <a href="#facebook" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
              <a href="#twitter" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
              <a href="#linkedin" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h5>Explore</h5>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><button className="btn btn-link p-0 text-start text-secondary" onClick={() => navigate('/')}>Home</button></li>
              <li><button className="btn btn-link p-0 text-start text-secondary" onClick={() => navigate('/restaurants')}>Browse Restaurants</button></li>
              <li><button className="btn btn-link p-0 text-start text-secondary" onClick={() => navigate('/about')}>About Us</button></li>
              <li><button className="btn btn-link p-0 text-start text-secondary" onClick={() => navigate('/contact')}>Contact Concierge</button></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 col-6">
            <h5>Portals</h5>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><button className="btn btn-link p-0 text-start text-secondary" onClick={() => navigate('/login')}>Customer Sign In</button></li>
              <li><button className="btn btn-link p-0 text-start text-secondary" onClick={() => navigate('/register')}>Guest Registration</button></li>
              <li><button className="btn btn-link p-0 text-start text-secondary" onClick={() => navigate('/login')}>Restaurant Owner Portal</button></li>
              <li><button className="btn btn-link p-0 text-start text-secondary" onClick={() => navigate('/login')}>Administrator Access</button></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5>Concierge Contact</h5>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2">
              <li><i className="bi bi-geo-alt me-2 text-warning"></i> 100 Culinary Plaza, Epicurean Way</li>
              <li><i className="bi bi-telephone me-2 text-warning"></i> +1 (800) 555-DINE (3463)</li>
              <li><i className="bi bi-envelope me-2 text-warning"></i> reservations@gourmetreserve.com</li>
              <li><i className="bi bi-clock me-2 text-warning"></i> Open Daily: 9:00 AM – Midnight</li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start small text-secondary">
            &copy; {new Date().getFullYear()} GourmetReserve Inc. College Demonstration Project. All rights reserved.
          </div>
          <div className="col-md-6 text-center text-md-end small text-secondary mt-2 mt-md-0">
            Designed with React, Node.js, Express & MongoDB Compass.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

