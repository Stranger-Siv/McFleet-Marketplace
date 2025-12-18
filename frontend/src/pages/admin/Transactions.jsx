import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import { useResponsive } from '../../hooks/useResponsive';
import ConfirmationModal from '../../components/ConfirmationModal';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, transactionId: null, transactionInfo: null });
  const { isMobile, isTablet } = useResponsive();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/auth/transactions');

      if (response.data.success && response.data.transactions) {
        setTransactions(response.data.transactions);
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

  const handleMarkPaidClick = (transactionId, sellerPayout, sellerName) => {
    setConfirmModal({
      isOpen: true,
      transactionId,
      transactionInfo: { sellerPayout, sellerName }
    });
  };

  const handleMarkPaid = async (transactionId) => {
    try {
      setActionLoading(prev => ({ ...prev, [transactionId]: true }));
      setActionError(null);
      setActionMessage(null);
      setConfirmModal({ isOpen: false, transactionId: null, transactionInfo: null });

      const response = await apiClient.post(`/api/auth/transactions/${transactionId}/mark-paid`);

      if (response.data.success) {
        setActionMessage('Seller payout marked as paid successfully');
        await fetchTransactions();
      } else {
        setActionError('Failed to mark payout as paid');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to mark payout as paid');
    } finally {
      setActionLoading(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (actionMessage || actionError) {
      const timer = setTimeout(() => {
        setActionMessage(null);
        setActionError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage, actionError]);

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'recorded':
        return '#f59e0b'; // orange - pending
      case 'paid_out':
        return '#10b981'; // green - paid
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'recorded':
        return 'Pending Payout';
      case 'paid_out':
        return 'Paid Out';
      default:
        return status;
    }
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '16px' : isTablet ? '20px' : '24px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '700',
    marginBottom: isMobile ? '8px' : '12px'
  };

  const subtitleStyle = {
    color: '#9ca3af',
    marginBottom: isMobile ? '16px' : '20px',
    fontSize: isMobile ? '13px' : '14px'
  };

  const tableContainerStyle = {
    overflowX: 'auto',
    marginTop: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#1e2338',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    borderRadius: '12px',
    overflow: 'hidden'
  };

  const thStyle = {
    backgroundColor: '#131829',
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#dcddde',
    borderBottom: '1px solid #2d3447',
    fontSize: '14px'
  };

  const tdStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #2d3447',
    color: '#dcddde',
    fontSize: '14px'
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

  const buttonStyle = {
    padding: '8px 14px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500'
  };

  const disabledButtonStyle = {
    opacity: 0.6,
    cursor: 'not-allowed'
  };

  const messageStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px'
  };

  const successMessageStyle = {
    ...messageStyle,
    backgroundColor: '#065f46',
    border: '1px solid #10b981',
    color: '#ffffff'
  };

  const errorMessageStyle = {
    ...messageStyle,
    backgroundColor: '#7f1d1d',
    border: '1px solid #ef4444',
    color: '#ffffff'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: isMobile ? '40px 16px' : '60px 20px',
    color: '#b9bbbe',
    backgroundColor: '#1e2338',
    borderRadius: '12px',
    marginTop: '20px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const mobileCardListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '12px'
  };

  const mobileCardStyle = {
    backgroundColor: '#1e2338',
    borderRadius: '12px',
    border: '1px solid #2d3447',
    padding: '14px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const mobileRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#e5e7eb'
  };

  const mobileLabelStyle = {
    color: '#9ca3af',
    fontWeight: 500,
    marginRight: '6px'
  };

  const mobileButtonRowStyle = {
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'flex-end'
  };

  return (
    <div style={containerStyle}>
      {loading ? (
        <>
          <h1 style={titleStyle}>Transactions</h1>
          <div style={{ color: '#b9bbbe', textAlign: 'center', padding: '40px' }}>Loading transactions...</div>
        </>
      ) : error ? (
        <>
          <h1 style={titleStyle}>Transactions</h1>
          <div style={{ color: '#ff6b6b', marginBottom: '16px' }}>Error: {error}</div>
        </>
      ) : (
        <>
          <h1 style={titleStyle}>Transactions</h1>
          <p style={subtitleStyle}>
            Track and manage seller payouts for completed orders.
          </p>

          {/* Success/Error Messages */}
          {actionMessage && (
            <div style={successMessageStyle}>
              {actionMessage}
            </div>
          )}

          {actionError && (
            <div style={errorMessageStyle}>
              {actionError}
            </div>
          )}

          {transactions.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '24px', marginBottom: '12px', color: '#ffffff' }}>
                No transactions found
              </div>
              <div style={{ fontSize: '14px' }}>
                Transactions will appear here once orders are completed.
              </div>
            </div>
          ) : isMobile ? (
            <div style={mobileCardListStyle}>
              {transactions.map((transaction) => {
                const isLoading = actionLoading[transaction._id];
                const canMarkPaid = transaction.status === 'recorded';

                return (
                  <div key={transaction._id} style={mobileCardStyle}>
                    <div style={mobileRowStyle}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#9ca3af' }}>
                        {transaction._id.substring(0, 10)}...
                      </span>
                      <span style={statusBadgeStyle(transaction.status)}>
                        {getStatusLabel(transaction.status)}
                      </span>
                    </div>
                    <div style={mobileRowStyle}>
                      <span style={mobileLabelStyle}>Seller</span>
                      <span style={{ fontSize: '13px', color: '#e5e7eb' }}>
                        {transaction.seller?.discordUsername || 'Unknown'}
                      </span>
                    </div>
                    <div style={mobileRowStyle}>
                      <span style={mobileLabelStyle}>Amount</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(transaction.itemPrice)}</span>
                    </div>
                    <div style={mobileRowStyle}>
                      <span style={mobileLabelStyle}>Commission</span>
                      <span style={{ fontSize: '13px', color: '#e5e7eb' }}>
                        {formatCurrency(transaction.commissionAmount)}{' '}
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          ({transaction.commissionPercent}%)
                        </span>
                      </span>
                    </div>
                    <div style={mobileRowStyle}>
                      <span style={mobileLabelStyle}>Payout</span>
                      <span style={{ fontWeight: 600, color: '#10b981' }}>
                        {formatCurrency(transaction.sellerPayout)}
                      </span>
                    </div>
                    <div style={mobileRowStyle}>
                      <span style={mobileLabelStyle}>Date</span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div style={mobileButtonRowStyle}>
                      {canMarkPaid ? (
                        <button
                          onClick={() =>
                            handleMarkPaidClick(
                              transaction._id,
                              transaction.sellerPayout,
                              transaction.seller?.discordUsername || 'Unknown'
                            )
                          }
                          disabled={isLoading}
                          style={{
                            ...buttonStyle,
                            ...(isLoading ? disabledButtonStyle : {}),
                            minWidth: '140px'
                          }}
                        >
                          {isLoading ? 'Processing...' : 'Mark Paid'}
                        </button>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>Completed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Transaction ID</th>
                    <th style={thStyle}>Seller</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Commission</th>
                    <th style={thStyle}>Seller Payout</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => {
                    const isLoading = actionLoading[transaction._id];
                    const canMarkPaid = transaction.status === 'recorded';

                    return (
                      <tr key={transaction._id}>
                        <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '12px' }}>
                          {transaction._id.substring(0, 8)}...
                        </td>
                        <td style={tdStyle}>
                          {transaction.seller?.discordUsername || 'Unknown'}
                        </td>
                        <td style={tdStyle}>
                          <strong>{formatCurrency(transaction.itemPrice)}</strong>
                        </td>
                        <td style={tdStyle}>
                          {formatCurrency(transaction.commissionAmount)}
                          <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '4px' }}>
                            ({transaction.commissionPercent}%)
                          </span>
                        </td>
                        <td style={{ ...tdStyle, color: '#10b981', fontWeight: '500' }}>
                          {formatCurrency(transaction.sellerPayout)}
                        </td>
                        <td style={tdStyle}>
                          <span style={statusBadgeStyle(transaction.status)}>
                            {getStatusLabel(transaction.status)}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td style={tdStyle}>
                          {canMarkPaid ? (
                            <button
                              onClick={() =>
                                handleMarkPaidClick(
                                  transaction._id,
                                  transaction.sellerPayout,
                                  transaction.seller?.discordUsername || 'Unknown'
                                )
                              }
                              disabled={isLoading}
                              style={{
                                ...buttonStyle,
                                ...(isLoading ? disabledButtonStyle : {})
                              }}
                            >
                              {isLoading ? 'Processing...' : 'Mark Paid'}
                            </button>
                          ) : (
                            <span style={{ color: '#9ca3af', fontSize: '12px' }}>Completed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Confirmation Modal */}
          <ConfirmationModal
            isOpen={confirmModal.isOpen}
            onClose={() => setConfirmModal({ isOpen: false, transactionId: null, transactionInfo: null })}
            onConfirm={() => handleMarkPaid(confirmModal.transactionId)}
            title="Mark Payout as Paid"
            message={`Are you sure you want to mark the payout of ₹${confirmModal.transactionInfo?.sellerPayout?.toLocaleString(
              'en-IN'
            )} to "${confirmModal.transactionInfo?.sellerName}" as paid? This action cannot be undone.`}
            confirmText="Mark as Paid"
            isDestructive={false}
            isLoading={confirmModal.transactionId && actionLoading[confirmModal.transactionId]}
          />
        </>
      )}
    </div>
  );
}

export default Transactions;

