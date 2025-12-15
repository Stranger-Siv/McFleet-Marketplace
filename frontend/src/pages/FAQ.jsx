import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive';

function FAQ() {
  const { isMobile, isTablet } = useResponsive();
  const navigate = useNavigate();

  const sections = [
    {
      id: 'how-it-works',
      title: 'How Trading Works on McFleet Shop',
      content: (
        <>
          <ol style={{ paddingLeft: '20px', marginBottom: '12px', color: '#b8bcc8', lineHeight: 1.7, fontSize: '15px' }}>
            <li>Buyer places an order on McFleet Shop and completes payment.</li>
            <li>Payment is held securely by McFleet Shop as middleman escrow.</li>
            <li>A McFleet Shop middleman sends instructions to buyer and seller via the order page and Discord.</li>
            <li>Seller delivers the item in-game.</li>
            <li>Buyer confirms delivery.</li>
            <li>The McFleet Shop middleman verifies completion.</li>
            <li>Payment is released to the seller after McFleet Shop deducts its platform commission.</li>
          </ol>
          <ul style={{ paddingLeft: '20px', color: '#9ca3af', fontSize: '14px', lineHeight: 1.6 }}>
            <li>All official instructions come only from the McFleet Shop middleman.</li>
            <li>Discord is mandatory for trade coordination.</li>
            <li>Every order is logged and monitored for platform safety.</li>
          </ul>
        </>
      )
    },
    {
      id: 'buyer-rules',
      title: 'Buyer Rules',
      content: (
        <ul style={{ paddingLeft: '20px', marginBottom: 0, color: '#b8bcc8', lineHeight: 1.7, fontSize: '15px' }}>
          <li>Buyers must complete payment before any delivery.</li>
          <li>Buyers must strictly follow McFleet Shop middleman instructions.</li>
          <li>Buyers must confirm item receipt honestly.</li>
          <li>False claims may lead to account suspension or ban.</li>
          <li>Off-platform trades or bypassing McFleet Shop are prohibited.</li>
          <li>Discord acceptance is required to complete orders.</li>
        </ul>
      )
    },
    {
      id: 'seller-rules',
      title: 'Seller Rules',
      content: (
        <ul style={{ paddingLeft: '20px', marginBottom: 0, color: '#b8bcc8', lineHeight: 1.7, fontSize: '15px' }}>
          <li>Sellers must deliver items exactly as listed on McFleet Shop.</li>
          <li>Sellers must follow McFleet Shop middleman instructions and timelines.</li>
          <li>Sellers must never request direct payment from buyers.</li>
          <li>Failure to deliver may result in penalties or ban.</li>
          <li>Fake listings or misrepresentation are prohibited.</li>
          <li>Sellers must remain available on Discord during active orders.</li>
        </ul>
      )
    },
    {
      id: 'general-rules',
      title: 'General Platform Rules',
      content: (
        <ul style={{ paddingLeft: '20px', marginBottom: 0, color: '#b8bcc8', lineHeight: 1.7, fontSize: '15px' }}>
          <li>McFleet Shop acts as a neutral middleman platform, not a Minecraft server owner.</li>
          <li>All trades are final once completed successfully.</li>
          <li>Disputes are resolved using platform logs, proof, and rules.</li>
          <li>McFleet Shop may suspend accounts or cancel orders if rules are violated.</li>
          <li>Platform rules may be updated without prior notice.</li>
        </ul>
      )
    }
  ];

  const [openId, setOpenId] = useState(sections[0]?.id || null);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #131829 100%)',
    color: '#ffffff',
    padding: isMobile ? '0 16px 24px' : '0 24px 40px'
  };

  const innerStyle = {
    maxWidth: '960px',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: isMobile ? '26px' : isTablet ? '32px' : '36px',
    fontWeight: '700',
    marginBottom: '6px'
  };

  const subtitleStyle = {
    color: '#b8bcc8',
    fontSize: '14px',
    marginBottom: '20px',
    maxWidth: '640px'
  };

  const accordionItemStyle = {
    borderRadius: '12px',
    border: '1px solid #2d3447',
    backgroundColor: '#1e2338',
    marginBottom: '14px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.35)'
  };

  const accordionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? '14px 16px' : '16px 20px',
    cursor: 'pointer'
  };

  const accordionTitleStyle = {
    fontSize: '15px',
    fontWeight: 600,
    color: '#ffffff'
  };

  const accordionIconStyle = {
    fontSize: '18px',
    color: '#fbbf24',
    marginLeft: '8px'
  };

  const accordionBodyStyle = {
    padding: isMobile ? '12px 16px 16px' : '14px 20px 20px',
    borderTop: '1px solid #2d3447'
  };

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        <h1 style={titleStyle}>McFleet Shop FAQ &amp; Rules</h1>
        <p style={subtitleStyle}>
          Learn how trading works on McFleet Shop and what is expected from buyers and sellers so everyone can trade safely.
        </p>

        {sections.map((section) => {
          const isOpen = openId === section.id;
          return (
            <div key={section.id} style={accordionItemStyle}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : section.id)}
                style={{
                  ...accordionHeaderStyle,
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left'
                }}
              >
                <span style={accordionTitleStyle}>{section.title}</span>
                <span style={accordionIconStyle}>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div style={accordionBodyStyle}>
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FAQ;


