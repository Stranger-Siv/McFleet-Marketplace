import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) {
      return;
    }

    const token = searchParams.get('token');

    if (!token) {
      // No token in URL, redirect to login
      hasProcessed.current = true;
      navigate('/login', { replace: true });
      return;
    }

    try {
      // Decode JWT token payload (base64 decode the middle part)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Extract user data from token payload
      const userData = {
        userId: payload.userId,
        role: payload.role
      };

      // Store token and user data in AuthContext
      login(token, userData);

      // Mark as processed
      hasProcessed.current = true;

      // Redirect based on role (use setTimeout to ensure state is set)
      const roleRoutes = {
        user: '/marketplace',
        seller: '/seller/dashboard',
        middleman: '/middleman/orders',
        admin: '/admin/dashboard'
      };

      const redirectPath = roleRoutes[userData.role] || '/';
      
      // Small delay to ensure state is persisted
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
    } catch (error) {
      // Invalid token, redirect to login
      console.error('Token decode error:', error);
      hasProcessed.current = true;
      navigate('/login', { replace: true });
    }
  }, []); // Empty dependency array - only run once on mount

  return (
    <div>
      <p>Processing login...</p>
    </div>
  );
}

export default AuthSuccess;

