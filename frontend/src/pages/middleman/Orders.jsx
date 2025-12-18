import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import SkeletonCard from '../../components/skeletons/SkeletonCard';
import { useResponsive } from '../../hooks/useResponsive';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending_payment', 'paid', 'item_collected', 'item_delivered', 'completed'
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'oldest', 'date'
  const { isMobile, isTablet } = useResponsive();

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

  // Set up polling (30 seconds interval)
  usePolling(fetchOrders, 30000);

  // Filter and sort orders
  useEffect(() => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sort
    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, sortBy]);

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
    margin: '0 auto',
    padding: isMobile ? '16px' : isTablet ? '20px' : '24px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '700',
    marginBottom: isMobile ? '8px' : '12px'
  };

  const subtitleStyle = {
    color: '#9ca3af',
    fontSize: isMobile ? '13px' : '14px',
    marginBottom: isMobile ? '16px' : '20px'
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
    padding: isMobile ? '14px' : '18px',
    marginBottom: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'stretch' : 'center',
    gap: isMobile ? '14px' : '24px'
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

  const cardContentStyle = {
    flex: 1,
    minWidth: 0
  };

  const cardTextStyle = {
    color: '#b9bbbe',
    fontSize: '14px',
    marginBottom: '8px',
    lineHeight: '1.5',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const cardTitleStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '17px' : '19px',
    fontWeight: '600',
    marginBottom: '12px',
    lineHeight: '1.4'
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
    padding: isMobile ? '10px 16px' : '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: isMobile ? '100%' : 'auto',
    flexShrink: 0,
    whiteSpace: 'nowrap'
  };

  const rightSideStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMobile ? 'stretch' : 'flex-end',
    gap: '8px',
    flexShrink: 0
  };

  const filtersContainerStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: isMobile ? '14px' : '18px',
    marginBottom: isMobile ? '16px' : '24px'
  };

  const tabsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: isMobile ? '12px' : '16px'
  };

  const tabStyle = (isActive) => ({
    padding: isMobile ? '8px 12px' : '10px 16px',
    backgroundColor: isActive ? '#fbbf24' : '#1a1f35',
    color: isActive ? '#0a0e27' : '#b8bcc8',
    border: `1px solid ${isActive ? '#fbbf24' : '#2d3447'}`,
    borderRadius: '8px',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    flex: isMobile ? '1 1 auto' : 'none'
  });

  const sortContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: isMobile ? '4px' : '8px'
  };

  const sortLabelStyle = {
    color: '#b8bcc8',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '500',
    minWidth: '60px'
  };

  const sortSelectStyle = {
    padding: isMobile ? '8px 14px' : '10px 16px',
    backgroundColor: '#1a1f35',
    border: '1px solid #2d3447',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: isMobile ? '14px' : '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: isMobile ? '38px' : '40px',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fbbf24' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px',
    paddingRight: isMobile ? '36px' : '36px',
    boxSizing: 'border-box',
    outline: 'none',
    minWidth: isMobile ? '150px' : '200px'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Assigned Orders</h1>
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
        <h1 style={titleStyle}>Assigned Orders</h1>
        <div style={errorStyle}>Error: {error}</div>
      </div>
    );
  }

  const statusTabs = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending_payment', label: 'Pending Payment' },
    { value: 'paid', label: 'Paid' },
    { value: 'item_collected', label: 'Collect Item' },
    { value: 'item_delivered', label: 'Deliver Item' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Assigned Orders</h1>

      {/* Filters and Sort Section */}
      {orders.length > 0 && (
        <div style={filtersContainerStyle}>
          {/* Status Tabs */}
          <div style={tabsContainerStyle}>
            {statusTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                style={tabStyle(statusFilter === tab.value)}
                onMouseEnter={(e) => {
                  if (statusFilter !== tab.value) {
                    e.target.style.backgroundColor = '#252b42';
                    e.target.style.borderColor = '#2d3447';
                    e.target.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (statusFilter !== tab.value) {
                    e.target.style.backgroundColor = '#1a1f35';
                    e.target.style.borderColor = '#2d3447';
                    e.target.style.color = '#b8bcc8';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={sortContainerStyle}>
            <span style={sortLabelStyle}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={sortSelectStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#fbbf24';
                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2d3447';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="date">By Update Date</option>
            </select>
            <span style={{ color: '#6b7280', fontSize: '13px', marginLeft: 'auto' }}>
              Showing {filteredOrders.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div style={emptyStyle}>
          <div style={emptyTitleStyle}>No assigned orders</div>
          <div>
            You don't have any orders assigned to you yet. Orders will appear here once an admin assigns them to you.
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={emptyStyle}>
          <div style={emptyTitleStyle}>No orders found</div>
          <div>
            {statusFilter !== 'all' 
              ? `No orders with status "${statusTabs.find(t => t.value === statusFilter)?.label || statusFilter}"`
              : 'You don\'t have any orders assigned to you yet. Orders will appear here once an admin assigns them to you.'}
          </div>
        </div>
      ) : (
        <div style={contentStyle}>
          {filteredOrders.map((order) => (
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
              <div style={cardContentStyle}>
                <h3 style={cardTitleStyle}>
                  {order.listing?.title || order.listing?.itemName || 'Unknown Item'}
                </h3>
                
                <div style={cardTextStyle}>
                  <span style={{ minWidth: '80px', color: '#6b7280', fontSize: '13px' }}>Order ID:</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{order._id.substring(0, 8)}...</span>
                </div>

                {order.quantity && (
                  <div style={cardTextStyle}>
                    <span style={{ minWidth: '80px', color: '#6b7280', fontSize: '13px' }}>Quantity:</span>
                    <span>{order.quantity} unit{order.quantity > 1 ? 's' : ''}</span>
                  </div>
                )}

                {order.totalPrice && (
                  <div style={{
                    color: '#fbbf24',
                    fontSize: isMobile ? '17px' : '19px',
                    fontWeight: '700',
                    marginTop: '6px',
                    marginBottom: '8px'
                  }}>
                    {formatCurrency(order.totalPrice)}
                    {order.unitPrice && order.quantity > 1 && (
                      <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '400', marginLeft: '8px' }}>
                        ({order.quantity} × {formatCurrency(order.unitPrice)})
                      </span>
                    )}
                  </div>
                )}

                <div style={cardTextStyle}>
                  <span style={{ minWidth: '80px', color: '#6b7280', fontSize: '13px' }}>Buyer:</span>
                  <span>{order.buyer?.discordUsername || 'Unknown'}</span>
                </div>

                <div style={cardTextStyle}>
                  <span style={{ minWidth: '80px', color: '#6b7280', fontSize: '13px' }}>Seller:</span>
                  <span>{order.seller?.discordUsername || 'Unknown'}</span>
                </div>

                <div style={cardTextStyle}>
                  <span style={{ minWidth: '80px', color: '#6b7280', fontSize: '13px' }}>Status:</span>
                  <span style={statusBadgeStyle(order.status)}>{getStatusLabel(order.status)}</span>
                </div>

                <div style={cardTextStyle}>
                  <span style={{ minWidth: '80px', color: '#6b7280', fontSize: '13px' }}>Created:</span>
                  <span style={{ fontSize: '13px' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                </div>

                {order.status === 'disputed' && (
                  <div style={{
                    marginTop: '10px',
                    padding: '9px 14px',
                    backgroundColor: '#7f1d1d',
                    border: '1px solid #ef4444',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    ⚠️ Disputed
                  </div>
                )}
              </div>

              <div style={rightSideStyle}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewOrder(order._id);
                  }}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;

