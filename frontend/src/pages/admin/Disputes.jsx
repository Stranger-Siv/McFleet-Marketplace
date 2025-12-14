import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import { useResponsive } from '../../hooks/useResponsive';
import ConfirmationModal from '../../components/ConfirmationModal';

function Disputes() {
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    disputeId: null, 
    dispute: null 
  });
  const [resolveModal, setResolveModal] = useState({ 
    isOpen: false, 
    disputeId: null 
  });
  const [resolutionNote, setResolutionNote] = useState('');
  const [restoreOrderStatus, setRestoreOrderStatus] = useState('item_delivered');

  // Filters
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'open', 'resolved'
  const [orderIdFilter, setOrderIdFilter] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (orderIdFilter.trim()) {
        params.append('orderId', orderIdFilter.trim());
      }
      if (userIdFilter.trim()) {
        params.append('userId', userIdFilter.trim());
      }

      const response = await apiClient.get(`/api/auth/disputes?${params.toString()}`);

      if (response.data.success && response.data.disputes) {
        setDisputes(response.data.disputes);
      } else {
        setError('Failed to load disputes');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch disputes');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDisputes();
  }, [statusFilter, orderIdFilter, userIdFilter]);

  // Set up polling (30 seconds interval)
  usePolling(fetchDisputes, 30000);

  const handleResolveClick = (disputeId, dispute) => {
    setResolveModal({ isOpen: true, disputeId });
    setResolutionNote('');
    setRestoreOrderStatus('item_delivered');
  };

  const handleResolve = async () => {
    if (!resolveModal.disputeId) return;

    try {
      setActionLoading({ resolve: true });
      setActionError(null);
      setActionMessage(null);

      const response = await apiClient.post(`/api/auth/disputes/${resolveModal.disputeId}/resolve`, {
        resolutionNote: resolutionNote.trim() || '',
        restoreOrderStatus: restoreOrderStatus
      });

      if (response.data.success) {
        setActionMessage('Dispute resolved successfully');
        setResolveModal({ isOpen: false, disputeId: null });
        setResolutionNote('');
        await fetchDisputes();
      } else {
        setActionError('Failed to resolve dispute');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to resolve dispute');
    } finally {
      setActionLoading({ resolve: false });
    }
  };

  const getStatusBadgeStyle = (status) => {
    return {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: status === 'open' ? '#ef4444' : '#10b981'
    };
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobile ? '16px' : isTablet ? '20px' : '24px'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '24px' : isTablet ? '28px' : '32px',
    fontWeight: '700',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    color: '#b8bcc8',
    fontSize: isMobile ? '13px' : '14px',
    marginBottom: isMobile ? '16px' : '24px'
  };

  const filterContainerStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: isMobile ? '16px' : '20px',
    marginBottom: isMobile ? '16px' : '24px',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    flexWrap: 'wrap',
    gap: isMobile ? '12px' : '16px',
    alignItems: isMobile ? 'stretch' : 'flex-end'
  };

  const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: isMobile ? '100%' : '200px',
    flex: isMobile ? '1 1 100%' : '1 1 200px'
  };

  const filterLabelStyle = {
    color: '#b8bcc8',
    fontSize: '14px',
    fontWeight: '500'
  };

  const filterInputStyle = {
    padding: isMobile ? '14px 16px' : '10px 12px',
    backgroundColor: '#1a1f35',
    border: '1px solid #2d3447',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
    fontFamily: 'inherit',
    minHeight: isMobile ? '48px' : 'auto', // Touch-friendly size
    boxSizing: 'border-box'
  };

  const filterSelectStyle = {
    ...filterInputStyle,
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fbbf24' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px',
    paddingRight: isMobile ? '40px' : '36px',
    outline: 'none',
    transition: 'all 0.2s ease',
    width: '100%',
    display: 'block',
    minWidth: isMobile ? '100%' : '200px' // Ensure minimum width
  };

  const tableContainerStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    overflow: isMobile ? 'visible' : 'hidden'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    display: isMobile ? 'none' : 'table'
  };

  const thStyle = {
    backgroundColor: '#1a1f35',
    color: '#ffffff',
    padding: isMobile ? '12px' : '16px',
    textAlign: 'left',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '600',
    borderBottom: '1px solid #2d3447'
  };

  const tdStyle = {
    padding: isMobile ? '12px' : '16px',
    borderBottom: '1px solid #2d3447',
    color: '#b8bcc8',
    fontSize: isMobile ? '13px' : '14px'
  };

  // Card style for mobile view
  const cardStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: isMobile ? '16px' : '20px',
    marginBottom: '16px',
    display: isMobile ? 'block' : 'none'
  };

  const cardRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #2d3447'
  };

  const cardLabelStyle = {
    color: '#b8bcc8',
    fontSize: '13px',
    fontWeight: '500',
    marginRight: '12px',
    minWidth: '80px'
  };

  const cardValueStyle = {
    color: '#ffffff',
    fontSize: '13px',
    flex: 1,
    textAlign: 'right'
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#fbbf24',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const viewButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#5865f2',
    color: '#ffffff',
    marginRight: isMobile ? '0' : '8px',
    marginBottom: isMobile ? '8px' : '0',
    width: isMobile ? '100%' : 'auto'
  };

  const resolveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#10b981',
    color: '#ffffff',
    width: isMobile ? '100%' : 'auto'
  };

  const buttonGroupStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '8px' : '8px',
    marginTop: isMobile ? '12px' : '0'
  };

  const successMessageStyle = {
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  };

  const errorMessageStyle = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#b8bcc8'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: isMobile ? 'flex-end' : 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: isMobile ? '0' : '20px'
  };

  const modalContentStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: isMobile ? '16px 16px 0 0' : '16px',
    padding: isMobile ? '24px' : '32px',
    maxWidth: isMobile ? '100%' : '600px',
    width: '100%',
    maxHeight: isMobile ? '90vh' : '90vh',
    overflowY: 'auto',
    marginTop: isMobile ? 'auto' : '0'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Disputes Management</h1>
        <div style={{ textAlign: 'center', padding: '40px', color: '#b8bcc8' }}>
          Loading disputes...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Disputes Management</h1>
      <p style={subtitleStyle}>
        View and resolve order disputes. Disputed orders are frozen until resolved.
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

      {/* Filters */}
      <div style={filterContainerStyle}>
        <div style={filterGroupStyle}>
          <label style={filterLabelStyle}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={filterSelectStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#fbbf24';
              e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#2d3447';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div style={filterGroupStyle}>
          <label style={filterLabelStyle}>Order ID</label>
          <input
            type="text"
            value={orderIdFilter}
            onChange={(e) => setOrderIdFilter(e.target.value)}
            placeholder="Filter by Order ID"
            style={filterInputStyle}
          />
        </div>
        <div style={filterGroupStyle}>
          <label style={filterLabelStyle}>User ID</label>
          <input
            type="text"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            placeholder="Filter by User ID"
            style={filterInputStyle}
          />
        </div>
      </div>

      {/* Disputes Table */}
      {disputes.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: isMobile ? '20px' : '24px', marginBottom: '12px', color: '#ffffff' }}>
            No disputes found
          </div>
          <div style={{ color: '#6b7280', fontSize: isMobile ? '13px' : '14px' }}>
            {statusFilter !== 'all' || orderIdFilter || userIdFilter
              ? 'Try adjusting your filters'
              : 'All disputes have been resolved'}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop/Tablet Table View */}
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Order ID</th>
                  <th style={thStyle}>Raised By</th>
                  <th style={thStyle}>Against</th>
                  <th style={thStyle}>Reason</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((dispute) => (
                  <tr key={dispute._id}>
                    <td style={tdStyle}>
                      <span style={{ 
                        fontFamily: 'monospace', 
                        fontSize: isMobile ? '11px' : '12px',
                        color: '#fbbf24',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/admin/orders/${dispute.order?._id || dispute.order}`)}
                      >
                        {isMobile 
                          ? `${(dispute.order?._id || dispute.order || 'N/A').substring(0, 8)}...`
                          : dispute.order?._id || dispute.order || 'N/A'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {dispute.raisedBy?.discordUsername || 'Unknown'}
                    </td>
                    <td style={tdStyle}>
                      {dispute.against?.discordUsername || 'Unknown'}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ maxWidth: isMobile ? '150px' : isTablet ? '200px' : '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {dispute.reason}
                      </div>
                      {dispute.description && (
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#6b7280',
                          marginTop: '4px'
                        }}>
                          {dispute.description.substring(0, isMobile ? 30 : 50)}...
                        </div>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <span style={getStatusBadgeStyle(dispute.status)}>
                        {dispute.status === 'open' ? 'Open' : 'Resolved'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {isMobile 
                        ? new Date(dispute.createdAt).toLocaleDateString('en-IN')
                        : new Date(dispute.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td style={tdStyle}>
                      <div style={buttonGroupStyle}>
                        <button
                          onClick={() => navigate(`/admin/orders/${dispute.order?._id || dispute.order}`)}
                          style={viewButtonStyle}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#4752c4';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#5865f2';
                          }}
                        >
                          View Order
                        </button>
                        {dispute.status === 'open' && (
                          <button
                            onClick={() => handleResolveClick(dispute._id, dispute)}
                            style={resolveButtonStyle}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#059669';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#10b981';
                            }}
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          {isMobile && (
            <div>
              {disputes.map((dispute) => (
                <div key={dispute._id} style={cardStyle}>
                  <div style={cardRowStyle}>
                    <span style={cardLabelStyle}>Order ID:</span>
                    <span 
                      style={{ ...cardValueStyle, color: '#fbbf24', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer' }}
                      onClick={() => navigate(`/admin/orders/${dispute.order?._id || dispute.order}`)}
                    >
                      {dispute.order?._id || dispute.order || 'N/A'}
                    </span>
                  </div>
                  <div style={cardRowStyle}>
                    <span style={cardLabelStyle}>Raised By:</span>
                    <span style={cardValueStyle}>
                      {dispute.raisedBy?.discordUsername || 'Unknown'}
                    </span>
                  </div>
                  <div style={cardRowStyle}>
                    <span style={cardLabelStyle}>Against:</span>
                    <span style={cardValueStyle}>
                      {dispute.against?.discordUsername || 'Unknown'}
                    </span>
                  </div>
                  <div style={cardRowStyle}>
                    <span style={cardLabelStyle}>Reason:</span>
                    <span style={cardValueStyle}>
                      {dispute.reason}
                    </span>
                  </div>
                  {dispute.description && (
                    <div style={cardRowStyle}>
                      <span style={cardLabelStyle}>Description:</span>
                      <span style={{ ...cardValueStyle, fontSize: '12px', color: '#6b7280' }}>
                        {dispute.description}
                      </span>
                    </div>
                  )}
                  <div style={cardRowStyle}>
                    <span style={cardLabelStyle}>Status:</span>
                    <span style={cardValueStyle}>
                      <span style={getStatusBadgeStyle(dispute.status)}>
                        {dispute.status === 'open' ? 'Open' : 'Resolved'}
                      </span>
                    </span>
                  </div>
                  <div style={{ ...cardRowStyle, borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                    <span style={cardLabelStyle}>Created:</span>
                    <span style={{ ...cardValueStyle, fontSize: '12px', color: '#6b7280' }}>
                      {new Date(dispute.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={buttonGroupStyle}>
                    <button
                      onClick={() => navigate(`/admin/orders/${dispute.order?._id || dispute.order}`)}
                      style={viewButtonStyle}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#4752c4';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#5865f2';
                      }}
                    >
                      View Order
                    </button>
                    {dispute.status === 'open' && (
                      <button
                        onClick={() => handleResolveClick(dispute._id, dispute)}
                        style={resolveButtonStyle}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#059669';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#10b981';
                        }}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Resolve Modal */}
      {resolveModal.isOpen && (
        <div style={modalOverlayStyle} onClick={() => !actionLoading.resolve && setResolveModal({ isOpen: false, disputeId: null })}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ 
              color: '#ffffff', 
              fontSize: isMobile ? '20px' : '24px', 
              fontWeight: '700', 
              marginBottom: isMobile ? '12px' : '16px' 
            }}>
              Resolve Dispute
            </h2>
            
            <div style={{ marginBottom: isMobile ? '12px' : '16px' }}>
              <label style={{ 
                display: 'block', 
                color: '#b8bcc8', 
                fontSize: isMobile ? '13px' : '14px', 
                fontWeight: '600', 
                marginBottom: '8px' 
              }}>
                Resolution Note
              </label>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Enter resolution details..."
                style={{
                  width: '100%',
                  minHeight: isMobile ? '100px' : '120px',
                  padding: '12px',
                  backgroundColor: '#1a1f35',
                  border: '1px solid #2d3447',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: isMobile ? '13px' : '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
                disabled={actionLoading.resolve}
              />
            </div>

            <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
              <label style={{ 
                display: 'block', 
                color: '#b8bcc8', 
                fontSize: isMobile ? '13px' : '14px', 
                fontWeight: '600', 
                marginBottom: '8px' 
              }}>
                Restore Order Status
              </label>
              <select
                value={restoreOrderStatus}
                onChange={(e) => setRestoreOrderStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: isMobile ? '14px 16px' : '12px 16px',
                  backgroundColor: '#1a1f35',
                  border: '1px solid #2d3447',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  minHeight: isMobile ? '48px' : 'auto', // Touch-friendly size
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fbbf24' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '12px',
                  paddingRight: isMobile ? '40px' : '36px',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                disabled={actionLoading.resolve}
                onFocus={(e) => {
                  if (!actionLoading.resolve) {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#2d3447';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="pending_payment">Pending Payment</option>
                <option value="paid">Paid</option>
                <option value="item_collected">Item Collected</option>
                <option value="item_delivered">Item Delivered</option>
              </select>
            </div>

            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: '12px', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={() => setResolveModal({ isOpen: false, disputeId: null })}
                disabled={actionLoading.resolve}
                style={{
                  padding: isMobile ? '12px 20px' : '10px 20px',
                  backgroundColor: '#2d3447',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: isMobile ? '14px' : '14px',
                  fontWeight: '600',
                  cursor: actionLoading.resolve ? 'not-allowed' : 'pointer',
                  opacity: actionLoading.resolve ? 0.6 : 1,
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={actionLoading.resolve}
                style={{
                  padding: isMobile ? '12px 20px' : '10px 20px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: isMobile ? '14px' : '14px',
                  fontWeight: '600',
                  cursor: actionLoading.resolve ? 'not-allowed' : 'pointer',
                  opacity: actionLoading.resolve ? 0.6 : 1,
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                {actionLoading.resolve ? 'Resolving...' : 'Resolve Dispute'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Disputes;

