import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import OrderTimeline from '../../components/OrderTimeline';

function SellerOrderDetail() {
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
        {order.listing && (
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Price:</span>
            <span style={{ ...infoValueStyle, color: '#fbbf24' }}>
              ₹{order.listing.price?.toLocaleString('en-IN') || '0'}
            </span>
          </div>
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
    </div>
  );
}

export default SellerOrderDetail;

