import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import OrderTimeline from '../../components/OrderTimeline';
import DisputeModal from '../../components/DisputeModal';

function SellerOrderDetail() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [commissionPercent, setCommissionPercent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [disputeError, setDisputeError] = useState(null);
  const [disputeSuccess, setDisputeSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [orderRes, commissionRes] = await Promise.all([
          apiClient.get(`/api/auth/orders/${orderId}`),
          apiClient.get('/api/auth/seller/commission')
        ]);

        if (orderRes.data.success && orderRes.data.order) {
          setOrder(orderRes.data.order);
        } else {
          setError('Order not found');
        }

        if (commissionRes.data.success) {
          setCommissionPercent(commissionRes.data.commissionPercent);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchData();
    }
  }, [orderId]);

  const handleRaiseDispute = () => {
    setDisputeModalOpen(true);
    setDisputeError(null);
    setDisputeSuccess(null);
  };

  const handleSubmitDispute = async ({ reason, description }) => {
    try {
      setSubmittingDispute(true);
      setDisputeError(null);
      setDisputeSuccess(null);

      const response = await apiClient.post(`/api/auth/orders/${orderId}/dispute`, {
        reason,
        description
      });

      if (response.data.success) {
        setDisputeSuccess(response.data.message || 'Dispute raised successfully');
        setDisputeModalOpen(false);
        // Refresh order data to show dispute status
        const orderResponse = await apiClient.get(`/api/auth/orders/${orderId}`);
        if (orderResponse.data.success) {
          setOrder(orderResponse.data.order);
        }
      }
    } catch (err) {
      setDisputeError(err.response?.data?.message || 'Failed to raise dispute');
    } finally {
      setSubmittingDispute(false);
    }
  };

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

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '24px'
  };

  const sectionStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 0',
    borderBottom: '1px solid #2d3447',
    minHeight: '44px',
    boxSizing: 'border-box'
  };

  const infoLabelStyle = {
    color: '#b8bcc8',
    fontSize: '14px',
    fontWeight: '500',
    minWidth: '140px',
    flexShrink: 0
  };

  const infoValueStyle = {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1
  };

  const statusBadgeStyle = (status) => {
    const colors = {
      pending_payment: '#f59e0b',
      paid: '#3b82f6',
      item_collected: '#8b5cf6',
      item_delivered: '#10b981',
      completed: '#059669',
      cancelled: '#ef4245',
      disputed: '#ef4444'
    };
    return {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: colors[status] || '#6b7280'
    };
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px', color: '#b8bcc8' }}>
          Loading order details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{
          backgroundColor: '#ed4245',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          Error: {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={containerStyle}>
        <div style={{
          backgroundColor: '#ed4245',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          Order not found
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Order Details</h1>

      {/* Order Timeline */}
      <OrderTimeline order={order} />

      <div style={sectionStyle}>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Order ID:</span>
          <span style={infoValueStyle}>{order._id}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Status:</span>
          <span style={statusBadgeStyle(order.status)}>{getStatusLabel(order.status)}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Buyer:</span>
          <span style={{ ...infoValueStyle, color: '#6b7280' }}>Hidden for privacy</span>
        </div>
        {order.middleman ? (
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Middleman:</span>
            <span style={{ ...infoValueStyle, color: '#6b7280' }}>Hidden for privacy</span>
          </div>
        ) : (
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Middleman:</span>
            <span style={{ ...infoValueStyle, color: '#b8bcc8' }}>Not assigned yet</span>
          </div>
        )}
        {order.listing && (
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Item:</span>
            <span style={infoValueStyle}>{order.listing.title || order.listing.itemName || 'N/A'}</span>
          </div>
        )}
        {order.quantity && (
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Quantity:</span>
            <span style={infoValueStyle}>
              {order.quantity} unit{order.quantity > 1 ? 's' : ''}
            </span>
          </div>
        )}
        {order.unitPrice && (
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Unit Price:</span>
            <span style={{ ...infoValueStyle, color: '#fbbf24' }}>
              ₹{order.unitPrice.toLocaleString('en-IN')}
            </span>
          </div>
        )}
        {order.totalPrice && (
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Total Price:</span>
            <span style={{ ...infoValueStyle, color: '#fbbf24', fontSize: '18px', fontWeight: '700' }}>
              ₹{order.totalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        )}
        <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
          <span style={infoLabelStyle}>Created:</span>
          <span style={infoValueStyle}>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Commission Breakdown - Show for all orders */}
      {order.totalPrice && commissionPercent !== null && order.status !== 'cancelled' && (
        <div style={{
          ...sectionStyle,
          backgroundColor: '#1a1f35',
          borderColor: order.status === 'completed' ? '#fbbf24' : '#2d3447'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>
            💰 {order.status === 'completed' ? 'Payment Breakdown' : 'Expected Payment Breakdown'}
          </h3>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Gross Total:</span>
            <span style={{ ...infoValueStyle, color: '#fbbf24', fontSize: '16px', fontWeight: '600' }}>
              ₹{order.totalPrice.toLocaleString('en-IN')}
            </span>
          </div>
          {order.unitPrice && order.quantity && (
            <div style={{ 
              ...infoRowStyle, 
              paddingLeft: '20px', 
              fontSize: '13px', 
              color: '#6b7280',
              paddingTop: '4px',
              paddingBottom: '4px',
              minHeight: 'auto'
            }}>
              <span style={{ ...infoLabelStyle, minWidth: 'auto', color: '#6b7280' }}></span>
              <span style={{ ...infoValueStyle, textAlign: 'left', color: '#6b7280', fontWeight: '400' }}>
                ({order.quantity} × ₹{order.unitPrice.toLocaleString('en-IN')} per unit)
              </span>
            </div>
          )}
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Platform Fee ({commissionPercent}%):</span>
            <span style={{ ...infoValueStyle, color: '#ef4444', fontSize: '16px', fontWeight: '600' }}>
              -₹{order.status === 'completed' && order.commissionAmount !== undefined 
                ? order.commissionAmount.toLocaleString('en-IN')
                : ((order.totalPrice * commissionPercent) / 100).toLocaleString('en-IN')}
            </span>
          </div>
          <div style={{
            ...infoRowStyle,
            borderTop: '2px solid #2d3447',
            paddingTop: '16px',
            marginTop: '8px',
            borderBottom: 'none'
          }}>
            <span style={{ ...infoLabelStyle, fontSize: '14px', fontWeight: '700' }}>
              {order.status === 'completed' ? 'Your Payout:' : 'You Will Receive:'}
            </span>
            <span style={{ ...infoValueStyle, color: '#10b981', fontSize: '20px', fontWeight: '700' }}>
              ₹{order.status === 'completed' && order.sellerReceivable !== undefined
                ? order.sellerReceivable.toLocaleString('en-IN')
                : (order.totalPrice - (order.totalPrice * commissionPercent) / 100).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      <div style={{
        ...sectionStyle,
        backgroundColor: '#1a1f35',
        borderColor: '#5865f2'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
          Communication Privacy
        </h3>
        <p style={{ color: '#b8bcc8', marginBottom: 0, fontSize: '14px', lineHeight: '1.6' }}>
          Only the assigned middleman can coordinate communication between buyer and seller.
          All communication happens through the middleman to ensure a secure transaction.
        </p>
      </div>

      {/* Dispute Status */}
      {order.dispute && (
        <div style={{
          ...sectionStyle,
          backgroundColor: order.dispute.status === 'open' ? '#1a1f35' : '#1e2338',
          borderColor: order.dispute.status === 'open' ? '#ef4444' : '#2d3447'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
            {order.dispute.status === 'open' ? '⚠️ Active Dispute' : '✅ Dispute Resolved'}
          </h3>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#b8bcc8', fontSize: '14px', marginBottom: '8px' }}>
              <strong style={{ color: '#ffffff' }}>Reason:</strong> {order.dispute.reason}
            </div>
            {order.dispute.description && (
              <div style={{ color: '#b8bcc8', fontSize: '14px', marginBottom: '8px' }}>
                <strong style={{ color: '#ffffff' }}>Description:</strong> {order.dispute.description}
              </div>
            )}
            <div style={{ color: '#6b7280', fontSize: '12px' }}>
              Raised on: {new Date(order.dispute.createdAt).toLocaleString('en-IN')}
            </div>
            {order.dispute.status === 'resolved' && order.dispute.resolutionNote && (
              <div style={{ 
                marginTop: '12px', 
                padding: '12px', 
                backgroundColor: '#1e2338', 
                borderRadius: '8px',
                color: '#b8bcc8',
                fontSize: '14px'
              }}>
                <strong style={{ color: '#10b981' }}>Resolution:</strong> {order.dispute.resolutionNote}
              </div>
            )}
          </div>
          {order.dispute.status === 'open' && (
            <div style={{
              padding: '12px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              This order is frozen. All actions are locked until an admin resolves the dispute.
            </div>
          )}
        </div>
      )}

      {/* Success/Error Messages */}
      {disputeSuccess && (
        <div style={{
          ...sectionStyle,
          backgroundColor: '#10b981',
          color: '#ffffff',
          padding: '16px',
          marginBottom: '24px'
        }}>
          {disputeSuccess}
        </div>
      )}

      {disputeError && (
        <div style={{
          ...sectionStyle,
          backgroundColor: '#ef4444',
          color: '#ffffff',
          padding: '16px',
          marginBottom: '24px'
        }}>
          {disputeError}
        </div>
      )}

      {/* Raise Dispute Button */}
      {order.status !== 'completed' && 
       order.status !== 'cancelled' && 
       order.status !== 'disputed' && 
       !order.dispute && (
        <div style={{ marginTop: '24px' }}>
          <button
            onClick={handleRaiseDispute}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc2626';
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Raise Dispute
          </button>
        </div>
      )}

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        onSubmit={handleSubmitDispute}
        isLoading={submittingDispute}
      />
    </div>
  );
}

export default SellerOrderDetail;

