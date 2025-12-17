import { useResponsive } from '../hooks/useResponsive';

function Landing() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const handleDiscordLogin = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mcfleet-marketplace-susu.onrender.com';
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
    padding: isMobile ? '32px 20px' : isTablet ? '40px 32px' : '48px 48px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const heroStyle = {
    ...sectionStyle,
    textAlign: 'center',
    paddingTop: isMobile ? '60px' : '80px',
    paddingBottom: isMobile ? '40px' : '60px'
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
    marginBottom: isMobile ? '20px' : '24px'
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
    padding: isMobile ? '20px' : '24px',
    marginBottom: '12px'
  };

  const footerStyle = {
    backgroundColor: '#0a0e27',
    borderTop: '1px solid #2d3447',
    padding: isMobile ? '32px 20px' : '48px',
    marginTop: '48px'
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
      <section id="hero" style={heroStyle}>
        <div style={logoStyle}>M</div>
        <h1 style={heroTitleStyle}>McFleet Shop</h1>
        <p style={heroSubtitleStyle}>
          A trusted middleman marketplace for Minecraft IRL trades. Every transaction is protected by verified middlemen and manual admin oversight.
        </p>
        <div style={{
          marginTop: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <p style={{
            color: '#b8bcc8',
            fontSize: isMobile ? '14px' : '16px',
            marginBottom: '8px'
          }}>
            Scroll down to learn more and login
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: 'scrollBounce 2s ease-in-out infinite',
                cursor: 'pointer'
              }}
              onClick={() => {
                const loginSection = document.querySelector('[data-section="login"]');
                if (loginSection) {
                  loginSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                }
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
        <style>{`
          @keyframes scrollBounce {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.8;
            }
            50% {
              transform: translateY(8px);
              opacity: 1;
            }
          }
        `}</style>
      </section>

      {/* What is McFleet Shop */}
      <section id="what-is-mcfleet" style={sectionStyle}>
        <h2 style={sectionTitleStyle}>What is McFleet Shop?</h2>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          marginTop: '24px'
        }}>
          <div style={trustCardStyle}>
            <p style={{ ...featureDescStyle, fontSize: '16px', lineHeight: '1.8', color: '#dcddde' }}>
              McFleet Shop is a <strong style={{ color: '#fbbf24' }}>middleman-controlled marketplace</strong> for trading Minecraft items safely.
              We act as a neutral platform that connects buyers and sellers, but we <strong style={{ color: '#fbbf24' }}>do not own or operate any Minecraft servers</strong>.
            </p>
            <p style={{ ...featureDescStyle, fontSize: '16px', lineHeight: '1.8', color: '#dcddde', marginTop: '16px' }}>
              Every trade is supervised by a verified middleman who ensures payment is secure and items are delivered correctly.
              Our admin team manually reviews all listings, approves sellers, and resolves disputes to maintain platform safety.
            </p>
          </div>
        </div>
      </section>

      {/* How Trades Are Protected */}
      <section id="how-protected" style={{ ...sectionStyle, backgroundColor: '#131829' }}>
        <h2 style={sectionTitleStyle}>How Your Trades Are Protected</h2>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          marginTop: '24px'
        }}>
          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px', color: '#fbbf24' }}>
              🛡️ Middleman-Controlled Escrow
            </h3>
            <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
              When you place an order, your payment is held securely by the platform until the middleman verifies that the item has been delivered.
              Sellers only receive payment after the buyer confirms receipt. This escrow system prevents scams and ensures both parties are protected.
            </p>
          </div>

          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px', color: '#fbbf24' }}>
              👮 Manual Admin Moderation
            </h3>
            <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
              Every seller must be approved by our admin team before they can list items. All listings are reviewed for accuracy.
              Disputes are handled manually by admins who review evidence and make fair decisions. This human oversight ensures quality and safety.
            </p>
          </div>

          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px', color: '#fbbf24' }}>
              📝 Complete Trade Logging
            </h3>
            <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
              Every order, payment, and delivery is logged on the platform. If something goes wrong, admins can review the complete history
              to resolve disputes fairly. Nothing happens in secret—everything is transparent and traceable.
            </p>
          </div>

          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px', color: '#fbbf24' }}>
              🔒 No Direct Contact Required
            </h3>
            <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
              Buyers and sellers never need to share personal information or payment details with each other.
              All communication happens through the middleman, keeping your private information safe.
            </p>
          </div>
        </div>
      </section>

      {/* Why Discord is Required */}
      <section id="why-discord" style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Why We Use Discord Login</h2>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          marginTop: '24px'
        }}>
          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '16px', color: '#ffffff' }}>
              Simple Explanation
            </h3>
            <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.8', marginBottom: '20px' }}>
              We use Discord login because it's the easiest way to verify who you are and coordinate trades.
              When you trade on McFleet Shop, the middleman needs to contact you on Discord to give you instructions and verify delivery.
              Using Discord login means you're already set up for this communication.
            </p>
            <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.8', marginBottom: '20px' }}>
              <strong style={{ color: '#fbbf24' }}>We only access basic information:</strong> your Discord username and user ID.
              This is the minimum needed to identify you and coordinate trades.
            </p>
          </div>

          <div style={{
            ...trustCardStyle,
            backgroundColor: '#1a1f35',
            border: '2px solid #f59e0b'
          }}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '16px', color: '#fbbf24' }}>
              What We Do NOT Access
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: '24px',
              color: '#dcddde',
              lineHeight: '2',
              fontSize: '15px'
            }}>
              <li>❌ Your Discord password (we never see it)</li>
              <li>❌ Your email address</li>
              <li>❌ Your Discord messages or DMs</li>
              <li>❌ Your Discord servers or channels</li>
              <li>❌ Your friends list</li>
              <li>❌ Any payment or financial information</li>
              <li>❌ Your personal files or data</li>
            </ul>
            <p style={{ ...featureDescStyle, fontSize: '14px', lineHeight: '1.7', marginTop: '16px', color: '#b8bcc8' }}>
              We only use Discord to verify your identity and enable the middleman to contact you during trades.
              That's it. You remain in full control of your Discord account.
            </p>
          </div>
        </div>
      </section>

      {/* How Trading Works */}
      <section id="how-it-works" style={{ ...sectionStyle, backgroundColor: '#131829' }}>
        <h2 style={sectionTitleStyle}>How Trading Works</h2>
        <p style={sectionSubtitleStyle}>
          A simple, secure process that protects both buyers and sellers.
        </p>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          marginTop: '24px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              ...trustCardStyle,
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                minWidth: '40px',
                backgroundColor: '#fbbf24',
                color: '#0a0e27',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px'
              }}>1</div>
              <div>
                <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '8px' }}>Buyer Places Order</h3>
                <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
                  You browse listings and place an order. Payment is held securely by the platform—not sent to the seller yet.
                </p>
              </div>
            </div>

            <div style={{
              ...trustCardStyle,
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                minWidth: '40px',
                backgroundColor: '#fbbf24',
                color: '#0a0e27',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px'
              }}>2</div>
              <div>
                <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '8px' }}>Middleman Coordinates</h3>
                <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
                  A verified middleman contacts both buyer and seller on Discord with clear instructions.
                  They verify identities and coordinate the trade.
                </p>
              </div>
            </div>

            <div style={{
              ...trustCardStyle,
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                minWidth: '40px',
                backgroundColor: '#fbbf24',
                color: '#0a0e27',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px'
              }}>3</div>
              <div>
                <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '8px' }}>Seller Delivers Item</h3>
                <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
                  The seller delivers the item in-game following the middleman's instructions.
                  The middleman verifies the delivery.
                </p>
              </div>
            </div>

            <div style={{
              ...trustCardStyle,
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                minWidth: '40px',
                backgroundColor: '#fbbf24',
                color: '#0a0e27',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px'
              }}>4</div>
              <div>
                <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '8px' }}>Buyer Confirms Receipt</h3>
                <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
                  You confirm that you received the item correctly. This confirmation is required before payment is released.
                </p>
              </div>
            </div>

            <div style={{
              ...trustCardStyle,
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                minWidth: '40px',
                backgroundColor: '#fbbf24',
                color: '#0a0e27',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px'
              }}>5</div>
              <div>
                <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '8px' }}>Payment Released</h3>
                <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
                  Once everything is verified, the middleman releases payment to the seller (minus platform commission).
                  The trade is complete and logged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Assurances */}
      <section id="safety" style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Your Safety is Our Priority</h2>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          marginTop: '24px'
        }}>
          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px', color: '#10b981' }}>
              ✅ Verified Middlemen
            </h3>
            <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
              All middlemen are verified by our admin team. They follow strict protocols and are trained to handle trades safely.
            </p>
          </div>

          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px', color: '#10b981' }}>
              ✅ Approved Sellers Only
            </h3>
            <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
              Sellers must apply and be approved by admins before listing items. We review each application to ensure quality and trustworthiness.
            </p>
          </div>

          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px', color: '#10b981' }}>
              ✅ Active Dispute Resolution
            </h3>
            <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
              If something goes wrong, you can raise a dispute. Admins review all disputes manually and make fair decisions based on evidence.
            </p>
          </div>

          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px', color: '#10b981' }}>
              ✅ Zero-Tolerance for Scams
            </h3>
            <p style={{ ...featureDescStyle, fontSize: '15px', lineHeight: '1.7' }}>
              Scammers are permanently banned immediately. We maintain strict rules and actively monitor the platform to prevent fraud.
            </p>
          </div>
        </div>
      </section>

      {/* Discord Login CTA */}
      <section data-section="login" style={{ ...sectionStyle, backgroundColor: '#131829', textAlign: 'center' }}>
        <h2 style={{ ...sectionTitleStyle, marginBottom: '12px' }}>Ready to Trade Safely?</h2>
        <p style={{ ...sectionSubtitleStyle, marginBottom: '20px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Now that you understand how we protect your trades, you can proceed with confidence.
          Click below to login with Discord and start trading.
        </p>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px',
          backgroundColor: '#1e2338',
          borderRadius: '12px',
          border: '1px solid #2d3447',
          marginBottom: '0'
        }}>
          <p style={{ color: '#b8bcc8', fontSize: '14px', lineHeight: '1.7', marginBottom: '16px' }}>
            <strong style={{ color: '#ffffff' }}>Remember:</strong> We only access your Discord username and user ID.
            We never see your password, messages, servers, or any other personal information.
          </p>
          <button
            onClick={handleDiscordLogin}
            style={{
              ...primaryButtonStyle,
              fontSize: isMobile ? '16px' : '18px',
              padding: isMobile ? '16px 32px' : '18px 40px',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f59e0b';
              e.target.style.transform = 'scale(1.02)';
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
        </div>
      </section>


      {/* Roles Section */}
      <section id="platform-roles" style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Platform Roles</h2>
        <p style={sectionSubtitleStyle}>
          Understanding how each role contributes to a safe trading environment.
        </p>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '16px' : '24px',
          marginTop: isMobile ? '20px' : '24px',
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
      <section id="trust-safety" style={{ ...sectionStyle, backgroundColor: '#131829' }}>
        <h2 style={sectionTitleStyle}>Trust & Safety</h2>
        <p style={sectionSubtitleStyle}>
          Your security is our top priority. We enforce strict rules to protect all users.
        </p>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          marginTop: '24px'
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


      {/* Buyer & Seller Rules */}
      <section id="buyer-seller-rules" style={{ ...sectionStyle, backgroundColor: '#131829' }}>
        <h2 style={sectionTitleStyle}>Buyer & Seller Rules</h2>
        <p style={sectionSubtitleStyle}>
          Essential rules to keep every trade safe. Full details are shown in-app after login.
        </p>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          marginTop: '24px'
        }}>
          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px', color: '#fbbf24' }}>
              🛡️ Buyer Rules
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: '24px',
              color: '#dcddde',
              lineHeight: '1.8',
              fontSize: '15px'
            }}>
              <li style={{ marginBottom: '8px' }}>Only pay after middleman instructions; never outside the flow.</li>
              <li style={{ marginBottom: '8px' }}>Follow middleman verification steps (ID/IGN/Discord) exactly.</li>
              <li style={{ marginBottom: '8px' }}>Do not share personal/payment info outside the secured chat.</li>
              <li style={{ marginBottom: '8px' }}>Report suspicious behavior immediately; open disputes when needed.</li>
              <li>Responses must be through the provided acknowledge buttons.</li>
            </ul>
          </div>

          <div style={trustCardStyle}>
            <h3 style={{ ...featureTitleStyle, textAlign: 'left', marginBottom: '12px', color: '#fbbf24' }}>
              ✅ Seller Rules
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: '24px',
              color: '#dcddde',
              lineHeight: '1.8',
              fontSize: '15px'
            }}>
              <li style={{ marginBottom: '8px' }}>Provide accurate listings (price, stock, description, survival).</li>
              <li style={{ marginBottom: '8px' }}>Wait for middleman instructions before handing over any item.</li>
              <li style={{ marginBottom: '8px' }}>Keep all trade communication within the platform/assigned middleman.</li>
              <li style={{ marginBottom: '8px' }}>No off-platform payments or side deals; follow payout steps only.</li>
              <li>Respect disputes and admin reviews; respond promptly to requests.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={footerContentStyle}>
          <div style={{ textAlign: isMobile ? 'center' : 'left', flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
              justifyContent: isMobile ? 'center' : 'flex-start'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                color: '#0a0e27',
                fontSize: '20px',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
              }}>
                M
              </div>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>McFleet Shop</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px', margin: isMobile ? '0 auto' : '0' }}>
              McFleet Shop — a trusted middleman marketplace for Minecraft IRL trades.
            </p>
            <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '12px', maxWidth: '300px', marginLeft: isMobile ? 'auto' : '0', marginRight: isMobile ? 'auto' : '0' }}>
              McFleet Shop is a trading platform and is not affiliated with Mojang or Microsoft.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '24px' : '48px',
            alignItems: isMobile ? 'center' : 'flex-start',
            flex: 1,
            justifyContent: isMobile ? 'center' : 'flex-end'
          }}>
            <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
              <h4 style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Learn More</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('what-is-mcfleet');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
                >
                  What is McFleet Shop?
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('how-protected');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
                >
                  How Trades Are Protected
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('how-it-works');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
                >
                  How Trading Works
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('why-discord');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
                >
                  Why Discord Login?
                </a>
              </div>
            </div>

            <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
              <h4 style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Safety & Rules</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('safety');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
                >
                  Safety Assurances
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('trust-safety');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
                >
                  Trust & Safety
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('buyer-seller-rules');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
                >
                  Buyer & Seller Rules
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const loginSection = document.querySelector('[data-section="login"]');
                    if (loginSection) {
                      loginSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  style={footerLinkStyle}
                  onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.target.style.color = '#b8bcc8'}
                >
                  Login with Discord
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
          <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.6' }}>
            © 2025 McFleet Shop. All rights reserved.
          </p>
          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px' }}>
            Trade safely, trade smart. Every transaction is protected.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
