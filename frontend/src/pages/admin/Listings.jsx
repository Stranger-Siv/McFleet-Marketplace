import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmationModal from '../../components/ConfirmationModal';

function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, listingId: null, listingTitle: null });

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/auth/admin/listings');

      if (response.data.success && response.data.listings) {
        setListings(response.data.listings);
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

  const handleDisableListingClick = (listingId, listingTitle) => {
    setConfirmModal({
      isOpen: true,
      listingId,
      listingTitle
    });
  };

  const handleDisableListing = async (listingId) => {
    try {
      setActionLoading(prev => ({ ...prev, [listingId]: true }));
      setActionError(null);
      setActionMessage(null);
      setConfirmModal({ isOpen: false, listingId: null, listingTitle: null });

      const response = await apiClient.post(`/api/auth/listings/${listingId}/disable`);

      if (response.data.success) {
        setActionMessage('Listing disabled successfully');
        await fetchListings();
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        setActionError('Failed to disable listing');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to disable listing');
    } finally {
      setActionLoading(prev => ({ ...prev, [listingId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981'; // green
      case 'sold':
        return '#3b82f6'; // blue
      case 'disabled_by_admin':
        return '#f59e0b'; // orange
      case 'removed':
        return '#ef4444'; // red
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
      case 'disabled_by_admin':
        return 'Disabled by Admin';
      case 'removed':
        return 'Removed';
      default:
        return status;
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '24px'
  };

  const messageStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500'
  };

  const successMessageStyle = {
    ...messageStyle,
    backgroundColor: '#10b981',
    color: '#ffffff'
  };

  const errorMessageStyle = {
    ...messageStyle,
    backgroundColor: '#ed4245',
    color: '#ffffff'
  };

  const tableContainerStyle = {
    overflowX: 'auto',
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const thStyle = {
    backgroundColor: '#131829',
    padding: '16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#b8bcc8',
    borderBottom: '1px solid #2d3447',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const tdStyle = {
    padding: '16px',
    borderBottom: '1px solid #2d3447',
    color: '#ffffff',
    fontSize: '14px',
    backgroundColor: '#1e2338'
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: getStatusColor(status)
  });

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease'
  };

  const disableButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f59e0b',
    color: '#0a0e27'
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2d3447',
    color: '#6b7280',
    cursor: 'not-allowed',
    opacity: 0.6
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#b8bcc8',
    backgroundColor: '#1e2338',
    borderRadius: '12px',
    border: '1px solid #2d3447'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Listings Management</h1>
        <div style={{ textAlign: 'center', padding: '40px', color: '#b8bcc8' }}>
          <LoadingSpinner size="32px" /> Loading listings...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Listings Management</h1>
        <div style={errorMessageStyle}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Listings Management</h1>
      <p style={subtitleStyle}>
        Manage all marketplace listings. Disable listings to hide them from buyers.
      </p>

      {/* Success/Error Messages */}
      {actionMessage && (
        <div style={successMessageStyle}>
          {actionMessage}
        </div>
      )}

      {actionError && (
        <div style={errorMessageStyle}>
          {actionError}
        </div>
      )}

      {listings.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '24px', marginBottom: '12px', color: '#ffffff' }}>
            No listings found
          </div>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Seller</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr
                  key={listing._id}
                  style={{
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#252b42';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e2338';
                  }}
                >
                  <td style={tdStyle}>
                    <strong>{listing.title}</strong>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {listing.itemName}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    {listing.seller?.discordUsername || 'Unknown'}
                  </td>
                  <td style={tdStyle}>
                    <strong>{formatCurrency(listing.price)}</strong>
                  </td>
                  <td style={tdStyle}>
                    {listing.category} • {listing.survival}
                  </td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(listing.status)}>
                      {getStatusLabel(listing.status)}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>
                    {listing.status === 'active' ? (
                      <button
                        onClick={() => handleDisableListingClick(listing._id, listing.title)}
                        disabled={actionLoading[listing._id]}
                        style={{
                          ...(actionLoading[listing._id] ? disabledButtonStyle : disableButtonStyle),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          if (!actionLoading[listing._id]) {
                            e.target.style.backgroundColor = '#d97706';
                            e.target.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!actionLoading[listing._id]) {
                            e.target.style.backgroundColor = '#f59e0b';
                            e.target.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        {actionLoading[listing._id] ? (
                          <>
                            <LoadingSpinner size="12px" color="#0a0e27" /> Disabling...
                          </>
                        ) : (
                          'Disable Listing'
                        )}
                      </button>
                    ) : (
                      <span style={{ color: '#6b7280', fontSize: '13px' }}>
                        {listing.status === 'disabled_by_admin' ? 'Disabled' : 'N/A'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, listingId: null, listingTitle: null })}
        onConfirm={() => handleDisableListing(confirmModal.listingId)}
        title="Disable Listing"
        message={`Are you sure you want to disable "${confirmModal.listingTitle}"? This listing will be hidden from buyers and cannot be re-enabled.`}
        confirmText="Disable Listing"
        isDestructive={true}
        isLoading={confirmModal.listingId && actionLoading[confirmModal.listingId]}
      />
    </div>
  );
}

export default Listings;

