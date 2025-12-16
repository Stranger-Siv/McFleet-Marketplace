import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import SkeletonTableRow from '../../components/skeletons/SkeletonTableRow';
import EditListingModal from '../../components/EditListingModal';
import LoadingSpinner from '../../components/LoadingSpinner';

function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStock, setEditingStock] = useState(null);
  const [stockValue, setStockValue] = useState('');
  const [stockError, setStockError] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [pausingListing, setPausingListing] = useState(null);
  const [deletingListing, setDeletingListing] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [listingsWithActiveOrders, setListingsWithActiveOrders] = useState(new Set());
  const [checkingOrders, setCheckingOrders] = useState(false);

  // Check for active orders for all listings
  const checkActiveOrdersForListings = async () => {
    try {
      setCheckingOrders(true);
      const response = await apiClient.get('/api/auth/seller/orders');
      if (response.data.success) {
        const activeStatuses = ['pending_payment', 'paid', 'item_collected', 'item_delivered', 'disputed'];
        const activeOrdersSet = new Set();
        
        response.data.orders.forEach(order => {
          if (activeStatuses.includes(order.status) && order.listing) {
            const listingId = typeof order.listing === 'object' ? order.listing._id : order.listing;
            activeOrdersSet.add(listingId);
          }
        });
        
        setListingsWithActiveOrders(activeOrdersSet);
      }
    } catch (err) {
      console.error('Error checking active orders:', err);
    } finally {
      setCheckingOrders(false);
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/auth/seller/listings');

      if (response.data.success) {
        const fetchedListings = response.data.listings || [];
        setListings(fetchedListings);
        
        // Check active orders after listings are loaded
        if (fetchedListings.length > 0) {
          checkActiveOrdersForListings();
        }
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


  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'paused':
        return 'Paused';
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981'; // green
      case 'paused':
        return '#f59e0b'; // orange/yellow
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

  const handleEditClick = (listing) => {
    setEditingListing(listing);
    setActionError(null);
  };

  const handleEditSuccess = () => {
    fetchListings();
  };

  const handlePauseResume = async (listing) => {
    try {
      setPausingListing(listing._id);
      setActionError(null);

      const action = listing.status === 'paused' ? 'resume' : 'pause';
      const response = await apiClient.patch(`/api/auth/listings/${listing._id}/pause`, {
        action
      });

      if (response.data.success) {
        fetchListings(); // Refresh listings (this will also re-check active orders)
      } else {
        setActionError('Failed to update listing status');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update listing status';
      setActionError(errorMessage);
    } finally {
      setPausingListing(null);
    }
  };

  const handleDeleteClick = (listing) => {
    setShowDeleteConfirm(listing);
    setActionError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return;

    try {
      setDeletingListing(showDeleteConfirm._id);
      setActionError(null);

      const response = await apiClient.delete(`/api/auth/listings/${showDeleteConfirm._id}`);

      if (response.data.success) {
        setShowDeleteConfirm(null);
        fetchListings(); // Refresh listings
      } else {
        setActionError('Failed to delete listing');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete listing';
      setActionError(errorMessage);
    } finally {
      setDeletingListing(null);
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
                {listingsWithActiveOrders.has(listing._id) && (
                  <div style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    backgroundColor: '#f59e0b',
                    border: '1px solid #d97706',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>⚠️</span>
                    <span>This listing has active or pending orders. Editing, pausing, and deletion are disabled until all orders are completed or cancelled.</span>
                  </div>
                )}
                {actionError && (
                  <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>
                    {actionError}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                <span style={statusBadgeStyle(listing.status)}>
                  {getStatusLabel(listing.status)}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEditClick(listing)}
                    disabled={pausingListing === listing._id || listing.status === 'disabled_by_admin' || listingsWithActiveOrders.has(listing._id)}
                    title={listingsWithActiveOrders.has(listing._id) ? 'Cannot edit: Listing has active or pending orders' : listing.status === 'disabled_by_admin' ? 'Cannot edit: Listing disabled by admin' : 'Edit listing'}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: (pausingListing === listing._id || listing.status === 'disabled_by_admin' || listingsWithActiveOrders.has(listing._id)) ? 'not-allowed' : 'pointer',
                      opacity: (pausingListing === listing._id || listing.status === 'disabled_by_admin' || listingsWithActiveOrders.has(listing._id)) ? 0.6 : 1,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (pausingListing !== listing._id && listing.status !== 'disabled_by_admin' && !listingsWithActiveOrders.has(listing._id)) {
                        e.target.style.backgroundColor = '#2563eb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (pausingListing !== listing._id && listing.status !== 'disabled_by_admin' && !listingsWithActiveOrders.has(listing._id)) {
                        e.target.style.backgroundColor = '#3b82f6';
                      }
                    }}
                  >
                    Edit
                  </button>
                  {(listing.status === 'active' || listing.status === 'paused') && listing.status !== 'disabled_by_admin' && (
                    <button
                      onClick={() => handlePauseResume(listing)}
                      disabled={pausingListing === listing._id || listingsWithActiveOrders.has(listing._id)}
                      title={listingsWithActiveOrders.has(listing._id) ? 'Cannot pause/resume: Listing has active or pending orders' : listing.status === 'paused' ? 'Resume listing' : 'Pause listing'}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: listing.status === 'paused' ? '#10b981' : '#f59e0b',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: (pausingListing === listing._id || listingsWithActiveOrders.has(listing._id)) ? 'not-allowed' : 'pointer',
                        opacity: (pausingListing === listing._id || listingsWithActiveOrders.has(listing._id)) ? 0.6 : 1,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        if (pausingListing !== listing._id && !listingsWithActiveOrders.has(listing._id)) {
                          e.target.style.backgroundColor = listing.status === 'paused' ? '#059669' : '#d97706';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (pausingListing !== listing._id && !listingsWithActiveOrders.has(listing._id)) {
                          e.target.style.backgroundColor = listing.status === 'paused' ? '#10b981' : '#f59e0b';
                        }
                      }}
                    >
                      {pausingListing === listing._id ? (
                        <>
                          <LoadingSpinner size="12px" color="#ffffff" />
                          {listing.status === 'paused' ? 'Resuming...' : 'Pausing...'}
                        </>
                      ) : (
                        listing.status === 'paused' ? 'Resume' : 'Pause'
                      )}
                    </button>
                  )}
                  {listing.status !== 'disabled_by_admin' && (
                    <button
                      onClick={() => handleDeleteClick(listing)}
                      disabled={deletingListing === listing._id || listingsWithActiveOrders.has(listing._id)}
                      title={listingsWithActiveOrders.has(listing._id) ? 'Cannot delete: Listing has active or pending orders' : 'Delete listing'}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: (deletingListing === listing._id || listingsWithActiveOrders.has(listing._id)) ? 'not-allowed' : 'pointer',
                        opacity: (deletingListing === listing._id || listingsWithActiveOrders.has(listing._id)) ? 0.6 : 1,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        if (deletingListing !== listing._id && !listingsWithActiveOrders.has(listing._id)) {
                          e.target.style.backgroundColor = '#dc2626';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deletingListing !== listing._id && !listingsWithActiveOrders.has(listing._id)) {
                          e.target.style.backgroundColor = '#ef4444';
                        }
                      }}
                    >
                      {deletingListing === listing._id ? (
                        <>
                          <LoadingSpinner size="12px" color="#ffffff" />
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Listing Modal */}
      {editingListing && (
        <EditListingModal
          listing={editingListing}
          isOpen={!!editingListing}
          onClose={() => {
            setEditingListing(null);
            setActionError(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowDeleteConfirm(null)}>
          <div style={{
            backgroundColor: '#1e2338',
            border: '1px solid #2d3447',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              Delete Listing?
            </h2>
            <p style={{
              color: '#b8bcc8',
              fontSize: '14px',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              Are you sure you want to delete <strong style={{ color: '#ffffff' }}>{showDeleteConfirm.title}</strong>? This action cannot be undone.
            </p>
            {listingsWithActiveOrders.has(showDeleteConfirm._id) && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#f59e0b',
                border: '1px solid #d97706',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '13px',
                marginBottom: '24px'
              }}>
                ⚠️ This listing has active orders and cannot be deleted.
              </div>
            )}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#b8bcc8',
                  border: '1px solid #2d3447',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2d3447';
                  e.target.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#b8bcc8';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingListing === showDeleteConfirm._id || listingsWithActiveOrders.has(showDeleteConfirm._id)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: (deletingListing === showDeleteConfirm._id || listingsWithActiveOrders.has(showDeleteConfirm._id)) ? 'not-allowed' : 'pointer',
                  opacity: (deletingListing === showDeleteConfirm._id || listingsWithActiveOrders.has(showDeleteConfirm._id)) ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (deletingListing !== showDeleteConfirm._id && !listingsWithActiveOrders.has(showDeleteConfirm._id)) {
                    e.target.style.backgroundColor = '#dc2626';
                  }
                }}
                onMouseLeave={(e) => {
                  if (deletingListing !== showDeleteConfirm._id && !listingsWithActiveOrders.has(showDeleteConfirm._id)) {
                    e.target.style.backgroundColor = '#ef4444';
                  }
                }}
              >
                {deletingListing === showDeleteConfirm._id ? (
                  <>
                    <LoadingSpinner size="14px" color="#ffffff" />
                    Deleting...
                  </>
                ) : (
                  'Delete Listing'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyListings;

