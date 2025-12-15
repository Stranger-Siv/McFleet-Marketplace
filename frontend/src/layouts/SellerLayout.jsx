import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResponsive } from '../hooks/useResponsive';

function SellerLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
    order: isMobile ? 3 : 0
  };

  const linkStyle = {
    color: '#b8bcc8',
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    fontSize: '14px',
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
        <Link to="/seller/dashboard" style={logoStyle} onClick={() => setMobileMenuOpen(false)}>
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
          <span style={{ ...logoTextStyle, display: isMobile ? 'none' : 'inline' }}>McFleet Seller</span>
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
          <Link 
            to="/seller/dashboard" 
            style={{
              ...(isActive('/seller/dashboard') ? activeLinkStyle : linkStyle),
              width: isMobile ? '100%' : 'auto',
              textAlign: isMobile ? 'left' : 'center',
              padding: isMobile ? '12px 16px' : linkStyle.padding
            }}
            onClick={() => setMobileMenuOpen(false)}
            onMouseEnter={(e) => !isActive('/seller/dashboard') && !isMobile && (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => !isActive('/seller/dashboard') && !isMobile && (e.target.style.color = '#b8bcc8')}
          >
            Dashboard
          </Link>
          <Link 
            to="/seller/create-listing" 
            style={{
              ...(isActive('/seller/create-listing') ? activeLinkStyle : linkStyle),
              width: isMobile ? '100%' : 'auto',
              textAlign: isMobile ? 'left' : 'center',
              padding: isMobile ? '12px 16px' : linkStyle.padding
            }}
            onClick={() => setMobileMenuOpen(false)}
            onMouseEnter={(e) => !isActive('/seller/create-listing') && !isMobile && (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => !isActive('/seller/create-listing') && !isMobile && (e.target.style.color = '#b8bcc8')}
          >
            Create Listing
          </Link>
          <Link 
            to="/seller/listings" 
            style={{
              ...(isActive('/seller/listings') ? activeLinkStyle : linkStyle),
              width: isMobile ? '100%' : 'auto',
              textAlign: isMobile ? 'left' : 'center',
              padding: isMobile ? '12px 16px' : linkStyle.padding
            }}
            onClick={() => setMobileMenuOpen(false)}
            onMouseEnter={(e) => !isActive('/seller/listings') && !isMobile && (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => !isActive('/seller/listings') && !isMobile && (e.target.style.color = '#b8bcc8')}
          >
            My Listings
          </Link>
          <Link 
            to="/seller/faq" 
            style={{
              ...(isActive('/seller/faq') ? activeLinkStyle : linkStyle),
              width: isMobile ? '100%' : 'auto',
              textAlign: isMobile ? 'left' : 'center',
              padding: isMobile ? '12px 16px' : linkStyle.padding
            }}
            onClick={() => setMobileMenuOpen(false)}
            onMouseEnter={(e) => !isActive('/seller/faq') && !isMobile && (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => !isActive('/seller/faq') && !isMobile && (e.target.style.color = '#b8bcc8')}
          >
            FAQ
          </Link>
          <Link 
            to="/seller/orders" 
            style={{
              ...(isActive('/seller/orders') ? activeLinkStyle : linkStyle),
              width: isMobile ? '100%' : 'auto',
              textAlign: isMobile ? 'left' : 'center',
              padding: isMobile ? '12px 16px' : linkStyle.padding
            }}
            onClick={() => setMobileMenuOpen(false)}
            onMouseEnter={(e) => !isActive('/seller/orders') && !isMobile && (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => !isActive('/seller/orders') && !isMobile && (e.target.style.color = '#b8bcc8')}
          >
            Orders
          </Link>
          <Link 
            to="/seller/transactions" 
            style={{
              ...(isActive('/seller/transactions') ? activeLinkStyle : linkStyle),
              width: isMobile ? '100%' : 'auto',
              textAlign: isMobile ? 'left' : 'center',
              padding: isMobile ? '12px 16px' : linkStyle.padding
            }}
            onClick={() => setMobileMenuOpen(false)}
            onMouseEnter={(e) => !isActive('/seller/transactions') && !isMobile && (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => !isActive('/seller/transactions') && !isMobile && (e.target.style.color = '#b8bcc8')}
          >
            Transactions
          </Link>
        </div>
        
        <div style={{
          ...userInfoStyle,
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '100%' : 'auto',
          order: isMobile ? 2 : 0
        }}>
          <div style={{
            ...userBadgeStyle,
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'flex-start' : 'center'
          }}>
            <span style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>{user?.discordUsername || 'Seller'}</span>
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

export default SellerLayout;

