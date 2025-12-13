import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import OrderTimeline from '../../components/OrderTimeline';

function OrderDetail() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleRaiseDispute = () => {
    // TODO: Implement dispute logic
    console.log('Raise dispute clicked for order:', orderId);
  };

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
      cancelled: '#ef4245'
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
        <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
          <span style={infoLabelStyle}>Created:</span>
          <span style={infoValueStyle}>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
        </div>
      </div>

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

      {order.status !== 'completed' && order.status !== 'cancelled' && (
        <div style={{ marginTop: '24px' }}>
          <button
            onClick={handleRaiseDispute}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ef4245',
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
              e.target.style.backgroundColor = '#ef4245';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Raise Dispute
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;

