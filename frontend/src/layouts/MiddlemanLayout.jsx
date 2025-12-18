import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResponsive } from '../hooks/useResponsive';

function MiddlemanLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navStyle = {
    backgroundColor: '#131829',
    backdropFilter: 'blur(10px)',
    padding: isMobile ? '12px 16px' : isTablet ? '14px 24px' : '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    borderBottom: '1px solid #2d3447',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: '#ffffff'
  };

  const logoTextStyle = {
    fontSize: '20px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const userBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    backgroundColor: '#1e2338',
    borderRadius: '8px',
    border: '1px solid #2d3447'
  };

  const logoutButtonStyle = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  };

  const hamburgerButtonStyle = {
    display: isMobile ? 'flex' : 'none',
    flexDirection: 'column',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const hamburgerLineStyle = {
    width: '20px',
    height: '2px',
    backgroundColor: '#ffffff',
    borderRadius: '2px',
    transition: 'all 0.3s ease'
  };

  const navActionsStyle = {
    display: isMobile ? (mobileMenuOpen ? 'flex' : 'none') : 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
    gap: isMobile ? '8px' : '16px',
    position: isMobile ? 'absolute' : 'relative',
    top: isMobile ? '100%' : 'auto',
    right: isMobile ? 0 : 'auto',
    left: isMobile ? 0 : 'auto',
    backgroundColor: isMobile ? '#131829' : 'transparent',
    padding: isMobile ? '16px' : 0,
    boxShadow: isMobile ? '0 4px 16px rgba(0, 0, 0, 0.4)' : 'none',
    borderBottom: isMobile ? '1px solid #2d3447' : 'none',
    width: isMobile ? '100%' : 'auto',
    zIndex: isMobile ? 999 : 'auto'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e27 0%, #131829 100%)' }}>
      <nav style={navStyle}>
        <Link to="/middleman/orders" style={logoStyle} onClick={() => setMobileMenuOpen(false)}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            color: '#0a0e27',
            fontSize: '18px'
          }}>
            M
          </div>
          <span style={{ ...logoTextStyle, display: isMobile ? 'none' : 'inline' }}>McFleet Middleman</span>
        </Link>
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={hamburgerButtonStyle}
            aria-label="Toggle menu"
          >
            <div
              style={{
                ...hamburgerLineStyle,
                transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }}
            />
            <div
              style={{
                ...hamburgerLineStyle,
                opacity: mobileMenuOpen ? 0 : 1
              }}
            />
            <div
              style={{
                ...hamburgerLineStyle,
                transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }}
            />
          </button>
        )}

        <div style={navActionsStyle}>
          <div
            style={{
              ...userBadgeStyle,
              width: isMobile ? '100%' : 'auto',
              justifyContent: isMobile ? 'flex-start' : 'center'
            }}
          >
            <span
              style={{
                color: '#ffffff',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              {user?.discordUsername || 'Middleman'}
            </span>
          </div>
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            style={{
              ...logoutButtonStyle,
              width: isMobile ? '100%' : 'auto'
            }}
            onMouseEnter={(e) => !isMobile && (e.target.style.backgroundColor = '#dc2626')}
            onMouseLeave={(e) => !isMobile && (e.target.style.backgroundColor = '#ef4444')}
          >
            Logout
          </button>
        </div>
      </nav>
      <div style={{ padding: isMobile ? '16px' : isTablet ? '24px' : '32px' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default MiddlemanLayout;

