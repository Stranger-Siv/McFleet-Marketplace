import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import ConfirmationModal from '../../components/ConfirmationModal';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, transactionId: null, transactionInfo: null });

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

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Transactions</h1>
        <div>Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Transactions</h1>
        <div style={{ color: 'red' }}>Error: {error}</div>
      </div>
    );
  }

  const containerStyle = {
    padding: '20px'
  };

  const tableContainerStyle = {
    overflowX: 'auto',
    marginTop: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const thStyle = {
    backgroundColor: '#f9fafb',
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb',
    fontSize: '14px'
  };

  const tdStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    color: '#374151',
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
    padding: '6px 12px',
    backgroundColor: '#10b981',
    color: 'white',
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
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px'
  };

  const successMessageStyle = {
    ...messageStyle,
    backgroundColor: '#d1fae5',
    border: '1px solid #86efac',
    color: '#166534'
  };

  const errorMessageStyle = {
    ...messageStyle,
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    color: '#991b1b'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
    backgroundColor: '#fff',
    borderRadius: '8px',
    marginTop: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      <h1>Transactions</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Track and manage seller payouts
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
          <div style={{ fontSize: '24px', marginBottom: '12px', color: '#333' }}>
            No transactions found
          </div>
          <div style={{ fontSize: '16px' }}>
            Transactions will appear here once orders are completed.
          </div>
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
                      <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
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
                          onClick={() => handleMarkPaidClick(transaction._id, transaction.sellerPayout, transaction.seller?.discordUsername || 'Unknown')}
                          disabled={isLoading}
                          style={{
                            ...buttonStyle,
                            ...(isLoading ? disabledButtonStyle : {})
                          }}
                        >
                          {isLoading ? 'Processing...' : 'Mark Paid'}
                        </button>
                      ) : (
                        <span style={{ color: '#999', fontSize: '12px' }}>Completed</span>
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
        message={`Are you sure you want to mark the payout of ₹${confirmModal.transactionInfo?.sellerPayout?.toLocaleString('en-IN')} to "${confirmModal.transactionInfo?.sellerName}" as paid? This action cannot be undone.`}
        confirmText="Mark as Paid"
        isDestructive={false}
        isLoading={confirmModal.transactionId && actionLoading[confirmModal.transactionId]}
      />
    </div>
  );
}

export default Transactions;

