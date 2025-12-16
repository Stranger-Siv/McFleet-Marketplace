import { useState, useEffect } from 'react';
import apiClient from '../api/axios';

const MICRO_COPIES = [
  'Middleman-secured trades only — no direct deals.',
  'All instructions come directly from McFleet Shop.',
  'Discord is required to coordinate trades smoothly.',
  'Every order is logged and monitored for safety.',
  'Verified sellers complete trades faster.'
];

function ColdStartLoading({ onReady }) {
  const [currentMicroCopy, setCurrentMicroCopy] = useState(0);
  const [isChecking, setIsChecking] = useState(true);

  // Rotate micro-copy every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMicroCopy((prev) => (prev + 1) % MICRO_COPIES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Health check with retry
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 100; // ~5 minutes max (3s * 100)
    let timeoutId;

    const checkHealth = async () => {
      try {
        // Use public listings endpoint as health check
        await apiClient.get('/api/auth/listings?limit=1');
        // Backend is ready
        setIsChecking(false);
        setTimeout(() => {
          onReady();
        }, 500); // Small delay for smooth transition
      } catch (error) {
        // Backend not ready yet, retry
        retryCount++;
        if (retryCount < maxRetries) {
          timeoutId = setTimeout(checkHealth, 3000); // Retry every 3 seconds
        } else {
          // Max retries reached, still show loading but less frequently
          timeoutId = setTimeout(checkHealth, 5000);
        }
      }
    };

    // Initial check
    checkHealth();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onReady]);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #131829 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    color: '#ffffff'
  };

  const cardStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '16px',
    padding: '48px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    maxWidth: '520px',
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
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '16px',
    lineHeight: '1.3'
  };

  const primaryTextStyle = {
    color: '#b8bcc8',
    fontSize: '15px',
    marginBottom: '24px',
    lineHeight: '1.6'
  };

  const trustLineStyle = {
    color: '#9ca3af',
    fontSize: '14px',
    marginBottom: '32px',
    fontWeight: '500'
  };

  const microCopyStyle = {
    color: '#6b7280',
    fontSize: '13px',
    fontStyle: 'italic',
    minHeight: '20px',
    marginBottom: '32px',
    transition: 'opacity 0.3s ease'
  };

  // Animated progress bar
  const progressBarContainerStyle = {
    width: '100%',
    height: '4px',
    backgroundColor: '#2d3447',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '8px',
    position: 'relative'
  };

  const progressBarStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
    borderRadius: '2px',
    animation: 'loadingProgress 2s ease-in-out infinite',
    width: '40%',
    position: 'absolute',
    left: 0,
    top: 0
  };

  // Add keyframes for smooth loading animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes loadingProgress {
        0% {
          transform: translateX(-100%);
        }
        50% {
          transform: translateX(250%);
        }
        100% {
          transform: translateX(600%);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>M</div>
        <h1 style={titleStyle}>Waking up McFleet Shop</h1>
        <p style={primaryTextStyle}>
          Our servers pause when inactive to keep the platform fast and affordable.
          <br />
          This usually takes 20–40 seconds.
        </p>
        <p style={trustLineStyle}>
          Your trade flow and funds remain fully protected.
        </p>
        
        <div style={progressBarContainerStyle}>
          <div style={progressBarStyle}></div>
        </div>

        <p style={microCopyStyle} key={currentMicroCopy}>
          {MICRO_COPIES[currentMicroCopy]}
        </p>
      </div>
    </div>
  );
}

export default ColdStartLoading;

