import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MiddlemanLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  const navLinksStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e27 0%, #131829 100%)' }}>
      <nav style={navStyle}>
        <Link to="/middleman/orders" style={logoStyle}>
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
          <span style={logoTextStyle}>McFleet Middleman</span>
        </Link>
        
        <div style={navLinksStyle}>
          <Link 
            to="/middleman/orders" 
            style={isActive('/middleman/orders') ? activeLinkStyle : linkStyle}
            onMouseEnter={(e) => !isActive('/middleman/orders') && (e.target.style.color = '#ffffff')}
            onMouseLeave={(e) => !isActive('/middleman/orders') && (e.target.style.color = '#b8bcc8')}
          >
            Assigned Orders
          </Link>
        </div>
        
        <div style={userInfoStyle}>
          <div style={userBadgeStyle}>
            <span style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>{user?.discordUsername || 'Middleman'}</span>
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

export default MiddlemanLayout;

