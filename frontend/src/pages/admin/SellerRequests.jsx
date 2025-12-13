import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';

function SellerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/auth/seller-requests');

      // API returns array directly, not wrapped in success/data
      if (Array.isArray(response.data)) {
        setRequests(response.data);
      } else {
        setError('Failed to load requests');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch seller requests');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, []);

  // Set up polling (7 seconds interval)
  usePolling(fetchRequests, 7000);

  const handleApprove = async (requestId) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: true }));
      setActionError(null);
      setActionMessage(null);

      const response = await apiClient.post(`/api/auth/seller-requests/${requestId}/approve`);

      if (response.data.success) {
        setActionMessage('Seller request approved successfully');
        // Refresh requests list
        await fetchRequests();
      } else {
        setActionError('Failed to approve request');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to approve request');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async (requestId) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: true }));
      setActionError(null);
      setActionMessage(null);

      const response = await apiClient.post(`/api/auth/seller-requests/${requestId}/reject`);

      if (response.data.success) {
        setActionMessage('Seller request rejected successfully');
        // Refresh requests list
        await fetchRequests();
      } else {
        setActionError('Failed to reject request');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to reject request');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b'; // orange
      case 'approved':
        return '#10b981'; // green
      case 'rejected':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Seller Requests</h1>
        <div>Loading seller requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Seller Requests</h1>
        <div style={{ color: 'red' }}>Error: {error}</div>
      </div>
    );
  }

  const containerStyle = {
    padding: '20px'
  };

  const listStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px'
  };

  const requestCardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const requestInfoStyle = {
    flex: 1
  };

  const usernameStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333'
  };

  const detailStyle = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '4px'
  };

  const statusBadgeStyle = (status) => ({
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#fff',
    backgroundColor: getStatusColor(status),
    marginRight: '12px'
  });

  const buttonGroupStyle = {
    display: 'flex',
    gap: '8px'
  };

  const approveButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500'
  };

  const rejectButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500'
  };

  const disabledButtonStyle = {
    opacity: 0.6,
    cursor: 'not-allowed'
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

  const emptyStateTitleStyle = {
    fontSize: '24px',
    marginBottom: '12px',
    color: '#333'
  };

  const emptyStateTextStyle = {
    fontSize: '16px'
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

  // Filter to show pending requests first, then others
  const sortedRequests = [...requests].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div style={containerStyle}>
      <h1>Seller Requests</h1>

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

      {sortedRequests.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={emptyStateTitleStyle}>No seller requests found</div>
          <div style={emptyStateTextStyle}>
            There are no seller requests to review at this time.
          </div>
        </div>
      ) : (
        <div style={listStyle}>
          {sortedRequests.map((request) => (
            <div key={request._id} style={requestCardStyle}>
              <div style={requestInfoStyle}>
                <div style={usernameStyle}>
                  {request.user?.discordUsername || 'Unknown User'}
                </div>
                <div style={detailStyle}>
                  <strong>Requested:</strong> {new Date(request.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {request.note && (
                  <div style={detailStyle}>
                    <strong>Note:</strong> {request.note}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={statusBadgeStyle(request.status)}>
                  {getStatusLabel(request.status)}
                </span>
                {request.status === 'pending' && (
                  <div style={buttonGroupStyle}>
                    <button
                      onClick={() => handleApprove(request._id)}
                      disabled={actionLoading[request._id]}
                      style={{
                        ...approveButtonStyle,
                        ...(actionLoading[request._id] ? disabledButtonStyle : {})
                      }}
                    >
                      {actionLoading[request._id] ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      disabled={actionLoading[request._id]}
                      style={{
                        ...rejectButtonStyle,
                        ...(actionLoading[request._id] ? disabledButtonStyle : {})
                      }}
                    >
                      {actionLoading[request._id] ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerRequests;

