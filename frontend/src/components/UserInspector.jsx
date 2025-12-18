import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import LoadingSpinner from './LoadingSpinner';
import useResponsive from '../hooks/useResponsive';

function UserInspector({ userId, isOpen, onClose, onRoleChange }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [changingRole, setChangingRole] = useState(false);
  const [roleChangeError, setRoleChangeError] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState(null);
  const { isMobile, isTablet } = useResponsive();
  const isSmallScreen = isMobile || isTablet;

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData();
    }
  }, [isOpen, userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/api/auth/users/${userId}/inspect`);

      if (response.data.success) {
        setUserData(response.data);
      } else {
        setError('Failed to load user data');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChangeClick = (targetRole) => {
    if (userData.user.role === targetRole) {
      return;
    }
    setNewRole(targetRole);
    setShowRoleModal(true);
    setRoleChangeError(null);
  };

  const handleRoleChangeConfirm = async () => {
    try {
      setChangingRole(true);
      setRoleChangeError(null);

      const response = await apiClient.put(`/api/auth/users/${userId}/role`, {
        role: newRole
      });

      if (response.data.success) {
        await fetchUserData();
        setShowRoleModal(false);
        if (onRoleChange) {
          onRoleChange();
        }
      } else {
        setRoleChangeError('Failed to change role');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to change role';
      setRoleChangeError(errorMessage);
    } finally {
      setChangingRole(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'paused':
        return '#f59e0b';
      case 'sold':
        return '#3b82f6';
      case 'pending_payment':
      case 'paid':
      case 'item_collected':
      case 'item_delivered':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'disputed':
        return '#ef4444';
      case 'cancelled':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  if (!isOpen) return null;

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: isSmallScreen ? '0' : '20px',
    overflowY: 'auto'
  };

  const modalStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: isSmallScreen ? '0' : '16px',
    padding: '0',
    maxWidth: isSmallScreen ? '100%' : '1000px',
    width: '100%',
    maxHeight: isSmallScreen ? '100vh' : '90vh',
    overflowY: 'auto',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  };

  const modalHeaderStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: '#1e2338',
    borderBottom: '1px solid #2d3447',
    padding: isSmallScreen ? '12px 16px' : '20px 32px',
    display: 'flex',
    justifyContent: isSmallScreen ? 'flex-start' : 'space-between',
    alignItems: isSmallScreen ? 'flex-start' : 'center',
    gap: '12px',
    flexDirection: isSmallScreen ? 'column' : 'row'
  };

  const adminBannerStyle = {
    backgroundColor: '#f59e0b',
    color: '#0a0e27',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    border: '2px solid #d97706',
    flex: 1
  };

  const sectionStyle = {
    marginBottom: isSmallScreen ? '20px' : '32px',
    padding: isSmallScreen ? '16px' : '24px',
    backgroundColor: '#131829',
    borderRadius: '12px',
    border: '1px solid #2d3447',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  };

  const sectionTitleStyle = {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  };

  const statGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  };

  const statCardStyle = {
    padding: '20px',
    backgroundColor: '#131829',
    borderRadius: '12px',
    border: '1px solid #2d3447',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
  };

  const statLabelStyle = {
    color: '#9ca3af',
    fontSize: '11px',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600'
  };

  const statValueStyle = {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    wordBreak: 'break-word'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '12px'
  };

  const thStyle = {
    padding: '10px 12px',
    textAlign: 'left',
    color: '#b8bcc8',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    borderBottom: '1px solid #2d3447'
  };

  const tdStyle = {
    padding: '10px 12px',
    color: '#ffffff',
    fontSize: '14px',
    borderBottom: '1px solid #2d3447'
  };

  const badgeStyle = (color) => ({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: color
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

  const closeButtonStyle = {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    color: '#b8bcc8',
    border: '1px solid #2d3447',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  };

  const modalContentStyle = {
    padding: isSmallScreen ? '16px' : '32px'
  };

  // Format User ID for display (show first 8 and last 4 chars)
  const formatUserId = (userId) => {
    if (!userId || userId.length <= 12) return userId;
    return `${userId.substring(0, 8)}...${userId.substring(userId.length - 4)}`;
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header with Banner and Close Button */}
        <div style={modalHeaderStyle}>
          <div style={adminBannerStyle}>
            🔍 Admin View – Read Only Preview
          </div>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2d3447';
              e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#b8bcc8';
            }}
          >
            ✕ Close
          </button>
        </div>

        <div style={modalContentStyle}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#b8bcc8' }}>
            <LoadingSpinner size="32px" color="#fbbf24" />
            <p style={{ marginTop: '16px' }}>Loading user data...</p>
          </div>
        ) : error ? (
          <div style={{
            padding: '20px',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        ) : userData ? (
          <>
            {/* User Info */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>
                User Information
                <span style={badgeStyle(userData.user.role === 'seller' ? '#3b82f6' : '#6b7280')}>
                  {userData.user.role === 'seller' ? 'Seller' : 'Buyer'}
                </span>
                <span style={badgeStyle(userData.user.banned ? '#ef4444' : '#10b981')}>
                  {userData.user.banned ? 'Banned' : 'Active'}
                </span>
              </h2>
              <div style={statGridStyle}>
                <div style={statCardStyle}>
                  <div style={statLabelStyle}>Username</div>
                  <div style={statValueStyle}>{userData.user.discordUsername || 'Unknown'}</div>
                </div>
                <div style={statCardStyle}>
                  <div style={statLabelStyle}>User ID</div>
                  <div 
                    style={{ ...statValueStyle, fontSize: '13px', fontFamily: 'monospace', cursor: 'pointer' }}
                    title={userData.user._id}
                    onClick={() => {
                      navigator.clipboard.writeText(userData.user._id);
                      alert('User ID copied to clipboard!');
                    }}
                  >
                    {formatUserId(userData.user._id)}
                  </div>
                </div>
                <div style={statCardStyle}>
                  <div style={statLabelStyle}>Registered</div>
                  <div style={{ ...statValueStyle, fontSize: '16px' }}>
                    {new Date(userData.user.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {userData.user.role === 'seller' && (
                  <>
                    <div style={statCardStyle}>
                      <div style={statLabelStyle}>Total Deals</div>
                      <div style={statValueStyle}>{userData.user.totalDeals || 0}</div>
                    </div>
                    <div style={statCardStyle}>
                      <div style={statLabelStyle}>Rating</div>
                      <div style={statValueStyle}>
                        {userData.user.averageRating ? userData.user.averageRating.toFixed(1) : 'N/A'}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Role Management */}
              <div style={{
                marginTop: '20px',
                padding: isSmallScreen ? '12px' : '16px',
                backgroundColor: '#1e2338',
                borderRadius: '8px'
              }}>
                <div style={{ color: '#b8bcc8', fontSize: '13px', marginBottom: '12px', fontWeight: '600' }}>
                  Role Management
                </div>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  flexDirection: isSmallScreen ? 'column' : 'row'
                }}>
                  <button
                    onClick={() => handleRoleChangeClick('user')}
                    disabled={userData.user.role === 'user' || changingRole}
                    style={{
                      ...buttonStyle,
                      backgroundColor: userData.user.role === 'user' ? '#6b7280' : '#3b82f6',
                      color: '#ffffff',
                      opacity: (userData.user.role === 'user' || changingRole) ? 0.6 : 1,
                      cursor: (userData.user.role === 'user' || changingRole) ? 'not-allowed' : 'pointer',
                      width: isSmallScreen ? '100%' : 'auto',
                      textAlign: 'center'
                    }}
                  >
                    Set as Buyer
                  </button>
                  <button
                    onClick={() => handleRoleChangeClick('seller')}
                    disabled={userData.user.role === 'seller' || changingRole}
                    style={{
                      ...buttonStyle,
                      backgroundColor: userData.user.role === 'seller' ? '#6b7280' : '#10b981',
                      color: '#ffffff',
                      opacity: (userData.user.role === 'seller' || changingRole) ? 0.6 : 1,
                      cursor: (userData.user.role === 'seller' || changingRole) ? 'not-allowed' : 'pointer',
                      width: isSmallScreen ? '100%' : 'auto',
                      textAlign: 'center'
                    }}
                  >
                    Promote to Seller
                  </button>
                </div>
                {roleChangeError && (
                  <div style={{
                    marginTop: '12px',
                    padding: '10px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}>
                    {roleChangeError}
                  </div>
                )}
              </div>

              {/* Seller Request Status */}
              {userData.sellerRequest && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#1e2338', borderRadius: '6px' }}>
                  <div style={{ color: '#b8bcc8', fontSize: '12px', marginBottom: '4px' }}>Seller Request Status</div>
                  <span style={badgeStyle(
                    userData.sellerRequest.status === 'approved' ? '#10b981' :
                    userData.sellerRequest.status === 'rejected' ? '#ef4444' : '#f59e0b'
                  )}>
                    {userData.sellerRequest.status.charAt(0).toUpperCase() + userData.sellerRequest.status.slice(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Seller Listings */}
            {userData.user.role === 'seller' && (
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>
                  Seller Listings ({userData.stats.totalListings})
                </h3>
                {userData.listings.length === 0 ? (
                  <div style={{ color: '#b8bcc8', textAlign: 'center', padding: '20px' }}>
                    No listings found
                  </div>
                ) : isSmallScreen ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {userData.listings.map((listing) => (
                      <div
                        key={listing._id}
                        style={{
                          padding: '12px 12px 10px',
                          backgroundColor: '#0f1424',
                          borderRadius: '10px',
                          border: '1px solid #2d3447',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, flex: 1 }}>
                            {listing.title}
                          </div>
                          <span style={badgeStyle(getStatusColor(listing.status))}>
                            {listing.status}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                          <span>Category</span>
                          <span style={{ color: '#e5e7eb' }}>{listing.category || 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                          <span>Price</span>
                          <span style={{ color: '#e5e7eb' }}>{formatCurrency(listing.price)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                          <span>Stock</span>
                          <span style={{ color: '#e5e7eb' }}>{listing.stock}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Title</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Stock</th>
                        <th style={thStyle}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.listings.map((listing) => (
                        <tr key={listing._id}>
                          <td style={tdStyle}>{listing.title}</td>
                          <td style={tdStyle}>{listing.category}</td>
                          <td style={tdStyle}>{formatCurrency(listing.price)}</td>
                          <td style={tdStyle}>{listing.stock}</td>
                          <td style={tdStyle}>
                            <span style={badgeStyle(getStatusColor(listing.status))}>
                              {listing.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Buyer Orders */}
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>
                Buyer Orders ({userData.stats.totalBuyerOrders})
                {userData.stats.activeBuyerOrders > 0 && (
                  <span style={{ ...badgeStyle('#f59e0b'), marginLeft: '8px' }}>
                    {userData.stats.activeBuyerOrders} Active
                  </span>
                )}
              </h3>
              {userData.buyerOrders.length === 0 ? (
                <div style={{ color: '#b8bcc8', textAlign: 'center', padding: '20px' }}>
                  No orders found
                </div>
              ) : isSmallScreen ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {userData.buyerOrders.map((order) => (
                    <div
                      key={order._id}
                      style={{
                        padding: '12px 12px 10px',
                        backgroundColor: '#0f1424',
                        borderRadius: '10px',
                        border: '1px solid #2d3447',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, flex: 1 }}>
                          {order.listing?.title || order.listing?.itemName || 'N/A'}
                        </div>
                        <span style={badgeStyle(getStatusColor(order.status))}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                        <span>Seller</span>
                        <span style={{ color: '#e5e7eb' }}>{order.seller?.discordUsername || 'Unknown'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                        <span>Quantity</span>
                        <span style={{ color: '#e5e7eb' }}>{order.quantity}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                        <span>Total</span>
                        <span style={{ color: '#e5e7eb' }}>{formatCurrency(order.totalPrice)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                        <span>Date</span>
                        <span style={{ color: '#e5e7eb' }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Item</th>
                      <th style={thStyle}>Seller</th>
                      <th style={thStyle}>Quantity</th>
                      <th style={thStyle}>Total</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.buyerOrders.map((order) => (
                      <tr key={order._id}>
                        <td style={tdStyle}>
                          {order.listing?.title || order.listing?.itemName || 'N/A'}
                        </td>
                        <td style={tdStyle}>
                          {order.seller?.discordUsername || 'Unknown'}
                        </td>
                        <td style={tdStyle}>{order.quantity}</td>
                        <td style={tdStyle}>{formatCurrency(order.totalPrice)}</td>
                        <td style={tdStyle}>
                          <span style={badgeStyle(getStatusColor(order.status))}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Seller Orders */}
            {userData.user.role === 'seller' && (
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>
                  Seller Orders ({userData.stats.totalSellerOrders})
                  {userData.stats.activeSellerOrders > 0 && (
                    <span style={{ ...badgeStyle('#f59e0b'), marginLeft: '8px' }}>
                      {userData.stats.activeSellerOrders} Active
                    </span>
                  )}
                </h3>
                {userData.sellerOrders.length === 0 ? (
                  <div style={{ color: '#b8bcc8', textAlign: 'center', padding: '20px' }}>
                    No orders found
                  </div>
                ) : isSmallScreen ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {userData.sellerOrders.map((order) => (
                      <div
                        key={order._id}
                        style={{
                          padding: '12px 12px 10px',
                          backgroundColor: '#0f1424',
                          borderRadius: '10px',
                          border: '1px solid #2d3447',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, flex: 1 }}>
                            {order.listing?.title || order.listing?.itemName || 'N/A'}
                          </div>
                          <span style={badgeStyle(getStatusColor(order.status))}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                          <span>Buyer</span>
                          <span style={{ color: '#e5e7eb' }}>{order.buyer?.discordUsername || 'Unknown'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                          <span>Quantity</span>
                          <span style={{ color: '#e5e7eb' }}>{order.quantity}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                          <span>Total</span>
                          <span style={{ color: '#e5e7eb' }}>{formatCurrency(order.totalPrice)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                          <span>Date</span>
                          <span style={{ color: '#e5e7eb' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Item</th>
                        <th style={thStyle}>Buyer</th>
                        <th style={thStyle}>Quantity</th>
                        <th style={thStyle}>Total</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.sellerOrders.map((order) => (
                        <tr key={order._id}>
                          <td style={tdStyle}>
                            {order.listing?.title || order.listing?.itemName || 'N/A'}
                          </td>
                          <td style={tdStyle}>
                            {order.buyer?.discordUsername || 'Unknown'}
                          </td>
                          <td style={tdStyle}>{order.quantity}</td>
                          <td style={tdStyle}>{formatCurrency(order.totalPrice)}</td>
                          <td style={tdStyle}>
                            <span style={badgeStyle(getStatusColor(order.status))}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        ) : null}
        </div>

        {/* Role Change Confirmation Modal */}
        {showRoleModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000
          }} onClick={() => setShowRoleModal(false)}>
            <div style={{
              backgroundColor: '#1e2338',
              border: '1px solid #2d3447',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
            }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: '#ffffff', fontSize: '20px', marginBottom: '16px' }}>
                Change User Role?
              </h3>
              <p style={{ color: '#b8bcc8', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
                Are you sure you want to change this user's role from <strong style={{ color: '#ffffff' }}>{userData?.user.role}</strong> to <strong style={{ color: '#ffffff' }}>{newRole}</strong>?
              </p>
              {userData?.user.role === 'seller' && newRole === 'user' && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f59e0b',
                  border: '1px solid #d97706',
                  borderRadius: '8px',
                  color: '#0a0e27',
                  fontSize: '13px',
                  marginBottom: '20px'
                }}>
                  ⚠️ Warning: This will demote the user from seller to buyer. Make sure they have no active listings or orders.
                </div>
              )}
              {roleChangeError && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '13px',
                  marginBottom: '20px'
                }}>
                  {roleChangeError}
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setRoleChangeError(null);
                  }}
                  style={{
                    ...buttonStyle,
                    backgroundColor: 'transparent',
                    color: '#b8bcc8',
                    border: '1px solid #2d3447'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRoleChangeConfirm}
                  disabled={changingRole}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#fbbf24',
                    color: '#0a0e27',
                    opacity: changingRole ? 0.6 : 1,
                    cursor: changingRole ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {changingRole && <LoadingSpinner size="14px" color="#0a0e27" />}
                  {changingRole ? 'Changing...' : 'Confirm Change'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserInspector;

