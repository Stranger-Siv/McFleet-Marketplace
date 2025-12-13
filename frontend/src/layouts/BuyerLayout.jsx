import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BuyerLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Update URL params when search query changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (location.pathname === '/marketplace') {
        if (searchQuery.trim()) {
          setSearchParams({ search: searchQuery.trim() });
        } else {
          // Remove search param if empty
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('search');
          setSearchParams(newParams, { replace: true });
        }
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timer);
  }, [searchQuery, location.pathname]);

  // Sync search input with URL params when on marketplace
  useEffect(() => {
    if (location.pathname === '/marketplace') {
      const urlSearch = searchParams.get('search') || '';
      setSearchQuery(urlSearch);
    } else {
      setSearchQuery('');
    }
  }, [location.pathname, searchParams]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/marketplace') {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (location.pathname === '/marketplace') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      setSearchParams(newParams, { replace: true });
    }
  };

  const navStyle = {
    backgroundColor: '#131829',
    backdropFilter: 'blur(10px)',
    padding: '16px 32px',
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

  const searchContainerStyle = {
    flex: 1,
    maxWidth: '600px',
    margin: '0 32px',
    position: 'relative'
  };

  const searchInputStyle = {
    width: '100%',
    padding: '10px 16px 10px 40px',
    backgroundColor: '#1a1f35',
    border: '1px solid #2d3447',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  };

  const navActionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const navLinkStyle = {
    color: '#b8bcc8',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500'
  };

  const activeNavLinkStyle = {
    ...navLinkStyle,
    color: '#ffffff',
    backgroundColor: '#1e2338'
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

  const usernameStyle = {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500'
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e27 0%, #131829 100%)' }}>
      <nav style={navStyle}>
        {/* Logo */}
        <Link to="/marketplace" style={logoStyle}>
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
          <span style={logoTextStyle}>McFleet</span>
        </Link>

        {/* Search Bar */}
        <form style={searchContainerStyle} onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={searchInputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#fbbf24';
              e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#2d3447';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{
              color: searchQuery ? '#fbbf24' : '#6b7280',
              fontSize: '16px',
              transition: 'color 0.2s ease'
            }}>🔍</span>
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#252b42';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
              title="Clear search"
            >
              <span style={{
                color: '#6b7280',
                fontSize: '18px',
                lineHeight: '1'
              }}>×</span>
            </button>
          )}
        </form>

        {/* Navigation Actions */}
        <div style={navActionsStyle}>
          <Link
            to="/marketplace"
            style={isActive('/marketplace') ? activeNavLinkStyle : navLinkStyle}
            onMouseEnter={(e) => !isActive('/marketplace') && (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => !isActive('/marketplace') && (e.target.style.color = '#b8bcc8')}
          >
            Marketplace
          </Link>
          <Link
            to="/buyer/orders"
            style={isActive('/buyer/orders') ? activeNavLinkStyle : navLinkStyle}
            onMouseEnter={(e) => !isActive('/buyer/orders') && (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => !isActive('/buyer/orders') && (e.target.style.color = '#b8bcc8')}
          >
            My Orders
          </Link>
          {user?.role === 'user' && (
            <Link
              to="/become-seller"
              style={isActive('/become-seller') ? activeNavLinkStyle : navLinkStyle}
              onMouseEnter={(e) => !isActive('/become-seller') && (e.target.style.color = '#ffffff')}
              onMouseLeave={(e) => !isActive('/become-seller') && (e.target.style.color = '#b8bcc8')}
            >
              Become Seller
            </Link>
          )}
          <div style={userBadgeStyle}>
            <span style={usernameStyle}>{user?.discordUsername || 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            style={logoutButtonStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
          >
            Logout
          </button>
        </div>
      </nav>
      <div style={{ padding: '32px' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default BuyerLayout;

