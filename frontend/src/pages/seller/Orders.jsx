import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import SkeletonCard from '../../components/skeletons/SkeletonCard';
import { useResponsive } from '../../hooks/useResponsive';

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [commissionPercent, setCommissionPercent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersRes, commissionRes] = await Promise.all([
        apiClient.get('/api/auth/seller/orders'),
        apiClient.get('/api/auth/seller/commission')
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders || []);
      } else {
        setError('Failed to load orders');
      }

      if (commissionRes.data.success) {
        setCommissionPercent(commissionRes.data.commissionPercent);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Set up polling (30 seconds interval)
  usePolling(fetchOrders, 30000);

  const handleViewOrder = (orderId) => {
    navigate(`/seller/orders/${orderId}`);
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

  const getStatusLabel = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '700',
    marginBottom: '24px'
  };

  const loadingStyle = {
    color: '#b9bbbe',
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px'
  };

  const errorStyle = {
    backgroundColor: '#ed4245',
    color: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const emptyStyle = {
    color: '#b9bbbe',
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '16px',
    backgroundColor: '#1e2338',
    borderRadius: '12px',
    border: '1px solid #2d3447'
  };

  const emptyTitleStyle = {
    fontSize: '24px',
    marginBottom: '12px',
    color: '#ffffff'
  };

  const cardStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: isMobile ? '16px' : '20px',
    marginBottom: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    cursor: 'pointer'
  };

  const contentStyle = {
    animation: loading ? 'none' : 'fadeIn 0.4s ease-in'
  };

  // Add fade-in animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const cardTextStyle = {
    color: '#b9bbbe',
    fontSize: '14px',
    marginBottom: '10px',
    lineHeight: '1.5',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const cardTitleStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: '600',
    marginBottom: '14px',
    lineHeight: '1.3'
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: getStatusColor(status),
    color: '#ffffff'
  });

  const buttonStyle = {
    backgroundColor: '#fbbf24',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px',
    transition: 'all 0.2s ease',
    width: isMobile ? '100%' : 'auto'
  };

  const priceStyle = {
    color: '#fbbf24',
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: '700',
    marginTop: '8px'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>My Orders</h1>
        <div>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>My Orders</h1>
        <div style={errorStyle}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={emptyStyle}>
          <div style={emptyTitleStyle}>No orders found</div>
          <div>You haven't received any orders yet. Create listings to start receiving orders!</div>
        </div>
      ) : (
        <div style={contentStyle}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={cardStyle}
              onClick={() => handleViewOrder(order._id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#252b42';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1e2338';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
              }}
            >
              <h3 style={cardTitleStyle}>
                {order.listing?.title || order.listing?.itemName || 'Unknown Item'}
              </h3>
              
              <div style={cardTextStyle}>
                <span style={{ minWidth: '80px', color: '#6b7280' }}>Quantity:</span>
                <span>{order.quantity || 1} unit{order.quantity > 1 ? 's' : ''}</span>
              </div>

              {order.totalPrice && (
                <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                  <div style={priceStyle}>
                    Total: {formatCurrency(order.totalPrice)}
                    {order.unitPrice && order.quantity > 1 && (
                      <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '400', marginLeft: '8px' }}>
                        ({order.quantity} × {formatCurrency(order.unitPrice)})
                      </span>
                    )}
                  </div>
                  {order.status === 'completed' && order.commissionAmount !== undefined && order.sellerReceivable !== undefined ? (
                    <div style={{
                      marginTop: '10px',
                      padding: '10px 14px',
                      backgroundColor: '#1a1f35',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#b8bcc8',
                      border: '1px solid #2d3447'
                    }}>
                      <div style={{ 
                        marginBottom: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>Platform Fee:</span>
                        <span style={{ color: '#ef4444', fontWeight: '600' }}>-{formatCurrency(order.commissionAmount)}</span>
                      </div>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '6px',
                        borderTop: '1px solid #2d3447'
                      }}>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>You Received:</span>
                        <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px' }}>{formatCurrency(order.sellerReceivable)}</span>
                      </div>
                    </div>
                  ) : commissionPercent !== null && order.status !== 'cancelled' && order.status !== 'disputed' ? (
                    <div style={{
                      marginTop: '10px',
                      padding: '10px 14px',
                      backgroundColor: '#1a1f35',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#b8bcc8',
                      border: '1px solid #2d3447'
                    }}>
                      <div style={{ 
                        marginBottom: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>Platform Fee ({commissionPercent}%):</span>
                        <span style={{ color: '#ef4444', fontWeight: '600' }}>-{formatCurrency((order.totalPrice * commissionPercent) / 100)}</span>
                      </div>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '6px',
                        borderTop: '1px solid #2d3447'
                      }}>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>You Will Receive:</span>
                        <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px' }}>{formatCurrency(order.totalPrice - (order.totalPrice * commissionPercent) / 100)}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div style={cardTextStyle}>
                <span style={{ minWidth: '80px', color: '#6b7280' }}>Status:</span>
                <span style={statusBadgeStyle(order.status)}>{getStatusLabel(order.status)}</span>
              </div>
              
              <div style={cardTextStyle}>
                <span style={{ minWidth: '80px', color: '#6b7280' }}>Order Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              
              {order.middleman && (
                <div style={cardTextStyle}>
                  <span style={{ minWidth: '80px', color: '#6b7280' }}>Middleman:</span>
                  <span>Assigned</span>
                </div>
              )}
              {order.status === 'disputed' && (
                <div style={{
                  marginTop: '14px',
                  marginBottom: '14px',
                  padding: '10px 14px',
                  backgroundColor: '#7f1d1d',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  ⚠️ Order is disputed
                </div>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewOrder(order._id);
                }}
                style={{
                  ...buttonStyle,
                  marginTop: order.status === 'disputed' ? '0' : '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f59e0b';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fbbf24';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerOrders;

