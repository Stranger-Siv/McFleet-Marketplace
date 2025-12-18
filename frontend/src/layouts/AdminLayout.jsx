import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResponsive } from '../hooks/useResponsive';

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
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
    zIndex: 1000,
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    gap: isMobile ? '12px' : '0'
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

  const navLinksStyle = {
    display: isMobile ? (mobileMenuOpen ? 'flex' : 'none') : 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '8px' : '8px',
    alignItems: isMobile ? 'stretch' : 'center',
    flexWrap: isMobile ? 'nowrap' : 'wrap',
    position: isMobile ? 'absolute' : 'relative',
    top: isMobile ? '100%' : 'auto',
    left: isMobile ? 0 : 'auto',
    right: isMobile ? 0 : 'auto',
    backgroundColor: isMobile ? '#131829' : 'transparent',
    padding: isMobile ? '16px' : '0',
    boxShadow: isMobile ? '0 4px 16px rgba(0, 0, 0, 0.4)' : 'none',
    borderBottom: isMobile ? '1px solid #2d3447' : 'none',
    width: isMobile ? '100%' : 'auto',
    zIndex: isMobile ? 999 : 'auto',
    maxHeight: isMobile ? '70vh' : 'none',
    overflowY: isMobile ? 'auto' : 'visible',
    order: isMobile ? 3 : 0
  };

  const linkStyle = {
    color: '#b8bcc8',
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    fontSize: '13px',
    fontWeight: '500'
  };

  const activeLinkStyle = {
    ...linkStyle,
    color: '#ffffff',
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447'
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

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e27 0%, #131829 100%)' }}>
      <nav style={navStyle}>
        <Link to="/admin/dashboard" style={logoStyle} onClick={() => setMobileMenuOpen(false)}>
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
          <span style={{ ...logoTextStyle, display: isMobile ? 'none' : 'inline' }}>McFleet Admin</span>
        </Link>

        {/* Hamburger Menu Button (Mobile Only) */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={hamburgerButtonStyle}
            aria-label="Toggle menu"
          >
            <div style={{
              ...hamburgerLineStyle,
              transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }} />
            <div style={{
              ...hamburgerLineStyle,
              opacity: mobileMenuOpen ? 0 : 1
            }} />
            <div style={{
              ...hamburgerLineStyle,
              transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
            }} />
          </button>
        )}
        
        <div style={navLinksStyle}>
          {[
            { path: '/admin/dashboard', label: 'Dashboard' },
            { path: '/admin/seller-requests', label: 'Seller Requests' },
            { path: '/admin/users', label: 'Users' },
            { path: '/admin/listings', label: 'Listings' },
            { path: '/admin/orders', label: 'Orders' },
            { path: '/admin/transactions', label: 'Transactions' },
            { path: '/admin/disputes', label: 'Disputes' },
            { path: '/admin/audit-logs', label: 'Audit Logs' },
            { path: '/admin/settings', label: 'Settings' }
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              style={{
                ...(isActive(path) ? activeLinkStyle : linkStyle),
                width: isMobile ? '100%' : 'auto',
                textAlign: isMobile ? 'left' : 'center',
                padding: isMobile ? '12px 16px' : linkStyle.padding,
                fontSize: isMobile ? '14px' : linkStyle.fontSize
              }}
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={(e) => !isActive(path) && !isMobile && (e.target.style.color = '#ffffff')}
              onMouseLeave={(e) => !isActive(path) && !isMobile && (e.target.style.color = '#b8bcc8')}
            >
              {label}
            </Link>
          ))}

          {isMobile && (
            <>
              <div
                style={{
                  ...userBadgeStyle,
                  width: '100%',
                  justifyContent: 'flex-start',
                  marginTop: '8px'
                }}
              >
                <span
                  style={{
                    color: '#ffffff',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                >
                  {user?.discordUsername || 'Admin'}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                style={{
                  ...logoutButtonStyle,
                  width: '100%',
                  marginTop: '8px'
                }}
                onMouseEnter={(e) => !isMobile && (e.target.style.backgroundColor = '#dc2626')}
                onMouseLeave={(e) => !isMobile && (e.target.style.backgroundColor = '#ef4444')}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {!isMobile && (
          <div
            style={{
              ...userInfoStyle
            }}
          >
            <div
              style={{
                ...userBadgeStyle
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                {user?.discordUsername || 'Admin'}
              </span>
            </div>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              style={{
                ...logoutButtonStyle
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#dc2626')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#ef4444')}
            >
              Logout
            </button>
          </div>
        )}
      </nav>
      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998
          }}
        />
      )}
      <div style={{ padding: isMobile ? '16px' : isTablet ? '24px' : '32px' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;

