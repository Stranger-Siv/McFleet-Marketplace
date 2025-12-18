import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import { useResponsive } from '../../hooks/useResponsive';

function SellerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const { isMobile, isTablet } = useResponsive();

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

  // Set up polling (30 seconds interval)
  usePolling(fetchRequests, 30000);

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
    fontSize: isMobile ? '13px' : '14px',
    marginBottom: isMobile ? '16px' : '20px'
  };

  const listStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '12px' : '16px',
    marginTop: isMobile ? '12px' : '16px'
  };

  const requestCardStyle = {
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: isMobile ? '14px' : '18px',
    backgroundColor: '#1e2338',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45)',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: isMobile ? '12px' : '20px'
  };

  const requestInfoStyle = {
    flex: 1
  };

  const usernameStyle = {
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#ffffff'
  };

  const detailStyle = {
    fontSize: isMobile ? '13px' : '14px',
    color: '#b8bcc8',
    marginBottom: '4px',
    lineHeight: 1.5
  };

  const statusBadgeStyle = (status) => ({
    padding: '4px 10px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: '500',
    color: '#ffffff',
    backgroundColor: getStatusColor(status),
    marginRight: '12px'
  });

  const buttonGroupStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '8px',
    width: isMobile ? '100%' : 'auto'
  };

  const approveButtonStyle = {
    padding: '10px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '600',
    width: isMobile ? '100%' : 'auto',
    minHeight: '40px'
  };

  const rejectButtonStyle = {
    padding: '10px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '600',
    width: isMobile ? '100%' : 'auto',
    minHeight: '40px'
  };

  const disabledButtonStyle = {
    opacity: 0.6,
    cursor: 'not-allowed'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: isMobile ? '40px 16px' : '60px 20px',
    color: '#b8bcc8',
    backgroundColor: '#1e2338',
    borderRadius: '12px',
    marginTop: isMobile ? '16px' : '20px',
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

  // Filter to show pending requests first, then others
  const sortedRequests = [...requests].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Seller Requests</h1>
      <p style={subtitleStyle}>
        Review and approve or reject buyer accounts that want to become sellers on McFleet.
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
                  <strong>Requested:</strong>{' '}
                  {new Date(request.createdAt).toLocaleDateString('en-IN', {
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
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

