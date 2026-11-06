import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNav } from '../context/NavigationContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const { navigate } = useNav();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5">
        <div className="card shadow-sm p-5 text-center mx-auto" style={{ maxWidth: '540px' }}>
          <i className="bi bi-shield-lock text-danger display-4 mb-3"></i>
          <h3 className="fw-bold mb-2">Authentication Required</h3>
          <p className="text-secondary mb-4">
            You must be logged in to access this portal page. Please sign in with your credentials to continue.
          </p>
          <button className="btn btn-burgundy" onClick={() => navigate('/login')}>
            <i className="bi bi-box-arrow-in-right me-2"></i> Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="container py-5">
        <div className="card shadow-sm p-5 text-center mx-auto" style={{ maxWidth: '540px' }}>
          <i className="bi bi-exclamation-octagon text-warning display-4 mb-3"></i>
          <h3 className="fw-bold mb-2">Access Restricted</h3>
          <p className="text-secondary mb-4">
            Your current account role (<strong className="text-capitalize">{user.role}</strong>) does not have authorization to view this area.
          </p>
          <button
            className="btn btn-outline-burgundy"
            onClick={() => {
              if (user.role === 'admin') navigate('/admin/dashboard');
              else if (user.role === 'owner') navigate('/owner/dashboard');
              else navigate('/customer/dashboard');
            }}
          >
            Return to My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

