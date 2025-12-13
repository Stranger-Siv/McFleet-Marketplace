import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/api/auth/transactions/summary');

        if (response.data.success && response.data.summary) {
          setSummary(response.data.summary);
        } else {
          setError('Failed to load summary data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    color: '#b9bbbe',
    fontSize: '16px',
    marginBottom: '24px'
  };

  const cardStyle = {
    border: '1px solid #40444b',
    borderRadius: '8px',
    padding: '24px',
    backgroundColor: '#2f3136',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.2s ease'
  };

  const cardTitleStyle = {
    fontSize: '14px',
    color: '#b9bbbe',
    marginBottom: '12px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const cardValueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px'
  };

  const cardSubtextStyle = {
    fontSize: '12px',
    color: '#72767d',
    marginTop: '4px'
  };

  const loadingStyle = {
    color: '#b9bbbe',
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px'
  };

  const errorStyle = {
    backgroundColor: '#ed4245',
    color: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px'
  };

  if (loading) {
    return <div style={loadingStyle}>Loading platform summary...</div>;
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Admin Dashboard</h1>
        <div style={errorStyle}>Error: {error}</div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Admin Dashboard</h1>
      <p style={subtitleStyle}>
        Platform health and financial overview
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {/* Total Revenue Card */}
        <div 
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#40444b';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2f3136';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
          }}
        >
          <div style={cardTitleStyle}>Total Revenue</div>
          <div style={{ ...cardValueStyle, color: '#3ba55d' }}>
            {formatCurrency(summary?.totalRevenue)}
          </div>
          <div style={cardSubtextStyle}>
            From all completed transactions
          </div>
        </div>

        {/* Total Commission Card */}
        <div 
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#40444b';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2f3136';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
          }}
        >
          <div style={cardTitleStyle}>Total Commission</div>
          <div style={{ ...cardValueStyle, color: '#5865f2' }}>
            {formatCurrency(summary?.totalCommission)}
          </div>
          <div style={cardSubtextStyle}>
            Platform earnings
          </div>
        </div>

        {/* Pending Seller Payout Card */}
        <div 
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#40444b';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2f3136';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
          }}
        >
          <div style={cardTitleStyle}>Pending Seller Payout</div>
          <div style={{ ...cardValueStyle, color: '#faa61a' }}>
            {formatCurrency(summary?.pendingSellerPayout)}
          </div>
          <div style={cardSubtextStyle}>
            Awaiting payment to sellers
          </div>
        </div>

        {/* Total Transactions Card */}
        <div 
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#40444b';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2f3136';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
          }}
        >
          <div style={cardTitleStyle}>Total Transactions</div>
          <div style={{ ...cardValueStyle, color: '#8b5cf6' }}>
            {summary?.totalTransactions || 0}
          </div>
          <div style={cardSubtextStyle}>
            Completed orders
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

