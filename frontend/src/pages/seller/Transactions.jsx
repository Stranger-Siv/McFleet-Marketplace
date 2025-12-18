import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import { useResponsive } from '../../hooks/useResponsive';
import SkeletonTableRow from '../../components/skeletons/SkeletonTableRow';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isMobile, isTablet } = useResponsive();
  const isSmallScreen = isMobile || isTablet;

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/auth/seller/transactions');

      if (response.data.success) {
        setTransactions(response.data.transactions || []);
      } else {
        setError('Failed to load transactions');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Set up polling (30 seconds interval)
  usePolling(fetchTransactions, 30000);

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusLabel = (status) => {
    return status === 'paid_out' ? 'Paid Out' : 'Pending';
  };

  const getStatusColor = (status) => {
    return status === 'paid_out' ? '#10b981' : '#f59e0b'; // green for paid, orange for pending
  };

  const getItemTitle = (transaction) => {
    // Try to get listing title from populated order
    if (transaction.order && typeof transaction.order === 'object' && transaction.order.listing) {
      const listing = transaction.order.listing;
      return listing.title || listing.itemName || 'Item';
    }
    // Fallback if listing is not populated
    return 'Item';
  };

  const containerStyle = {
    maxWidth: isSmallScreen ? '100%' : '1200px',
    margin: '0 auto',
    padding: isMobile ? '16px' : isTablet ? '20px' : '24px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '700',
    marginBottom: isMobile ? '20px' : '24px'
  };

  const contentStyle = {
    animation: loading ? 'none' : 'fadeIn 0.4s ease-in'
  };

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

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Transactions</h1>
        <div style={{
          backgroundColor: '#1e2338',
          border: '1px solid #2d3447',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTableRow key={i} columns={5} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Transactions</h1>
        <div style={{
          backgroundColor: '#ed4245',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>Error: {error}</div>
      </div>
    );
  }

  const tableContainerStyle = {
    overflowX: 'auto',
    marginTop: isMobile ? '16px' : '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const thStyle = {
    backgroundColor: '#131829',
    padding: isMobile ? '12px' : '16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#b8bcc8',
    borderBottom: '1px solid #2d3447',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const tdStyle = {
    padding: isMobile ? '12px' : '16px',
    borderBottom: '1px solid #2d3447',
    color: '#ffffff',
    fontSize: '14px',
    backgroundColor: '#1e2338'
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#fff',
    backgroundColor: getStatusColor(status)
  });

  const emptyStateStyle = {
    textAlign: 'center',
    padding: isMobile ? '40px 16px' : '60px 20px',
    color: '#b8bcc8',
    backgroundColor: '#1e2338',
    borderRadius: '12px',
    marginTop: '20px',
    border: '1px solid #2d3447'
  };

  const emptyStateTitleStyle = {
    fontSize: isMobile ? '20px' : '24px',
    marginBottom: '12px',
    color: '#ffffff'
  };

  const emptyStateTextStyle = {
    fontSize: isMobile ? '14px' : '16px',
    lineHeight: 1.6
  };

  const cardListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '12px' : '16px',
    marginTop: isMobile ? '16px' : '20px'
  };

  const transactionCardStyle = {
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: isMobile ? '14px' : '18px',
    backgroundColor: '#1e2338',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  };

  const cardRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: isMobile ? '13px' : '14px',
    color: '#b8bcc8'
  };

  const cardLabelStyle = {
    fontWeight: 500,
    marginRight: '8px'
  };

  const cardValueStrongStyle = {
    color: '#ffffff',
    fontWeight: 600
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Transactions</h1>

      {transactions.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={emptyStateTitleStyle}>No transactions found</div>
          <div style={emptyStateTextStyle}>
            You don't have any completed transactions yet.
          </div>
        </div>
      ) : (
        <>
          {isSmallScreen ? (
            <div style={{ ...cardListStyle, ...contentStyle }}>
              {transactions.map((transaction) => (
                <div key={transaction._id} style={transactionCardStyle}>
                  <div style={{ ...cardRowStyle, marginBottom: '4px' }}>
                    <span style={{ ...cardLabelStyle, color: '#9ca3af' }}>Item</span>
                    <span style={cardValueStrongStyle}>{getItemTitle(transaction)}</span>
                  </div>
                  <div style={cardRowStyle}>
                    <span style={cardLabelStyle}>Item Price</span>
                    <span>{formatCurrency(transaction.itemPrice)}</span>
                  </div>
                  <div style={cardRowStyle}>
                    <span style={cardLabelStyle}>Seller Payout</span>
                    <span style={cardValueStrongStyle}>{formatCurrency(transaction.sellerPayout)}</span>
                  </div>
                  <div style={cardRowStyle}>
                    <span style={cardLabelStyle}>Status</span>
                    <span style={statusBadgeStyle(transaction.status)}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </div>
                  <div style={cardRowStyle}>
                    <span style={cardLabelStyle}>Date</span>
                    <span>{formatDate(transaction.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ ...tableContainerStyle, ...contentStyle }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Item Title</th>
                    <th style={thStyle}>Item Price</th>
                    <th style={thStyle}>Seller Payout</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr 
                      key={transaction._id}
                      style={{
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#252b42';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1e2338';
                      }}
                    >
                      <td style={tdStyle}>
                        <strong>{getItemTitle(transaction)}</strong>
                      </td>
                      <td style={tdStyle}>{formatCurrency(transaction.itemPrice)}</td>
                      <td style={tdStyle}>
                        <strong>{formatCurrency(transaction.sellerPayout)}</strong>
                      </td>
                      <td style={tdStyle}>
                        <span style={statusBadgeStyle(transaction.status)}>
                          {getStatusLabel(transaction.status)}
                        </span>
                      </td>
                      <td style={tdStyle}>{formatDate(transaction.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Transactions;

