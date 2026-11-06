import React from 'react';
import { useNav } from './context/NavigationContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';
import MyReservations from './pages/customer/MyReservations';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import ManageRestaurant from './pages/owner/ManageRestaurant';
import OwnerManageReservations from './pages/owner/ManageReservations';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import AdminManageRestaurants from './pages/admin/ManageRestaurants';
import AdminManageReservations from './pages/admin/ManageReservations';

const App = () => {
  const { currentPath, params } = useNav();

  const renderCurrentView = () => {
    // 1. Restaurant Details route (matches /restaurant/:id)
    if (currentPath.startsWith('/restaurant/')) {
      const idFromPath = currentPath.split('/')[2];
      return <RestaurantDetails id={idFromPath} />;
    }

    // 2. Exact Path Router
    switch (currentPath) {
      case '/':
        return <Home />;
      case '/about':
        return <About />;
      case '/contact':
        return <Contact />;
      case '/login':
        return <Login />;
      case '/register':
        return <Register />;
      case '/restaurants':
        return <Restaurants />;

      // Customer Routes
      case '/customer/dashboard':
        return (
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        );
      case '/customer/profile':
        return (
          <ProtectedRoute allowedRoles={['customer', 'owner', 'admin']}>
            <CustomerProfile />
          </ProtectedRoute>
        );
      case '/customer/reservations':
        return (
          <ProtectedRoute allowedRoles={['customer']}>
            <MyReservations />
          </ProtectedRoute>
        );

      // Owner Routes
      case '/owner/dashboard':
        return (
          <ProtectedRoute allowedRoles={['owner', 'admin']}>
            <OwnerDashboard />
          </ProtectedRoute>
        );
      case '/owner/restaurant':
        return (
          <ProtectedRoute allowedRoles={['owner', 'admin']}>
            <ManageRestaurant />
          </ProtectedRoute>
        );
      case '/owner/reservations':
        return (
          <ProtectedRoute allowedRoles={['owner', 'admin']}>
            <OwnerManageReservations />
          </ProtectedRoute>
        );

      // Admin Routes
      case '/admin/dashboard':
        return (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        );
      case '/admin/users':
        return (
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageUsers />
          </ProtectedRoute>
        );
      case '/admin/restaurants':
        return (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminManageRestaurants />
          </ProtectedRoute>
        );
      case '/admin/reservations':
        return (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminManageReservations />
          </ProtectedRoute>
        );

      default:
        return (
          <div className="container py-5 text-center my-5">
            <h1 className="display-4 fw-bold text-danger">404</h1>
            <h3 className="fw-bold mb-3">Page Not Found</h3>
            <p className="text-secondary mb-4">The dining destination or page you requested could not be located.</p>
            <a href="/" className="btn btn-burgundy">Return to Homepage</a>
          </div>
        );
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        {renderCurrentView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;

