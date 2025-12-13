function Login() {
  const handleDiscordLogin = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mcfleet-marketplace.onrender.com';
    const discordAuthUrl = `${apiBaseUrl}/api/auth/discord`;
    
    // Redirect to Discord OAuth
    window.location.href = discordAuthUrl;
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #131829 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const cardStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '16px',
    padding: '48px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    maxWidth: '420px',
    width: '100%'
  };

  const logoStyle = {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: '#0a0e27',
    fontSize: '32px',
    margin: '0 auto 24px'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '12px',
    background: 'linear-gradient(135deg, #ffffff 0%, #b8bcc8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle = {
    color: '#6b7280',
    fontSize: '16px',
    marginBottom: '40px',
    lineHeight: '1.6'
  };

  const buttonStyle = {
    backgroundColor: '#fbbf24',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>M</div>
        <h1 style={titleStyle}>McFleet Marketplace</h1>
        <p style={subtitleStyle}>Premium Minecraft marketplace. Login with Discord to get started.</p>
        <button 
          onClick={handleDiscordLogin}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f59e0b';
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#fbbf24';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Login with Discord
        </button>
      </div>
    </div>
  );
}

export default Login;

