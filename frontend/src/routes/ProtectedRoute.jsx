import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading placeholder while checking auth state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to landing page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If authenticated but role not allowed, redirect to forbidden
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/403" replace />;
  }

  // Render children if provided, otherwise render outlet for nested routes
  return children || <Outlet />;
}

export default ProtectedRoute;

