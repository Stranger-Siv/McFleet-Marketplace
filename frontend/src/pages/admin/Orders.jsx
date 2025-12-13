import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
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

  // Set up polling for orders (7 seconds interval)
  usePolling(fetchAllData, 7000);

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

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Order Management</h1>
        <div>Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Order Management</h1>
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
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    marginRight: '6px'
  };

  const assignButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#8b5cf6',
    color: 'white'
  };

  const completeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#10b981',
    color: 'white'
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
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const selectStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '16px'
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
      <h1>Order Management</h1>
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
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

      {orders.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '24px', marginBottom: '12px', color: '#333' }}>
            No active orders found
          </div>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
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

                return (
                  <tr key={order._id}>
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
                            color: 'white'
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
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Assign Middleman</h3>
            <select
              value={selectedMiddleman[showAssignModal] || ''}
              onChange={(e) => setSelectedMiddleman(prev => ({
                ...prev,
                [showAssignModal]: e.target.value
              }))}
              style={selectStyle}
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

