import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import SkeletonTableRow from '../../components/skeletons/SkeletonTableRow';

function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStock, setEditingStock] = useState(null);
  const [stockValue, setStockValue] = useState('');
  const [stockError, setStockError] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/auth/seller/listings');

      if (response.data.success) {
        setListings(response.data.listings || []);
      } else {
        setError('Failed to load listings');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchListings();
  }, []);

  // Set up polling (30 seconds interval)
  usePolling(fetchListings, 30000);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981'; // green
      case 'sold':
        return '#3b82f6'; // blue
      case 'removed':
        return '#ef4444'; // red
      case 'disabled_by_admin':
        return '#f59e0b'; // orange/yellow
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'sold':
        return 'Sold';
      case 'removed':
        return 'Disabled';
      case 'disabled_by_admin':
        return 'Removed by Admin';
      default:
        return status;
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  const handleUpdateStock = async (listingId, newStock) => {
    try {
      setStockError(null);
      const response = await apiClient.put(`/api/auth/listings/${listingId}/stock`, {
        stock: newStock
      });

      if (response.data.success) {
        setEditingStock(null);
        setStockValue('');
        fetchListings(); // Refresh listings
      } else {
        setStockError('Failed to update stock');
      }
    } catch (err) {
      setStockError(err.response?.data?.message || 'Failed to update stock');
    }
  };

  const startEditingStock = (listing) => {
    setEditingStock(listing._id);
    setStockValue(listing.stock || 1);
    setStockError(null);
  };

  const cancelEditingStock = () => {
    setEditingStock(null);
    setStockValue('');
    setStockError(null);
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

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>My Listings</h1>
        <div style={{
          backgroundColor: '#1e2338',
          border: '1px solid #2d3447',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonTableRow key={i} columns={3} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>My Listings</h1>
        <div style={{
          backgroundColor: '#ed4245',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>Error: {error}</div>
      </div>
    );
  }

  const listStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px'
  };

  const listingCardStyle = {
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: '#1e2338',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    marginBottom: '16px'
  };

  const listingInfoStyle = {
    flex: 1
  };

  const listingTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#ffffff'
  };

  const detailStyle = {
    fontSize: '14px',
    color: '#b8bcc8',
    marginBottom: '4px'
  };

  const statusBadgeStyle = (status) => ({
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    backgroundColor: getStatusColor(status)
  });

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#b8bcc8',
    backgroundColor: '#1e2338',
    borderRadius: '12px',
    border: '1px solid #2d3447'
  };

  const emptyStateTitleStyle = {
    fontSize: '24px',
    marginBottom: '12px',
    color: '#ffffff'
  };

  const emptyStateTextStyle = {
    fontSize: '16px'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>My Listings</h1>

      {listings.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={emptyStateTitleStyle}>No listings found</div>
          <div style={emptyStateTextStyle}>
            You haven't created any listings yet. Create your first listing to get started!
          </div>
        </div>
      ) : (
        <div style={{ ...listStyle, ...contentStyle }}>
          {listings.map((listing) => (
            <div 
              key={listing._id} 
              style={listingCardStyle}
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
              <div style={listingInfoStyle}>
                <div style={listingTitleStyle}>{listing.title}</div>
                <div style={detailStyle}>
                  <strong>Price:</strong> {formatCurrency(listing.price)} per unit
                </div>
                <div style={detailStyle}>
                  <strong>Stock:</strong> {
                    editingStock === listing._id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <input
                          type="number"
                          min="1"
                          value={stockValue}
                          onChange={(e) => setStockValue(e.target.value)}
                          style={{
                            width: '80px',
                            padding: '6px 10px',
                            backgroundColor: '#1a1f35',
                            border: '1px solid #2d3447',
                            borderRadius: '6px',
                            color: '#ffffff',
                            fontSize: '14px'
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateStock(listing._id, parseInt(stockValue));
                            }
                          }}
                          onWheel={(e) => e.target.blur()}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                            }
                          }}
                        />
                        <button
                          onClick={() => handleUpdateStock(listing._id, parseInt(stockValue))}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingStock}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#6b7280',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: listing.stock > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                        {listing.stock || 0} units
                      </span>
                    )
                  }
                  {editingStock !== listing._id && (
                    <button
                      onClick={() => startEditingStock(listing)}
                      style={{
                        marginLeft: '12px',
                        padding: '4px 10px',
                        backgroundColor: 'transparent',
                        color: '#fbbf24',
                        border: '1px solid #fbbf24',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                      }}
                    >
                      Update
                    </button>
                  )}
                </div>
                {stockError && editingStock === listing._id && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {stockError}
                  </div>
                )}
                <div style={detailStyle}>
                  <strong>Created:</strong> {new Date(listing.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span style={statusBadgeStyle(listing.status)}>
                  {getStatusLabel(listing.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;

