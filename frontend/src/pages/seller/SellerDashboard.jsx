import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import SkeletonStatCard from '../../components/skeletons/SkeletonStatCard';

function SellerDashboard() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/api/auth/seller/earnings');

        if (response.data.success && response.data.summary) {
          setEarnings(response.data.summary);
        } else {
          setError('Failed to load earnings data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch earnings');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  // Add fade-in animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '24px'
  };

  const cardStyle = {
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: '28px',
    backgroundColor: '#1e2338',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.3s ease'
  };

  const cardTitleStyle = {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const cardValueStyle = {
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: '1.2'
  };

  const errorStyle = {
    backgroundColor: '#ed4245',
    color: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px'
  };

  const contentStyle = {
    animation: loading ? 'none' : 'fadeIn 0.4s ease-in'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Seller Dashboard</h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Seller Dashboard</h1>
        <div style={errorStyle}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Seller Dashboard</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px',
        ...contentStyle
      }}>
        {/* Total Earned Card */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#252b42';
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.borderColor = '#fbbf24';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1e2338';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
            e.currentTarget.style.borderColor = '#2d3447';
          }}
        >
          <div style={cardTitleStyle}>Total Earned</div>
          <div style={{ ...cardValueStyle, color: '#10b981' }}>
            {formatCurrency(earnings?.totalEarned)}
          </div>
        </div>

        {/* Paid Out Card */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#252b42';
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.borderColor = '#fbbf24';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1e2338';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
            e.currentTarget.style.borderColor = '#2d3447';
          }}
        >
          <div style={cardTitleStyle}>Paid Out</div>
          <div style={{ ...cardValueStyle, color: '#fbbf24' }}>
            {formatCurrency(earnings?.paidOut)}
          </div>
        </div>

        {/* Pending Payout Card */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#252b42';
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.borderColor = '#fbbf24';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1e2338';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
            e.currentTarget.style.borderColor = '#2d3447';
          }}
        >
          <div style={cardTitleStyle}>Pending Payout</div>
          <div style={{ ...cardValueStyle, color: '#f59e0b' }}>
            {formatCurrency(earnings?.pendingPayout)}
          </div>
        </div>

        {/* Total Orders Card */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#252b42';
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.borderColor = '#fbbf24';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1e2338';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
            e.currentTarget.style.borderColor = '#2d3447';
          }}
        >
          <div style={cardTitleStyle}>Total Orders</div>
          <div style={{ ...cardValueStyle, color: '#8b5cf6' }}>
            {earnings?.totalOrders || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;

