import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/auth/middleman/orders');

      if (response.data.success) {
        setOrders(response.data.orders || []);
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

  // Set up polling (7 seconds interval)
  usePolling(fetchOrders, 7000);

  const handleViewOrder = (orderId) => {
    navigate(`/middleman/orders/${orderId}`);
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

  const getStatusLabel = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Assigned Orders</h1>
        <div>Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Assigned Orders</h1>
        <div style={{ color: 'red' }}>Error: {error}</div>
      </div>
    );
  }

  const containerStyle = {
    padding: '20px'
  };

  const listStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px'
  };

  const orderCardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const orderInfoStyle = {
    flex: 1
  };

  const orderIdStyle = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
    fontFamily: 'monospace'
  };

  const itemNameStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333'
  };

  const detailStyle = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '4px'
  };

  const statusBadgeStyle = (status) => ({
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#fff',
    backgroundColor: getStatusColor(status),
    marginRight: '12px'
  });

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer'
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

  const emptyStateTitleStyle = {
    fontSize: '24px',
    marginBottom: '12px',
    color: '#333'
  };

  const emptyStateTextStyle = {
    fontSize: '16px'
  };

  return (
    <div style={containerStyle}>
      <h1>Assigned Orders</h1>

      {orders.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={emptyStateTitleStyle}>No assigned orders</div>
          <div style={emptyStateTextStyle}>
            You don't have any orders assigned to you yet. Orders will appear here once an admin assigns them to you.
          </div>
        </div>
      ) : (
        <div style={listStyle}>
          {orders.map((order) => (
            <div key={order._id} style={orderCardStyle}>
              <div style={orderInfoStyle}>
                <div style={orderIdStyle}>Order ID: {order._id.substring(0, 8)}...</div>
                <div style={itemNameStyle}>
                  {order.listing?.title || order.listing?.itemName || 'N/A'}
                </div>
                <div style={detailStyle}>
                  <strong>Buyer:</strong> {order.buyer?.discordUsername || 'Unknown'}
                </div>
                <div style={detailStyle}>
                  <strong>Seller:</strong> {order.seller?.discordUsername || 'Unknown'}
                </div>
                <div style={detailStyle}>
                  <strong>Created:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={statusBadgeStyle(order.status)}>
                  {getStatusLabel(order.status)}
                </span>
                <button onClick={() => handleViewOrder(order._id)} style={buttonStyle}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;

