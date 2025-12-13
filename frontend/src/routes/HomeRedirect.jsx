import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Landing from '../pages/Landing';

function HomeRedirect() {
  const { isAuthenticated, user } = useAuth();

  // If authenticated, redirect to appropriate dashboard based on role
  if (isAuthenticated && user) {
    const roleRoutes = {
      user: '/marketplace',
      seller: '/seller/dashboard',
      middleman: '/middleman/orders',
      admin: '/admin/dashboard'
    };

    const redirectPath = roleRoutes[user.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  // Not authenticated, show landing page
  return <Landing />;
}

export default HomeRedirect;

