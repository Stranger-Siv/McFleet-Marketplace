import { useResponsive } from '../hooks/useResponsive';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const handleDiscordLogin = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    const discordAuthUrl = `${apiBaseUrl}/api/auth/discord`;
    window.location.href = discordAuthUrl;
  };

  const handleHowItWorks = () => {
    // Scroll to how it works section
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #131829 100%)',
    color: '#ffffff'
  };

  const sectionStyle = {
    padding: isMobile ? '48px 20px' : isTablet ? '64px 32px' : '80px 48px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const heroStyle = {
    ...sectionStyle,
    textAlign: 'center',
    paddingTop: isMobile ? '80px' : '120px',
    paddingBottom: isMobile ? '60px' : '100px'
  };

  const logoStyle = {
    width: isMobile ? '64px' : '80px',
    height: isMobile ? '64px' : '80px',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: '#0a0e27',
    fontSize: isMobile ? '32px' : '40px',
    margin: '0 auto 24px',
    boxShadow: '0 8px 32px rgba(251, 191, 36, 0.3)'
  };

  const heroTitleStyle = {
    fontSize: isMobile ? '32px' : isTablet ? '48px' : '64px',
    fontWeight: '700',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #ffffff 0%, #fbbf24 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: '1.2'
  };

  const heroSubtitleStyle = {
    fontSize: isMobile ? '16px' : '20px',
    color: '#b8bcc8',
    marginBottom: '40px',
    lineHeight: '1.6',
    maxWidth: '700px',
    margin: '0 auto 40px'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  };

  const primaryButtonStyle = {
    backgroundColor: '#fbbf24',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '12px',
    padding: isMobile ? '14px 28px' : '16px 32px',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 16px rgba(251, 191, 36, 0.3)'
  };

  const secondaryButtonStyle = {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '2px solid #2d3447',
    borderRadius: '12px',
    padding: isMobile ? '14px 28px' : '16px 32px',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const sectionTitleStyle = {
    fontSize: isMobile ? '28px' : isTablet ? '36px' : '42px',
    fontWeight: '700',
    marginBottom: '12px',
    textAlign: 'center',
    color: '#ffffff'
  };

  const sectionSubtitleStyle = {
    fontSize: isMobile ? '14px' : '16px',
    color: '#b8bcc8',
    textAlign: 'center',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: isMobile ? '32px' : '48px'
  };

  const cardGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
    gap: isMobile ? '20px' : '24px',
    marginTop: isMobile ? '32px' : '48px'
  };

  const featureCardStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '16px',
    padding: isMobile ? '24px' : '32px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const featureIconStyle = {
    width: isMobile ? '48px' : '64px',
    height: isMobile ? '48px' : '64px',
    margin: '0 auto 16px',
    fontSize: isMobile ? '32px' : '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const featureTitleStyle = {
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px'
  };

  const featureDescStyle = {
    fontSize: isMobile ? '13px' : '14px',
    color: '#b8bcc8',
    lineHeight: '1.6'
  };

  const stepCardStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '16px',
    padding: isMobile ? '24px' : '32px',
    textAlign: 'center',
    position: 'relative'
  };

  const stepNumberStyle = {
    width: isMobile ? '40px' : '48px',
    height: isMobile ? '40px' : '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    color: '#0a0e27',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: isMobile ? '18px' : '20px',
    margin: '0 auto 16px',
    boxShadow: '0 4px 16px rgba(251, 191, 36, 0.3)'
  };

  const roleCardStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '16px',
    padding: isMobile ? '20px' : '24px',
    flex: '1 1 200px',
    minWidth: '200px'
  };

  const roleTitleStyle = {
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: '600',
    color: '#fbbf24',
    marginBottom: '8px'
  };

  const roleDescStyle = {
    fontSize: isMobile ? '13px' : '14px',
    color: '#b8bcc8',
    lineHeight: '1.6'
  };

  const trustCardStyle = {
    backgroundColor: '#1a1f35',
    border: '1px solid #2d3447',
    borderRadius: '16px',
    padding: isMobile ? '24px' : '32px',
    marginBottom: '16px'
  };

  const footerStyle = {
    backgroundColor: '#0a0e27',
    borderTop: '1px solid #2d3447',
    padding: isMobile ? '32px 20px' : '48px',
    marginTop: '80px'
  };

  const footerContentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'center' : 'flex-start',
    gap: isMobile ? '24px' : '32px'
  };

  const footerLinkStyle = {
    color: '#b8bcc8',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    padding: '8px 0'
  };

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={logoStyle}>M</div>
        <h1 style={heroTitleStyle}>Safe Minecraft Item Trading</h1>
        <p style={heroSubtitleStyle}>
          Trade Minecraft items with complete protection. Our middleman system ensures secure transactions,
          no scams, and trusted trades every time.
        </p>
        <div style={buttonGroupStyle}>
          <button
            onClick={handleDiscordLogin}
            style={primaryButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f59e0b';
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 20px rgba(251, 191, 36, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#fbbf24';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 16px rgba(251, 191, 36, 0.3)';
            }}
          >
            Login with Discord
          </button>
          <button
            onClick={handleHowItWorks}
            style={secondaryButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#fbbf24';
              e.target.style.color = '#fbbf24';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#2d3447';
              e.target.style.color = '#ffffff';
            }}
          >
            How It Works
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Why Choose mcfleet.shop?</h2>
        <p style={sectionSubtitleStyle}>
          Built for safety, designed for trust. Every trade is protected by our comprehensive security system.
        </p>
        <div style={cardGridStyle}>
          <div
            style={featureCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.borderColor = '#fbbf24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = '#2d3447';
            }}
          >
            <div style={featureIconStyle}>🛡️</div>
            <h3 style={featureTitleStyle}>Middleman Protection</h3>
            <p style={featureDescStyle}>
              Every trade goes through a verified middleman who ensures safe delivery and payment.
            </p>
          </div>

          <div
            style={featureCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.borderColor = '#fbbf24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = '#2d3447';
            }}
          >
            <div style={featureIconStyle}>🔒</div>
            <h3 style={featureTitleStyle}>No Direct Contact</h3>
            <p style={featureDescStyle}>
              Buyers and sellers never share personal details. All communication happens through the middleman.
            </p>
          </div>

          <div
            style={featureCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.borderColor = '#fbbf24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = '#2d3447';
            }}
          >
            <div style={featureIconStyle}>⚖️</div>
            <h3 style={featureTitleStyle}>Dispute Resolution</h3>
            <p style={featureDescStyle}>
              Fair dispute system with admin oversight. Problems are resolved quickly and fairly.
            </p>
          </div>

          <div
            style={featureCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.borderColor = '#fbbf24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = '#2d3447';
            }}
          >
            <div style={featureIconStyle}>⭐</div>
            <h3 style={featureTitleStyle}>Trusted Sellers</h3>
            <p style={featureDescStyle}>
              All sellers are verified. Only approved sellers can list items for sale.
            </p>
          </div>

          <div
            style={featureCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.borderColor = '#fbbf24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = '#2d3447';
            }}
          >
            <div style={featureIconStyle}>⚡</div>
            <h3 style={featureTitleStyle}>Fast Delivery</h3>
            <p style={featureDescStyle}>
              Streamlined process ensures quick item delivery once payment is confirmed.
            </p>
          </div>

          <div
            style={featureCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5)';
              e.currentTarget.style.borderColor = '#fbbf24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.borderColor = '#2d3447';
            }}
          >
            <div style={featureIconStyle}>👮</div>
            <h3 style={featureTitleStyle}>Admin Moderation</h3>
            <p style={featureDescStyle}>
              Active admin team monitors all trades and listings to ensure platform safety.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ ...sectionStyle, backgroundColor: '#131829' }}>
        <h2 style={sectionTitleStyle}>How It Works</h2>
        <p style={sectionSubtitleStyle}>
          Simple, secure, and safe. Follow these steps to trade with confidence.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '24px' : '32px',
          marginTop: isMobile ? '32px' : '48px'
        }}>
          <div style={stepCardStyle}>
            <div style={stepNumberStyle}>1</div>
            <h3 style={featureTitleStyle}>Login with Discord</h3>
            <p style={featureDescStyle}>
              Quick and secure authentication using your Discord account. No passwords to remember.
            </p>
          </div>

          <div style={stepCardStyle}>
            <div style={stepNumberStyle}>2</div>
            <h3 style={featureTitleStyle}>Choose Item</h3>
            <p style={featureDescStyle}>
              Browse the marketplace and select the item you want to buy. View seller details and pricing.
            </p>
          </div>

          <div style={stepCardStyle}>
            <div style={stepNumberStyle}>3</div>
            <h3 style={featureTitleStyle}>Middleman Handles Trade</h3>
            <p style={featureDescStyle}>
              A verified middleman coordinates the entire transaction, ensuring both parties are protected.
            </p>
          </div>

          <div style={stepCardStyle}>
            <div style={stepNumberStyle}>4</div>
            <h3 style={featureTitleStyle}>Item Delivered Safely</h3>
            <p style={featureDescStyle}>
              Once payment is confirmed and item is verified, it's delivered to you securely.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Platform Roles</h2>
        <p style={sectionSubtitleStyle}>
          Understanding how each role contributes to a safe trading environment.
        </p>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '16px' : '24px',
          marginTop: isMobile ? '32px' : '48px',
          flexWrap: 'wrap'
        }}>
          <div style={roleCardStyle}>
            <h3 style={roleTitleStyle}>👤 Buyer</h3>
            <p style={roleDescStyle}>
              Browse listings, place orders, and receive items safely through the middleman system.
            </p>
          </div>

          <div style={roleCardStyle}>
            <h3 style={roleTitleStyle}>🏪 Seller</h3>
            <p style={roleDescStyle}>
              Create listings, manage inventory, and earn safely. All sellers must be approved by admins.
            </p>
          </div>

          <div style={roleCardStyle}>
            <h3 style={roleTitleStyle}>🤝 Middleman</h3>
            <p style={roleDescStyle}>
              Verified coordinators who handle trades, verify payments, and ensure safe item delivery.
            </p>
          </div>

          <div style={roleCardStyle}>
            <h3 style={roleTitleStyle}>👮 Admin</h3>
            <p style={roleDescStyle}>
              Platform moderators who approve sellers, resolve disputes, and maintain platform safety.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section style={{ ...sectionStyle, backgroundColor: '#131829' }}>
        <h2 style={sectionTitleStyle}>Trust & Safety</h2>
        <p style={sectionSubtitleStyle}>
          Your security is our top priority. We enforce strict rules to protect all users.
        </p>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          marginTop: isMobile ? '32px' : '48px'
        }}>
          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px' }}>🚫 No Off-Platform Trades</h3>
            <p style={featureDescStyle}>
              All trades must happen through our platform. Trading outside the system is strictly prohibited and will result in a ban.
            </p>
          </div>

          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px' }}>📋 Strict Rules</h3>
            <p style={featureDescStyle}>
              Clear rules for buyers and sellers. Violations are taken seriously with warnings, temporary bans, or permanent bans depending on severity.
            </p>
          </div>

          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px' }}>⚖️ Dispute Handling</h3>
            <p style={featureDescStyle}>
              Fair dispute resolution system. Admins review all disputes and make decisions based on evidence and platform rules.
            </p>
          </div>

          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px' }}>🔨 Ban Policy</h3>
            <p style={featureDescStyle}>
              Severe violations result in instant permanent bans. Repeated violations also lead to permanent bans. We maintain a zero-tolerance policy for scams and harassment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ ...sectionStyle, textAlign: 'center', paddingTop: '60px', paddingBottom: '60px' }}>
        <h2 style={{ ...sectionTitleStyle, marginBottom: '16px' }}>Ready to Start Trading?</h2>
        <p style={{ ...sectionSubtitleStyle, marginBottom: '32px' }}>
          Join thousands of players trading safely on McFleet Marketplace.
        </p>
        <button
          onClick={handleDiscordLogin}
          style={{
            ...primaryButtonStyle,
            fontSize: isMobile ? '16px' : '18px',
            padding: isMobile ? '16px 32px' : '18px 40px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f59e0b';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(251, 191, 36, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#fbbf24';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 16px rgba(251, 191, 36, 0.3)';
          }}
        >
          Get Started with Discord
        </button>
      </section>

      {/* Buyer & Seller Rules */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Buyer & Seller Rules</h2>
        <p style={sectionSubtitleStyle}>
          Quick reminders to keep every trade safe. Full details are shown in-app after login.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '16px'
        }}>
          <div style={{
            backgroundColor: '#1e2338',
            border: '1px solid #2d3447',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>🛡️</span>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '18px' }}>Buyer Rules</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', color: '#b8bcc8', lineHeight: 1.7, fontSize: '14px' }}>
              <li>Only pay after middleman instructions; never outside the flow.</li>
              <li>Follow middleman verification steps (ID/IGN/Discord) exactly.</li>
              <li>Do not share personal/payment info outside the secured chat.</li>
              <li>Report suspicious behavior immediately; open disputes when needed.</li>
              <li>Responses must be through the provided acknowledge buttons.</li>
            </ul>
          </div>
          <div style={{
            backgroundColor: '#1e2338',
            border: '1px solid #2d3447',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>✅</span>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '18px' }}>Seller Rules</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', color: '#b8bcc8', lineHeight: 1.7, fontSize: '14px' }}>
              <li>Provide accurate listings (price, stock, description, survival).</li>
              <li>Wait for middleman instructions before handing over any item.</li>
              <li>Keep all trade communication within the platform/assigned middleman.</li>
              <li>No off-platform payments or side deals; follow payout steps only.</li>
              <li>Respect disputes and admin reviews; respond promptly to requests.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={footerContentStyle}>
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
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
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>McFleet Shop</span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '8px' }}>
              Safe Minecraft item trading platform
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '32px',
            alignItems: isMobile ? 'center' : 'flex-start'
          }}>
            <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
              <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a
                  href="/login"
                  style={footerLinkStyle}
                  onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
                >
                  Login
                </a>
              </div>
            </div>

            <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
              <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Rules & Safety</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Buyer Rules page - Available after login');
                  }}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
                >
                  Buyer Rules
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Seller Rules page - Available after login');
                  }}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
                >
                  Seller Rules
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '32px auto 0',
          paddingTop: '24px',
          borderTop: '1px solid #2d3447',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280', fontSize: '12px' }}>
            © 2025 McFleet Shop. All rights reserved. | Trade safely, trade smart.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
