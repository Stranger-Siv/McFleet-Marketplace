import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axios';
import OrderTimeline from '../../components/OrderTimeline';

function AdminOrderDetail() {
  const { orderId } = useParams();
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
          <span style={infoValueStyle}>
            {order.buyer?.discordUsername || 'Unknown'}
            {order.buyer?.discordId && (
              <a
                href={`https://discord.com/users/${order.buyer.discordId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginLeft: '8px',
                  color: '#5865f2',
                  textDecoration: 'none',
                  fontSize: '12px'
                }}
              >
                (Contact)
              </a>
            )}
          </span>
        </div>
        <div style={infoRowStyle}>
          <span style={infoLabelStyle}>Seller:</span>
          <span style={infoValueStyle}>
            {order.seller?.discordUsername || 'Unknown'}
            {order.seller?.discordId && (
              <a
                href={`https://discord.com/users/${order.seller.discordId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginLeft: '8px',
                  color: '#5865f2',
                  textDecoration: 'none',
                  fontSize: '12px'
                }}
              >
                (Contact)
              </a>
            )}
          </span>
        </div>
        {order.middleman ? (
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Middleman:</span>
            <span style={infoValueStyle}>
              {order.middleman?.discordUsername || 'Unknown'}
              {order.middleman?.discordId && (
                <a
                  href={`https://discord.com/users/${order.middleman.discordId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: '8px',
                    color: '#5865f2',
                    textDecoration: 'none',
                    fontSize: '12px'
                  }}
                >
                  (Contact)
                </a>
              )}
            </span>
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
        {order.commissionAmount && (
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Commission:</span>
            <span style={{ ...infoValueStyle, color: '#10b981' }}>
              ₹{order.commissionAmount.toLocaleString('en-IN')}
            </span>
          </div>
        )}
        {order.sellerReceivable && (
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Seller Receivable:</span>
            <span style={{ ...infoValueStyle, color: '#10b981', fontSize: '16px', fontWeight: '600' }}>
              ₹{order.sellerReceivable.toLocaleString('en-IN')}
            </span>
          </div>
        )}
        <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
          <span style={infoLabelStyle}>Created:</span>
          <span style={infoValueStyle}>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;

