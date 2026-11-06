import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNav } from '../context/NavigationContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { currentPath, navigate } = useNav();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'owner') return '/owner/dashboard';
    return '/customer/dashboard';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <button
          className="navbar-brand navbar-brand-custom btn btn-link p-0 text-start"
          onClick={() => navigate('/')}
        >
          <span style={{ fontSize: '1.6rem' }}>🍷</span>
          <span>Gourmet<span style={{ color: 'var(--gold-accent)' }}>Reserve</span></span>
        </button>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <button
                className={`nav-link-custom btn btn-link ${currentPath === '/' ? 'active' : ''}`}
                onClick={() => { navigate('/'); setIsOpen(false); }}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link-custom btn btn-link ${currentPath === '/restaurants' ? 'active' : ''}`}
                onClick={() => { navigate('/restaurants'); setIsOpen(false); }}
              >
                Restaurants
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link-custom btn btn-link ${currentPath === '/about' ? 'active' : ''}`}
                onClick={() => { navigate('/about'); setIsOpen(false); }}
              >
                About
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link-custom btn btn-link ${currentPath === '/contact' ? 'active' : ''}`}
                onClick={() => { navigate('/contact'); setIsOpen(false); }}
              >
                Contact
              </button>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-burgundy btn-sm dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => setIsOpen(false)}
                >
                  <i className="bi bi-person-circle"></i>
                  <span>{user.name}</span>
                  <span className="badge bg-secondary text-uppercase ms-1" style={{ fontSize: '0.65rem' }}>
                    {user.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 show-on-click" aria-labelledby="userDropdown">
                  <li>
                    <button className="dropdown-item py-2" onClick={() => navigate(getDashboardPath())}>
                      <i className="bi bi-speedometer2 me-2"></i> Dashboard
                    </button>
                  </li>

                  {user.role === 'customer' && (
                    <>
                      <li>
                        <button className="dropdown-item py-2" onClick={() => navigate('/customer/reservations')}>
                          <i className="bi bi-calendar-check me-2"></i> My Reservations
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item py-2" onClick={() => navigate('/customer/profile')}>
                          <i className="bi bi-person-gear me-2"></i> My Profile
                        </button>
                      </li>
                    </>
                  )}

                  {user.role === 'owner' && (
                    <>
                      <li>
                        <button className="dropdown-item py-2" onClick={() => navigate('/owner/restaurant')}>
                          <i className="bi bi-shop me-2"></i> Manage Restaurant
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item py-2" onClick={() => navigate('/owner/reservations')}>
                          <i className="bi bi-calendar-week me-2"></i> Bookings
                        </button>
                      </li>
                    </>
                  )}

                  {user.role === 'admin' && (
                    <>
                      <li>
                        <button className="dropdown-item py-2" onClick={() => navigate('/admin/users')}>
                          <i className="bi bi-people me-2"></i> Manage Users
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item py-2" onClick={() => navigate('/admin/restaurants')}>
                          <i className="bi bi-building me-2"></i> Restaurants
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item py-2" onClick={() => navigate('/admin/reservations')}>
                          <i className="bi bi-journal-text me-2"></i> Reservations
                        </button>
                      </li>
                    </>
                  )}

                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-burgundy btn-sm"
                  onClick={() => { navigate('/login'); setIsOpen(false); }}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                </button>
                <button
                  className="btn btn-burgundy btn-sm"
                  onClick={() => { navigate('/register'); setIsOpen(false); }}
                >
                  <i className="bi bi-person-plus me-1"></i> Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

