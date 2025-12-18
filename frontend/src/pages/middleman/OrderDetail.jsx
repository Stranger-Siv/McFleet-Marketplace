import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '../../components/ConfirmationModal';
import OrderTimeline from '../../components/OrderTimeline';
import MiddlemanInstructions from '../../components/MiddlemanInstructions';

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
  const [hasPendingInstructions, setHasPendingInstructions] = useState(false);

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

  // Set up polling (30 seconds interval) - only refresh without showing loading
  // Only poll if orderId exists
  usePolling(() => {
    if (orderId) {
      fetchOrder(false);
    }
  }, 30000, !!orderId);

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending_payment: 'Pending Payment',
      paid: 'Paid',
      item_collected: 'Item Collected',
      item_delivered: 'Item Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled',
      disputed: 'Disputed'
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
      case 'disputed':
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
    maxWidth: '960px',
    margin: '0 auto'
  };

  const pageTitleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#ffffff'
  };

  const sectionStyle = {
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '18px',
    marginBottom: '16px',
    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.45)'
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#e5e7eb',
    borderBottom: '1px solid #1f2937',
    paddingBottom: '6px'
  };

  const detailRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '10px 0',
    borderBottom: '1px solid #1f2937'
  };

  const labelStyle = {
    fontWeight: '500',
    color: '#9ca3af'
  };

  const valueStyle = {
    color: '#e5e7eb',
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
    marginTop: '4px'
  };

  return (
    <div style={containerStyle}>
      <h1 style={pageTitleStyle}>Order Details</h1>

      {/* Order Timeline */}
      <OrderTimeline order={order} />

      <MiddlemanInstructions
        orderId={orderId}
        order={order}
        user={user}
        allowCreate={true}
        tone="light"
        onPendingChange={setHasPendingInstructions}
      />

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
            {order.quantity && (
              <div style={detailRowStyle}>
                <span style={labelStyle}>Quantity:</span>
                <span style={valueStyle}>
                  {order.quantity} unit{order.quantity > 1 ? 's' : ''}
                </span>
              </div>
            )}
            {order.unitPrice && (
              <div style={detailRowStyle}>
                <span style={labelStyle}>Unit Price:</span>
                <span style={{ ...valueStyle, color: '#10b981', fontSize: '16px' }}>
                  {formatCurrency(order.unitPrice)}
                </span>
              </div>
            )}
            {order.totalPrice && (
              <div style={detailRowStyle}>
                <span style={labelStyle}>Total Price:</span>
                <span style={{ ...valueStyle, color: '#fbbf24', fontSize: '18px', fontWeight: '700' }}>
                  {formatCurrency(order.totalPrice)}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <span style={labelStyle}>Buyer:</span>
              <span style={{ ...valueStyle, marginLeft: '6px' }}>
                {order.buyer?.discordUsername || 'Unknown'}
              </span>
            </div>
            {order.buyer?.discordUsername && (
              <a
                href={`https://discord.com/users/${order.buyer?.discordId || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#5865F2',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '100%',
                  marginTop: '6px'
                }}
              >
                <span>Contact on Discord</span>
              </a>
            )}
          </div>
        </div>
        <div style={detailRowStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <span style={labelStyle}>Seller:</span>
              <span style={{ ...valueStyle, marginLeft: '6px' }}>
                {order.seller?.discordUsername || 'Unknown'}
              </span>
            </div>
            {order.seller?.discordUsername && (
              <a
                href={`https://discord.com/users/${order.seller?.discordId || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 14px',
                  backgroundColor: '#5865F2',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '100%',
                  marginTop: '6px'
                }}
              >
                <span>Contact on Discord</span>
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
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#0b1120',
          border: '1px dashed #374151',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#9ca3af'
        }}>
          <strong>Your Role:</strong> As the assigned middleman, you coordinate communication between buyer and seller. 
          Use the contact buttons above to reach out to each party as needed.
        </div>
      </div>

      {/* Action Buttons Section */}
      {(order.status === 'pending_payment' || order.status === 'paid' || order.status === 'item_collected') && !order.dispute && (
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
                disabled={actionLoading || hasPendingInstructions}
                style={{
                  padding: '12px 24px',
                  backgroundColor: actionLoading || hasPendingInstructions ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: actionLoading || hasPendingInstructions ? 'not-allowed' : 'pointer',
                  opacity: actionLoading || hasPendingInstructions ? 0.6 : 1
                }}
              >
                {actionLoading ? 'Processing...' : hasPendingInstructions ? 'Pending instruction' : 'Mark Paid'}
              </button>
            )}

            {order.status === 'paid' && (
              <button
                onClick={handleCollectItemClick}
                disabled={actionLoading || hasPendingInstructions}
                style={{
                  padding: '12px 24px',
                  backgroundColor: actionLoading || hasPendingInstructions ? '#9ca3af' : '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: actionLoading || hasPendingInstructions ? 'not-allowed' : 'pointer',
                  opacity: actionLoading || hasPendingInstructions ? 0.6 : 1
                }}
              >
                {actionLoading ? 'Processing...' : hasPendingInstructions ? 'Pending instruction' : 'Collect Item'}
              </button>
            )}

            {order.status === 'item_collected' && (
              <button
                onClick={handleDeliverItemClick}
                disabled={actionLoading || hasPendingInstructions}
                style={{
                  padding: '12px 24px',
                  backgroundColor: actionLoading || hasPendingInstructions ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: actionLoading || hasPendingInstructions ? 'not-allowed' : 'pointer',
                  opacity: actionLoading || hasPendingInstructions ? 0.6 : 1
                }}
              >
                {actionLoading ? 'Processing...' : hasPendingInstructions ? 'Pending instruction' : 'Deliver Item'}
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
            {hasPendingInstructions && (
              <div style={{ marginTop: '8px', color: '#b45309' }}>
                Pending instruction must be acknowledged before progressing the order.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dispute Status Section */}
      {order.dispute && (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            {order.dispute.status === 'open' ? '⚠️ Active Dispute' : '✅ Dispute Resolved'}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={detailRowStyle}>
              <span style={labelStyle}>Reason:</span>
              <span style={valueStyle}>{order.dispute.reason}</span>
            </div>
            {order.dispute.description && (
              <div style={detailRowStyle}>
                <span style={labelStyle}>Description:</span>
                <span style={valueStyle}>{order.dispute.description}</span>
              </div>
            )}
            <div style={detailRowStyle}>
              <span style={labelStyle}>Raised By:</span>
              <span style={valueStyle}>
                {order.dispute.raisedBy?.discordUsername || 'Unknown'}
              </span>
            </div>
            <div style={detailRowStyle}>
              <span style={labelStyle}>Status:</span>
              <span style={{
                ...statusBadgeStyle,
                backgroundColor: order.dispute.status === 'open' ? '#ef4444' : '#10b981'
              }}>
                {order.dispute.status === 'open' ? 'Open' : 'Resolved'}
              </span>
            </div>
            <div style={detailRowStyle}>
              <span style={labelStyle}>Raised On:</span>
              <span style={valueStyle}>
                {new Date(order.dispute.createdAt).toLocaleString()}
              </span>
            </div>
            {order.dispute.status === 'resolved' && order.dispute.resolutionNote && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#d1fae5',
                border: '1px solid #86efac',
                borderRadius: '4px',
                color: '#166534',
                fontSize: '14px'
              }}>
                <strong>Resolution:</strong> {order.dispute.resolutionNote}
              </div>
            )}
          </div>
          {order.dispute.status === 'open' && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#991b1b',
              fontWeight: '500'
            }}>
              ⚠️ This order is frozen. All actions are locked until an admin resolves the dispute.
            </div>
          )}
        </div>
      )}

      {/* Completed/Cancelled/Disputed Status Message */}
      {(order.status === 'completed' || order.status === 'cancelled' || order.status === 'item_delivered' || order.status === 'disputed') && (
        <div style={sectionStyle}>
          <div style={{
            padding: '16px',
            backgroundColor: order.status === 'completed' ? '#d1fae5' : order.status === 'cancelled' ? '#fee2e2' : order.status === 'disputed' ? '#fee2e2' : '#eff6ff',
            border: `1px solid ${order.status === 'completed' ? '#86efac' : order.status === 'cancelled' ? '#fecaca' : order.status === 'disputed' ? '#fecaca' : '#bfdbfe'}`,
            borderRadius: '4px',
            color: order.status === 'completed' ? '#166534' : order.status === 'cancelled' ? '#991b1b' : order.status === 'disputed' ? '#991b1b' : '#1e40af',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            {order.status === 'completed' && 'Order completed successfully'}
            {order.status === 'cancelled' && 'Order has been cancelled'}
            {order.status === 'disputed' && 'Order is disputed. All actions are locked.'}
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

