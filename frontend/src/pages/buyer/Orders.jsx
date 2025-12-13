import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import SkeletonCard from '../../components/skeletons/SkeletonCard';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/auth/buyer/orders');

      if (response.data.success) {
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

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Set up polling (30 seconds interval)
  usePolling(fetchOrders, 30000);

  const handleViewOrder = (orderId) => {
    navigate(`/buyer/orders/${orderId}`);
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
    padding: '40px',
    fontSize: '16px',
    backgroundColor: '#2f3136',
    borderRadius: '8px',
    border: '1px solid #40444b'
  };

  const cardStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
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
    marginBottom: '8px'
  };

  const cardTitleStyle = {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px'
  };

  const statusBadgeStyle = (status) => {
    const colors = {
      pending_payment: '#faa61a',
      paid: '#3ba55d',
      item_collected: '#5865f2',
      item_delivered: '#3ba55d',
      completed: '#3ba55d',
      cancelled: '#ed4245',
      disputed: '#ed4245'
    };
    return {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: colors[status] || '#72767d',
      color: '#ffffff'
    };
  };

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
    transition: 'all 0.2s ease'
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
        <div style={errorStyle}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={emptyStyle}>No orders found</div>
      ) : (
        <div style={contentStyle}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={cardStyle}
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
              <h3 style={cardTitleStyle}>{order.listing?.title || order.listing?.itemName || 'N/A'}</h3>
              <p style={cardTextStyle}><strong>Order ID:</strong> {order._id}</p>
              <p style={cardTextStyle}>
                <strong>Status:</strong> <span style={statusBadgeStyle(order.status)}>{order.status}</span>
              </p>
              <p style={cardTextStyle}><strong>Created:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <button
                onClick={() => handleViewOrder(order._id)}
                style={buttonStyle}
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

export default Orders;

