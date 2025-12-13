import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import OrderTimeline from '../../components/OrderTimeline';

function OrderDetail() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const isActionInProgress = useRef(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });

  const fetchOrder = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const response = await apiClient.get(`/api/auth/orders/${orderId}`);
      
      if (response.data.success && response.data.order) {
        setOrder(response.data.order);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Set up polling (7 seconds interval) - only refresh without showing loading
  // Only poll if orderId exists
  usePolling(() => {
    if (orderId) {
      fetchOrder(false);
    }
  }, 7000, !!orderId);

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending_payment: 'Pending Payment',
      paid: 'Paid',
      item_collected: 'Item Collected',
      item_delivered: 'Item Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return statusLabels[status] || status;
  };

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

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  const handleMarkPaidClick = () => {
    setConfirmModal({ isOpen: true, action: 'markPaid' });
  };

  const handleMarkPaid = async () => {
    // Prevent duplicate calls
    if (isActionInProgress.current || actionLoading) {
      return;
    }

    const previousStatus = order?.status;

    try {
      isActionInProgress.current = true;
      setActionLoading(true);
      setActionError(null);
      setActionMessage(null);
      setConfirmModal({ isOpen: false, action: null });

      const response = await apiClient.post(`/api/auth/orders/${orderId}/mark-paid`);

      if (response.data.success) {
        setActionMessage('Order marked as paid successfully');
        // Optimistically update status
        setOrder(prev => prev ? { ...prev, status: 'paid' } : null);
        // Refresh order data (without showing loading spinner)
        await fetchOrder(false);
      } else {
        setActionError('Failed to mark order as paid');
        // Revert optimistic update on failure
        if (previousStatus) {
          setOrder(prev => prev ? { ...prev, status: previousStatus } : null);
        }
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to mark order as paid');
      // Revert optimistic update on error
      if (previousStatus) {
        setOrder(prev => prev ? { ...prev, status: previousStatus } : null);
      }
      // Refresh order to get correct status on error
      await fetchOrder(false);
    } finally {
      setActionLoading(false);
      isActionInProgress.current = false;
    }
  };

  const handleCollectItemClick = () => {
    setConfirmModal({ isOpen: true, action: 'collect' });
  };

  const handleCollectItem = async () => {
    // Prevent duplicate calls
    if (isActionInProgress.current || actionLoading) {
      return;
    }

    const previousStatus = order?.status;

    try {
      isActionInProgress.current = true;
      setActionLoading(true);
      setActionError(null);
      setActionMessage(null);
      setConfirmModal({ isOpen: false, action: null });

      const response = await apiClient.post(`/api/auth/orders/${orderId}/collect`);

      if (response.data.success) {
        setActionMessage('Item collected successfully');
        // Optimistically update status
        setOrder(prev => prev ? { ...prev, status: 'item_collected' } : null);
        // Refresh order data (without showing loading spinner)
        await fetchOrder(false);
      } else {
        setActionError('Failed to collect item');
        // Revert optimistic update on failure
        if (previousStatus) {
          setOrder(prev => prev ? { ...prev, status: previousStatus } : null);
        }
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to collect item');
      // Revert optimistic update on error
      if (previousStatus) {
        setOrder(prev => prev ? { ...prev, status: previousStatus } : null);
      }
      // Refresh order to get correct status on error
      await fetchOrder(false);
    } finally {
      setActionLoading(false);
      isActionInProgress.current = false;
    }
  };

  const handleDeliverItemClick = () => {
    setConfirmModal({ isOpen: true, action: 'deliver' });
  };

  const handleDeliverItem = async () => {
    // Prevent duplicate calls
    if (isActionInProgress.current || actionLoading) {
      return;
    }

    const previousStatus = order?.status;

    try {
      isActionInProgress.current = true;
      setActionLoading(true);
      setActionError(null);
      setActionMessage(null);
      setConfirmModal({ isOpen: false, action: null });

      const response = await apiClient.post(`/api/auth/orders/${orderId}/deliver`);

      if (response.data.success) {
        setActionMessage('Item delivered successfully');
        // Optimistically update status
        setOrder(prev => prev ? { ...prev, status: 'item_delivered' } : null);
        // Refresh order data (without showing loading spinner)
        await fetchOrder(false);
      } else {
        setActionError('Failed to deliver item');
        // Revert optimistic update on failure
        if (previousStatus) {
          setOrder(prev => prev ? { ...prev, status: previousStatus } : null);
        }
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to deliver item');
      // Revert optimistic update on error
      if (previousStatus) {
        setOrder(prev => prev ? { ...prev, status: previousStatus } : null);
      }
      // Refresh order to get correct status on error
      await fetchOrder(false);
    } finally {
      setActionLoading(false);
      isActionInProgress.current = false;
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

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Order Details</h1>
        <div>Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Order Details</h1>
        <div style={{ color: 'red' }}>Error: {error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Order Details</h1>
        <div>Order not found</div>
      </div>
    );
  }

  const containerStyle = {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const sectionStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '8px'
  };

  const detailRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6'
  };

  const labelStyle = {
    fontWeight: '500',
    color: '#666'
  };

  const valueStyle = {
    color: '#333',
    fontWeight: '500'
  };

  const statusBadgeStyle = {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    backgroundColor: getStatusColor(order.status)
  };

  const listingInfoStyle = {
    marginTop: '12px'
  };

  return (
    <div style={containerStyle}>
      <h1>Order Details</h1>

      {/* Order Timeline */}
      <OrderTimeline order={order} />

      {/* Order Status Section */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Order Information</div>
        <div style={detailRowStyle}>
          <span style={labelStyle}>Order ID:</span>
          <span style={{ ...valueStyle, fontFamily: 'monospace', fontSize: '12px' }}>
            {order._id}
          </span>
        </div>
        <div style={detailRowStyle}>
          <span style={labelStyle}>Status:</span>
          <span style={statusBadgeStyle}>
            {getStatusLabel(order.status)}
          </span>
        </div>
        <div style={detailRowStyle}>
          <span style={labelStyle}>Created:</span>
          <span style={valueStyle}>
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>
        {order.updatedAt && (
          <div style={detailRowStyle}>
            <span style={labelStyle}>Last Updated:</span>
            <span style={valueStyle}>
              {new Date(order.updatedAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Listing Details Section */}
      {order.listing && (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Listing Details</div>
          <div style={listingInfoStyle}>
            <div style={detailRowStyle}>
              <span style={labelStyle}>Title:</span>
              <span style={valueStyle}>
                {order.listing.title || order.listing.itemName || 'N/A'}
              </span>
            </div>
            {order.listing.itemName && (
              <div style={detailRowStyle}>
                <span style={labelStyle}>Item Name:</span>
                <span style={valueStyle}>{order.listing.itemName}</span>
              </div>
            )}
            {order.listing.category && (
              <div style={detailRowStyle}>
                <span style={labelStyle}>Category:</span>
                <span style={valueStyle}>
                  {order.listing.category.charAt(0).toUpperCase() + order.listing.category.slice(1)}
                </span>
              </div>
            )}
            {order.listing.survival && (
              <div style={detailRowStyle}>
                <span style={labelStyle}>Survival:</span>
                <span style={valueStyle}>{order.listing.survival}</span>
              </div>
            )}
            {order.listing.price && (
              <div style={detailRowStyle}>
                <span style={labelStyle}>Price:</span>
                <span style={{ ...valueStyle, color: '#10b981', fontSize: '16px' }}>
                  {formatCurrency(order.listing.price)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Parties Section */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Parties Involved</div>
        <div style={detailRowStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <span style={labelStyle}>Buyer:</span>
              <span style={valueStyle}>
                {order.buyer?.discordUsername || 'Unknown'}
              </span>
            </div>
            {order.buyer?.discordUsername && (
              <a
                href={`https://discord.com/users/${order.buyer?.discordId || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#5865F2',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'inline-block'
                }}
              >
                Contact on Discord
              </a>
            )}
          </div>
        </div>
        <div style={detailRowStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <span style={labelStyle}>Seller:</span>
              <span style={valueStyle}>
                {order.seller?.discordUsername || 'Unknown'}
              </span>
            </div>
            {order.seller?.discordUsername && (
              <a
                href={`https://discord.com/users/${order.seller?.discordId || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#5865F2',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'inline-block'
                }}
              >
                Contact on Discord
              </a>
            )}
          </div>
        </div>
        {order.middleman && (
          <div style={detailRowStyle}>
            <span style={labelStyle}>Middleman:</span>
            <span style={valueStyle}>
              {order.middleman?.discordUsername || 'Unknown'}
            </span>
          </div>
        )}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#1e40af'
        }}>
          <strong>Your Role:</strong> As the assigned middleman, you coordinate communication between buyer and seller. 
          Use the contact buttons above to reach out to each party as needed.
        </div>
      </div>

      {/* Action Buttons Section */}
      {(order.status === 'pending_payment' || order.status === 'paid' || order.status === 'item_collected') && (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Actions</div>
          
          {/* Success Message */}
          {actionMessage && (
            <div style={{
              padding: '12px',
              backgroundColor: '#d1fae5',
              border: '1px solid #86efac',
              borderRadius: '4px',
              color: '#166534',
              marginBottom: '16px'
            }}>
              {actionMessage}
            </div>
          )}

          {/* Error Message */}
          {actionError && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              color: '#991b1b',
              marginBottom: '16px'
            }}>
              {actionError}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {order.status === 'pending_payment' && (
              <button
                onClick={handleMarkPaidClick}
                disabled={actionLoading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.6 : 1
                }}
              >
                {actionLoading ? 'Processing...' : 'Mark Paid'}
              </button>
            )}

            {order.status === 'paid' && (
              <button
                onClick={handleCollectItemClick}
                disabled={actionLoading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.6 : 1
                }}
              >
                {actionLoading ? 'Processing...' : 'Collect Item'}
              </button>
            )}

            {order.status === 'item_collected' && (
              <button
                onClick={handleDeliverItemClick}
                disabled={actionLoading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.6 : 1
                }}
              >
                {actionLoading ? 'Processing...' : 'Deliver Item'}
              </button>
            )}
          </div>

          {/* Status Info */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#1e40af'
          }}>
            {order.status === 'pending_payment' && (
              <div>
                <strong>Next Step:</strong> Mark the order as paid once you receive payment from the buyer.
              </div>
            )}
            {order.status === 'paid' && (
              <div>
                <strong>Next Step:</strong> Collect the item from the seller before marking as collected.
              </div>
            )}
            {order.status === 'item_collected' && (
              <div>
                <strong>Next Step:</strong> Deliver the item to the buyer and mark as delivered.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completed/Cancelled Status Message */}
      {(order.status === 'completed' || order.status === 'cancelled' || order.status === 'item_delivered') && (
        <div style={sectionStyle}>
          <div style={{
            padding: '16px',
            backgroundColor: order.status === 'completed' ? '#d1fae5' : order.status === 'cancelled' ? '#fee2e2' : '#eff6ff',
            border: `1px solid ${order.status === 'completed' ? '#86efac' : order.status === 'cancelled' ? '#fecaca' : '#bfdbfe'}`,
            borderRadius: '4px',
            color: order.status === 'completed' ? '#166534' : order.status === 'cancelled' ? '#991b1b' : '#1e40af',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            {order.status === 'completed' && 'Order completed successfully'}
            {order.status === 'cancelled' && 'Order has been cancelled'}
            {order.status === 'item_delivered' && 'Item delivered. Waiting for admin to complete the order.'}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null })}
        onConfirm={() => {
          if (confirmModal.action === 'markPaid') {
            handleMarkPaid();
          } else if (confirmModal.action === 'collect') {
            handleCollectItem();
          } else if (confirmModal.action === 'deliver') {
            handleDeliverItem();
          }
        }}
        title={
          confirmModal.action === 'markPaid' 
            ? 'Mark Order as Paid' 
            : confirmModal.action === 'collect' 
            ? 'Collect Item' 
            : 'Deliver Item'
        }
        message={
          confirmModal.action === 'markPaid'
            ? 'Are you sure the buyer has completed the payment? This will move the order to the next stage.'
            : confirmModal.action === 'collect'
            ? 'Are you sure you have collected the item from the seller? This will move the order to the delivery stage.'
            : 'Are you sure you have delivered the item to the buyer? This will complete the order delivery process.'
        }
        confirmText={
          confirmModal.action === 'markPaid'
            ? 'Mark as Paid'
            : confirmModal.action === 'collect'
            ? 'Collect Item'
            : 'Deliver Item'
        }
        isDestructive={false}
        isLoading={actionLoading}
      />
    </div>
  );
}

export default OrderDetail;

