import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import { useResponsive } from '../../hooks/useResponsive';
import ConfirmationModal from '../../components/ConfirmationModal';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [middlemen, setMiddlemen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [selectedMiddleman, setSelectedMiddleman] = useState({});
  const [showAssignModal, setShowAssignModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, orderId: null, orderInfo: null });
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [bulkMiddleman, setBulkMiddleman] = useState('');
  const [bulkAssigning, setBulkAssigning] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/auth/orders');

      if (response.data.success && response.data.orders) {
        setOrders(response.data.orders);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchMiddlemen = async () => {
    try {
      const response = await apiClient.get('/api/auth/users/middlemen');
      if (response.data.success && response.data.middlemen) {
        setMiddlemen(response.data.middlemen);
      }
    } catch (err) {
      console.error('Failed to fetch middlemen:', err);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([fetchOrders(), fetchMiddlemen()]);
  };

  // Initial fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  // Set up polling for orders (30 seconds interval)
  usePolling(fetchAllData, 30000);

  const handleAssignMiddlemanClick = (orderId) => {
    const middlemanId = selectedMiddleman[orderId];
    
    if (!middlemanId) {
      setActionError('Please select a middleman');
      return;
    }

    const order = orders.find(o => o._id === orderId);
    const middleman = middlemen.find(m => m._id === middlemanId);
    
    setConfirmModal({
      isOpen: true,
      action: 'assign',
      orderId,
      orderInfo: {
        orderId,
        middlemanName: middleman?.discordUsername || 'Unknown',
        listingTitle: order?.listing?.title || 'Unknown'
      }
    });
  };

  const handleAssignMiddleman = async (orderId) => {
    const middlemanId = selectedMiddleman[orderId];
    
    try {
      setActionLoading(prev => ({ ...prev, [orderId]: true }));
      setActionError(null);
      setActionMessage(null);
      setConfirmModal({ isOpen: false, action: null, orderId: null, orderInfo: null });

      const response = await apiClient.post(`/api/auth/orders/${orderId}/assign-middleman`, {
        middlemanId
      });

      if (response.data.success) {
        setActionMessage('Middleman assigned successfully');
        setShowAssignModal(null);
        setSelectedMiddleman(prev => ({ ...prev, [orderId]: null }));
        await fetchAllData();
      } else {
        setActionError('Failed to assign middleman');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to assign middleman');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const assignableOrders = orders.filter(o => canAssignMiddleman(o));
    if (selectedOrders.size === assignableOrders.length && assignableOrders.length > 0) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(assignableOrders.map(o => o._id)));
    }
  };

  const handleBulkAssign = async () => {
    if (!bulkMiddleman) {
      setActionError('Please select a middleman');
      return;
    }

    if (selectedOrders.size === 0) {
      setActionError('Please select at least one order');
      return;
    }

    try {
      setBulkAssigning(true);
      setActionError(null);
      setActionMessage(null);

      const orderIds = Array.from(selectedOrders);
      const results = await Promise.allSettled(
        orderIds.map(orderId =>
          apiClient.post(`/api/auth/orders/${orderId}/assign-middleman`, {
            middlemanId: bulkMiddleman
          })
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled' && r.value.data.success).length;
      const failed = results.length - successful;

      if (successful > 0) {
        setActionMessage(`Successfully assigned ${successful} order${successful > 1 ? 's' : ''}${failed > 0 ? ` (${failed} failed)` : ''}`);
        setSelectedOrders(new Set());
        setBulkMiddleman('');
        await fetchAllData();
      } else {
        setActionError('Failed to assign orders. Please try again.');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to assign orders');
    } finally {
      setBulkAssigning(false);
    }
  };

  const handleCompleteOrderClick = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    setConfirmModal({
      isOpen: true,
      action: 'complete',
      orderId,
      orderInfo: {
        orderId,
        listingTitle: order?.listing?.title || 'Unknown'
      }
    });
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      setActionLoading(prev => ({ ...prev, [orderId]: true }));
      setActionError(null);
      setActionMessage(null);
      setConfirmModal({ isOpen: false, action: null, orderId: null, orderInfo: null });

      const response = await apiClient.post(`/api/auth/orders/${orderId}/complete`);

      if (response.data.success) {
        setActionMessage('Order completed successfully');
        await fetchAllData();
      } else {
        setActionError('Failed to complete order');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to complete order');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
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
      case 'pending_payment':
        return '#f59e0b'; // orange
      case 'paid':
        return '#3b82f6'; // blue
      case 'item_collected':
        return '#8b5cf6'; // purple
      case 'item_delivered':
        return '#10b981'; // green
      case 'completed':
        return '#059669'; // dark green
      case 'cancelled':
        return '#ef4444'; // red
      case 'disputed':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusLabel = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const canAssignMiddleman = (order) => {
    return (order.status === 'pending_payment' || order.status === 'paid') && !order.middleman;
  };

  const canCompleteOrder = (order) => {
    return order.status === 'item_delivered';
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobile ? '16px' : isTablet ? '20px' : '24px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '700',
    marginBottom: isMobile ? '8px' : '8px'
  };

  const subtitleStyle = {
    color: '#b8bcc8',
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
    border: '1px solid #2d3447',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const thStyle = {
    backgroundColor: '#1a1f35',
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#ffffff',
    borderBottom: '2px solid #2d3447',
    fontSize: '14px'
  };

  const tdStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #2d3447',
    color: '#b8bcc8',
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
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '600',
    marginRight: '6px',
    transition: 'all 0.2s ease'
  };

  const assignButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#8b5cf6',
    color: '#ffffff'
  };

  const completeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#10b981',
    color: '#ffffff'
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

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
  };

  const selectStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #2d3447',
    borderRadius: '8px',
    fontSize: '16px', // Prevent zoom on iOS
    minHeight: '48px', // Touch-friendly size
    marginBottom: '16px',
    backgroundColor: '#1a1f35',
    color: '#ffffff',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fbbf24' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '12px',
    paddingRight: '40px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    outline: 'none',
    display: 'block',
    minWidth: '200px' // Ensure minimum width
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: isMobile ? '40px 16px' : '60px 20px',
    color: '#b8bcc8',
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    marginTop: '20px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  // Mobile card layout styles
  const mobileCardListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '12px'
  };

  const mobileCardStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: '14px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
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
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'flex-end'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Order Management</h1>
      <p style={subtitleStyle}>
        As an admin, you have full visibility of all order details including Discord identities for coordination purposes.
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

      {/* Bulk Action Bar (desktop/tablet only) */}
      {selectedOrders.size > 0 && !isMobile && (
        <div style={{
          backgroundColor: '#1e2338',
          border: '1px solid #2d3447',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {selectedOrders.size} order{selectedOrders.size > 1 ? 's' : ''} selected
          </div>
          <select
            value={bulkMiddleman}
            onChange={(e) => setBulkMiddleman(e.target.value)}
            style={{
              ...selectStyle,
              minWidth: '200px',
              marginBottom: '0',
              flex: '1',
              maxWidth: '300px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#fbbf24';
              e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#2d3447';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">Select middleman</option>
            {middlemen.map((middleman) => (
              <option key={middleman._id} value={middleman._id}>
                {middleman.discordUsername}
              </option>
            ))}
          </select>
          <button
            onClick={handleBulkAssign}
            disabled={!bulkMiddleman || bulkAssigning}
            style={{
              backgroundColor: bulkMiddleman && !bulkAssigning ? '#fbbf24' : '#2d3447',
              color: bulkMiddleman && !bulkAssigning ? '#0a0e27' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: bulkMiddleman && !bulkAssigning ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              if (bulkMiddleman && !bulkAssigning) {
                e.target.style.backgroundColor = '#f59e0b';
                e.target.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (bulkMiddleman && !bulkAssigning) {
                e.target.style.backgroundColor = '#fbbf24';
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {bulkAssigning ? 'Assigning...' : `Assign to ${selectedOrders.size} Order${selectedOrders.size > 1 ? 's' : ''}`}
          </button>
          <button
            onClick={() => {
              setSelectedOrders(new Set());
              setBulkMiddleman('');
            }}
            style={{
              backgroundColor: 'transparent',
              color: '#b8bcc8',
              border: '1px solid #2d3447',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#ef4444';
              e.target.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#2d3447';
              e.target.style.color = '#b8bcc8';
            }}
          >
            Clear Selection
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '24px', marginBottom: '12px', color: '#ffffff' }}>
            No active orders found
          </div>
        </div>
      ) : isMobile ? (
        <div style={mobileCardListStyle}>
          {orders.map((order) => {
            const isLoading = actionLoading[order._id];
            const canAssign = canAssignMiddleman(order);
            const canComplete = canCompleteOrder(order);

            return (
              <div key={order._id} style={mobileCardStyle}>
                <div style={mobileRowStyle}>
                  <div style={{ fontWeight: '600', color: '#ffffff' }}>
                    {order.listing?.title || 'Unknown'}
                  </div>
                  <span style={statusBadgeStyle(order.status)}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <div style={mobileRowStyle}>
                  <span style={mobileLabelStyle}>Order ID</span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: '#9ca3af',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {order._id}
                  </span>
                </div>
                <div style={mobileRowStyle}>
                  <span style={mobileLabelStyle}>Buyer</span>
                  <span>{order.buyer?.discordUsername || 'Unknown'}</span>
                </div>
                <div style={mobileRowStyle}>
                  <span style={mobileLabelStyle}>Seller</span>
                  <span>{order.seller?.discordUsername || 'Unknown'}</span>
                </div>
                <div style={mobileRowStyle}>
                  <span style={mobileLabelStyle}>Middleman</span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {order.middleman?.discordUsername || 'Not assigned'}
                  </span>
                </div>
                <div style={mobileButtonRowStyle}>
                  <button
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: '#3b82f6',
                      color: '#ffffff'
                    }}
                  >
                    View Details
                  </button>
                  {canAssign && !order.middleman && (
                    <button
                      onClick={() => setShowAssignModal(order._id)}
                      disabled={isLoading}
                      style={assignButtonStyle}
                    >
                      {isLoading ? 'Assigning...' : 'Assign Middleman'}
                    </button>
                  )}
                  {canComplete && (
                    <button
                      onClick={() => handleCompleteOrderClick(order._id)}
                      disabled={isLoading}
                      style={{
                        ...completeButtonStyle,
                        ...(isLoading ? disabledButtonStyle : {})
                      }}
                    >
                      {isLoading ? 'Processing...' : 'Complete Order'}
                    </button>
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
                <th style={{ ...thStyle, width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={
                      orders.filter((o) => canAssignMiddleman(o)).length > 0 &&
                      selectedOrders.size === orders.filter((o) => canAssignMiddleman(o)).length
                    }
                    onChange={handleSelectAll}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                </th>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Buyer</th>
                <th style={thStyle}>Seller</th>
                <th style={thStyle}>Middleman</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isLoading = actionLoading[order._id];
                const showModal = showAssignModal === order._id;
                const isSelected = selectedOrders.has(order._id);
                const canSelect = canAssignMiddleman(order);

                return (
                  <tr
                    key={order._id}
                    style={{
                      backgroundColor: isSelected ? '#252b42' : 'transparent'
                    }}
                  >
                    <td style={{ ...tdStyle, textAlign: 'center', width: '40px' }}>
                      {canSelect && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOrder(order._id)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer'
                          }}
                        />
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '12px' }}>
                      <span
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        style={{
                          cursor: 'pointer',
                          color: '#3b82f6',
                          textDecoration: 'underline'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#3b82f6';
                        }}
                      >
                        {order._id.substring(0, 8)}...
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {order.buyer?.discordUsername || 'Unknown'}
                    </td>
                    <td style={tdStyle}>
                      {order.seller?.discordUsername || 'Unknown'}
                    </td>
                    <td style={tdStyle}>
                      {order.middleman?.discordUsername || 'Not assigned'}
                    </td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(order.status)}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          style={{
                            ...buttonStyle,
                            backgroundColor: '#3b82f6',
                            color: '#ffffff'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#2563eb';
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#3b82f6';
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          View
                        </button>
                        {canAssignMiddleman(order) && (
                          <button
                            onClick={() => setShowAssignModal(order._id)}
                            disabled={isLoading}
                            style={{
                              ...assignButtonStyle,
                              ...(isLoading ? disabledButtonStyle : {})
                            }}
                          >
                            Assign Middleman
                          </button>
                        )}
                        {canCompleteOrder(order) && (
                          <button
                            onClick={() => handleCompleteOrderClick(order._id)}
                            disabled={isLoading}
                            style={{
                              ...completeButtonStyle,
                              ...(isLoading ? disabledButtonStyle : {})
                            }}
                          >
                            {isLoading ? 'Processing...' : 'Complete Order'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Middleman Modal */}
      {showAssignModal && (
        <div style={modalOverlayStyle} onClick={() => setShowAssignModal(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>Assign Middleman</h3>
            <select
              value={selectedMiddleman[showAssignModal] || ''}
              onChange={(e) => setSelectedMiddleman(prev => ({
                ...prev,
                [showAssignModal]: e.target.value
              }))}
              style={selectStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#fbbf24';
                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2d3447';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Select a middleman</option>
              {middlemen.map((middleman) => (
                <option key={middleman._id} value={middleman._id}>
                  {middleman.discordUsername}
                </option>
              ))}
            </select>
            {middlemen.length === 0 && (
              <p style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '16px' }}>
                No middlemen available. Create middlemen first.
              </p>
            )}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowAssignModal(null);
                  setSelectedMiddleman(prev => ({ ...prev, [showAssignModal]: null }));
                }}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAssignMiddlemanClick(showAssignModal)}
                disabled={!selectedMiddleman[showAssignModal] || actionLoading[showAssignModal] || middlemen.length === 0}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: selectedMiddleman[showAssignModal] && !actionLoading[showAssignModal] && middlemen.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: selectedMiddleman[showAssignModal] && !actionLoading[showAssignModal] && middlemen.length > 0 ? 1 : 0.6
                }}
              >
                {actionLoading[showAssignModal] ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, orderId: null, orderInfo: null })}
        onConfirm={() => {
          if (confirmModal.action === 'assign') {
            handleAssignMiddleman(confirmModal.orderId);
          } else if (confirmModal.action === 'complete') {
            handleCompleteOrder(confirmModal.orderId);
          }
        }}
        title={confirmModal.action === 'assign' ? 'Assign Middleman' : 'Complete Order'}
        message={
          confirmModal.action === 'assign'
            ? `Are you sure you want to assign "${confirmModal.orderInfo?.middlemanName}" as middleman for order "${confirmModal.orderInfo?.listingTitle}"?`
            : `Are you sure you want to complete this order? This will create a transaction record and finalize the sale.`
        }
        confirmText={confirmModal.action === 'assign' ? 'Assign Middleman' : 'Complete Order'}
        isDestructive={false}
        isLoading={confirmModal.orderId && actionLoading[confirmModal.orderId]}
      />
    </div>
  );
}

export default Orders;

