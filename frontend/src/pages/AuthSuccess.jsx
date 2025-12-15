import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasProcessed = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) {
      return;
    }

    const token = searchParams.get('token');

    if (!token) {
      // No token in URL, redirect to login
      hasProcessed.current = true;
      setError('No token found in URL');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
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
      setError('Failed to process authentication. Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    }
  }, [searchParams, navigate, login]); // Include dependencies

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #131829 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    padding: '20px'
  };

  const cardStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '16px',
    padding: '48px',
    textAlign: 'center',
    maxWidth: '420px',
    width: '100%'
  };

  const spinnerStyle = {
    width: '40px',
    height: '40px',
    border: '4px solid #2d3447',
    borderTop: '4px solid #fbbf24',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 24px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {error ? (
          <>
            <div style={{ color: '#ef4444', marginBottom: '16px' }}>⚠️</div>
            <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
          </>
        ) : (
          <>
            <div style={spinnerStyle}></div>
            <h2 style={{ color: '#ffffff', marginBottom: '12px' }}>Processing login...</h2>
            <p style={{ color: '#b8bcc8' }}>Please wait while we authenticate you.</p>
          </>
        )}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default AuthSuccess;

