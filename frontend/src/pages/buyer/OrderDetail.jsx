import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import OrderTimeline from '../../components/OrderTimeline';
import DisputeModal from '../../components/DisputeModal';
import RatingStars from '../../components/RatingStars';
import MiddlemanInstructions from '../../components/MiddlemanInstructions';

function OrderDetail() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [disputeError, setDisputeError] = useState(null);
  const [disputeSuccess, setDisputeSuccess] = useState(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState(null);
  const [ratingSuccess, setRatingSuccess] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(`/api/auth/orders/${orderId}`);

        if (response.data.success && response.data.order) {
          setOrder(response.data.order);
          // Check if rating already exists
          if (response.data.order.rating) {
            setSelectedRating(response.data.order.rating.rating);
          }
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleRaiseDispute = () => {
    setDisputeModalOpen(true);
    setDisputeError(null);
    setDisputeSuccess(null);
  };

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      setRatingError('Please select a rating');
      return;
    }

    try {
      setSubmittingRating(true);
      setRatingError(null);
      setRatingSuccess(null);

      const response = await apiClient.post(`/api/auth/orders/${orderId}/rate`, {
        rating: selectedRating
      });

      if (response.data.success) {
        setRatingSuccess('Rating submitted successfully!');
        setRatingModalOpen(false);
        // Refresh order to get updated rating
        const orderRes = await apiClient.get(`/api/auth/orders/${orderId}`);
        if (orderRes.data.success) {
          setOrder(orderRes.data.order);
        }
      }
    } catch (err) {
      setRatingError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
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

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

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
    padding: '12px 0',
    borderBottom: '1px solid #2d3447'
  };

  const infoLabelStyle = {
    color: '#b8bcc8',
    fontSize: '14px',
    fontWeight: '500'
  };

  const infoValueStyle = {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600'
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

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Order Details</h1>

      {/* Order Timeline */}
      <OrderTimeline order={order} />

      <MiddlemanInstructions
        orderId={orderId}
        order={order}
        user={user}
        allowCreate={false}
        tone="dark"
      />

      <div style={sectionStyle}>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Order ID:</span>
          <span style={infoValueStyle}>{order._id}</span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Status:</span>
          <span style={statusBadgeStyle(order.status)}>{getStatusLabel(order.status)}</span>
        </div>
        {/* Hide Discord info based on role */}
        {user?.role === 'user' && (
          <>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Seller:</span>
              <span style={{ ...infoValueStyle, color: '#6b7280' }}>Hidden for privacy</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Middleman:</span>
              <span style={{ ...infoValueStyle, color: order.middleman ? '#6b7280' : '#b8bcc8' }}>
                {order.middleman ? 'Hidden for privacy' : 'Not assigned yet'}
              </span>
            </div>
          </>
        )}
        {user?.role === 'seller' && (
          <>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Buyer:</span>
              <span style={{ ...infoValueStyle, color: '#6b7280' }}>Hidden for privacy</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Middleman:</span>
              <span style={{ ...infoValueStyle, color: order.middleman ? '#6b7280' : '#b8bcc8' }}>
                {order.middleman ? 'Hidden for privacy' : 'Not assigned yet'}
              </span>
            </div>
          </>
        )}
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Created:</span>
          <span style={infoValueStyle}>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Order Item Details */}
      {order.listing && (
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>
            Order Items
          </h3>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Item:</span>
            <span style={infoValueStyle}>{order.listing.title || order.listing.itemName || 'N/A'}</span>
          </div>
          {order.quantity && (
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Quantity:</span>
              <span style={infoValueStyle}>{order.quantity} unit{order.quantity > 1 ? 's' : ''}</span>
            </div>
          )}
          {order.unitPrice && (
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Unit Price:</span>
              <span style={infoValueStyle}>₹{order.unitPrice.toLocaleString('en-IN')}</span>
            </div>
          )}
          {order.totalPrice && (
            <div style={{ ...infoRowStyle, borderBottom: 'none', paddingTop: '16px', borderTop: '2px solid #2d3447' }}>
              <span style={{ ...infoLabelStyle, fontSize: '16px', fontWeight: '700', color: '#fbbf24' }}>Total Amount:</span>
              <span style={{ ...infoValueStyle, fontSize: '18px', fontWeight: '700', color: '#fbbf24' }}>
                ₹{order.totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          )}
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

      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
          Payment Instructions
        </h3>
        <p style={{ color: '#b8bcc8', marginBottom: 0, fontSize: '14px', lineHeight: '1.6' }}>
          Please make payment via UPI to complete your order. Payment details will be provided by the middleman once assigned.
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

      {/* Rate Seller Section - Only for completed orders */}
      {order.status === 'completed' && 
        order.buyer?._id === user?.userId && 
        !order.dispute && (
          <div style={{
            ...sectionStyle,
            backgroundColor: '#1a1f35',
            borderColor: order.rating ? '#2d3447' : '#fbbf24'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>
              {order.rating ? '⭐ Your Rating' : 'Rate Seller'}
            </h3>
            {order.rating ? (
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <RatingStars rating={order.rating.rating} disabled={true} size="28px" />
                </div>
                <div style={{ color: '#6b7280', fontSize: '13px' }}>
                  Rated on {new Date(order.rating.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: '#b8bcc8', fontSize: '14px', marginBottom: '12px' }}>
                    How would you rate this seller?
                  </div>
                  <RatingStars 
                    rating={selectedRating} 
                    onRatingChange={setSelectedRating}
                    size="32px"
                  />
                </div>
                {ratingError && (
                  <div style={{
                    backgroundColor: '#7f1d1d',
                    color: '#ffffff',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    fontSize: '13px'
                  }}>
                    {ratingError}
                  </div>
                )}
                {ratingSuccess && (
                  <div style={{
                    backgroundColor: '#065f46',
                    color: '#ffffff',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    fontSize: '13px'
                  }}>
                    {ratingSuccess}
                  </div>
                )}
                <button
                  onClick={handleSubmitRating}
                  disabled={submittingRating || selectedRating === 0}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: selectedRating === 0 ? '#2d3447' : '#fbbf24',
                    color: selectedRating === 0 ? '#6b7280' : '#0a0e27',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: selectedRating === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedRating > 0) {
                      e.target.style.backgroundColor = '#f59e0b';
                      e.target.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedRating > 0) {
                      e.target.style.backgroundColor = '#fbbf24';
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {submittingRating ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            )}
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

export default OrderDetail;

