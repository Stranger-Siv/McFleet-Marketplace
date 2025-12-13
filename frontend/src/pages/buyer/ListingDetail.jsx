import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import SkeletonListingDetail from '../../components/skeletons/SkeletonListingDetail';
import LoadingSpinner from '../../components/LoadingSpinner';
import CategoryIcon from '../../components/CategoryIcon';

function ListingDetail() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(`/api/auth/listings/${listingId}`);

        if (response.data.success && response.data.listing) {
          setListing(response.data.listing);
        } else {
          setError('Listing not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch listing');
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  const handleBuyNow = async () => {
    // Validate listingId exists
    if (!listingId) {
      setOrderError('Invalid listing ID');
      return;
    }

    try {
      setIsCreatingOrder(true);
      setOrderError(null);

      const requestBody = { listingId };
      const requestUrl = '/api/auth/orders';
      const fullUrl = `${apiClient.defaults.baseURL}${requestUrl}`;

      // Console logging for debugging
      console.log('=== Creating Order ===');
      console.log('Method:', 'POST');
      console.log('Full URL:', fullUrl);
      console.log('Request Body:', requestBody);
      console.log('Listing ID:', listingId);
      console.log('Token exists:', !!localStorage.getItem('token'));

      const response = await apiClient.post(requestUrl, requestBody);

      // Log successful response
      console.log('=== Order Created Successfully ===');
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);

      if (response.data.success) {
        // Redirect to orders page on success
        navigate('/buyer/orders');
      } else {
        setOrderError('Failed to create order');
      }
    } catch (err) {
      // Enhanced error logging
      console.error('=== Order Creation Error ===');
      console.error('Error Status:', err.response?.status);
      console.error('Error Message:', err.response?.data?.message);
      console.error('Error Details:', err.message);
      console.error('Full Error Response:', err.response?.data);
      console.error('Request Config:', err.config);

      const errorMessage = err.response?.data?.message || 'Failed to create order';
      setOrderError(errorMessage);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto'
  };

  const mainLayoutStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 420px',
    gap: '32px',
    marginBottom: '48px'
  };

  const previewSectionStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const imageContainerStyle = {
    width: '100%',
    height: '500px',
    backgroundColor: '#1a1f35',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '120px',
    color: '#2d3447',
    borderBottom: '1px solid #2d3447'
  };

  const infoSectionStyle = {
    padding: '32px'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '16px',
    lineHeight: '1.3'
  };

  const metaStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    fontSize: '14px',
    color: '#6b7280'
  };

  const detailBlockStyle = {
    backgroundColor: '#1a1f35',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px'
  };

  const detailLabelStyle = {
    color: '#6b7280',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px'
  };

  const detailValueStyle = {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '500'
  };

  const purchasePanelStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    position: 'sticky',
    top: '100px',
    height: 'fit-content'
  };

  const priceStyle = {
    color: '#fbbf24',
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '8px',
    lineHeight: '1'
  };

  const priceSubtextStyle = {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '24px'
  };

  const infoBlockStyle = {
    backgroundColor: '#1a1f35',
    border: '1px solid #2d3447',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const infoIconStyle = {
    fontSize: '24px'
  };

  const infoTextStyle = {
    flex: 1
  };

  const infoTitleStyle = {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px'
  };

  const infoDescStyle = {
    color: '#6b7280',
    fontSize: '12px'
  };

  const buttonPrimaryStyle = {
    width: '100%',
    padding: '16px',
    backgroundColor: '#fbbf24',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const buttonSecondaryStyle = {
    ...buttonPrimaryStyle,
    backgroundColor: 'transparent',
    color: '#fbbf24',
    border: '2px solid #fbbf24',
    marginBottom: '0'
  };

  const buttonDisabledStyle = {
    ...buttonPrimaryStyle,
    backgroundColor: '#2d3447',
    color: '#6b7280',
    cursor: 'not-allowed'
  };

  const sellerCardStyle = {
    backgroundColor: '#1a1f35',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '24px'
  };

  const sellerHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  };

  const sellerNameStyle = {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600'
  };

  const verifiedBadgeStyle = {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    position: 'relative',
    flexShrink: 0
  };

  const ratingStyle = {
    color: '#fbbf24',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px'
  };

  const reviewsStyle = {
    color: '#6b7280',
    fontSize: '12px'
  };

  const errorStyle = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '8px',
    marginTop: '16px',
    fontSize: '14px'
  };

  const warningStyle = {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '8px',
    marginTop: '16px',
    fontSize: '14px'
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
    return <SkeletonListingDetail />;
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>Error: {error}</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>Listing not found</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ ...mainLayoutStyle, ...contentStyle }}>
        {/* Left: Item Preview */}
        <div style={previewSectionStyle}>
          <div style={{
            ...imageContainerStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '120px'
          }}>
            <CategoryIcon category={listing.category} size={120} />
          </div>
          <div style={infoSectionStyle}>
            <h1 style={{
              ...titleStyle,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CategoryIcon category={listing.category} size={32} />
              {listing.title}
            </h1>
            <div style={metaStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CategoryIcon category={listing.category} size={16} />
                {listing.category}
              </span>
              <span>•</span>
              <span>{listing.survival}</span>
            </div>

            <div style={detailBlockStyle}>
              <div style={detailLabelStyle}>Item Name</div>
              <div style={detailValueStyle}>{listing.itemName}</div>
            </div>

            <div style={detailBlockStyle}>
              <div style={detailLabelStyle}>Description</div>
              <div style={{ ...detailValueStyle, color: '#b8bcc8', lineHeight: '1.6' }}>
                Premium quality {listing.itemName} for {listing.survival}.
                Fast delivery guaranteed with full buyer protection.
              </div>
            </div>
          </div>
        </div>

        {/* Right: Purchase Panel */}
        <div style={purchasePanelStyle}>
          <div style={priceStyle}>₹{listing.price.toLocaleString()}</div>
          <div style={priceSubtextStyle}>Per unit</div>

          {/* Info Blocks */}
          <div style={infoBlockStyle}>
            <span style={infoIconStyle}>⚡</span>
            <div style={infoTextStyle}>
              <div style={infoTitleStyle}>Instant Delivery</div>
              <div style={infoDescStyle}>Item delivered immediately after payment</div>
            </div>
          </div>

          <div style={infoBlockStyle}>
            <span style={infoIconStyle}>🛡️</span>
            <div style={infoTextStyle}>
              <div style={infoTitleStyle}>Buyer Protection</div>
              <div style={infoDescStyle}>Full refund if item not as described</div>
            </div>
          </div>

          <div style={infoBlockStyle}>
            <span style={infoIconStyle}>💬</span>
            <div style={infoTextStyle}>
              <div style={infoTitleStyle}>24/7 Support</div>
              <div style={infoDescStyle}>Middleman available for assistance</div>
            </div>
          </div>

          {/* Action Buttons */}
          {(!listing.status || listing.status === 'active') ? (
            <>
              <button
                onClick={handleBuyNow}
                disabled={isCreatingOrder}
                style={{
                  ...(isCreatingOrder ? buttonDisabledStyle : buttonPrimaryStyle),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!isCreatingOrder) {
                    e.target.style.backgroundColor = '#f59e0b';
                    e.target.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCreatingOrder) {
                    e.target.style.backgroundColor = '#fbbf24';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                {isCreatingOrder ? (
                  <>
                    <LoadingSpinner size="16px" color="#0a0e27" /> Processing...
                  </>
                ) : (
                  'Buy Now'
                )}
              </button>

              {orderError && (
                <div style={errorStyle}>Error: {orderError}</div>
              )}
            </>
          ) : (
            <div style={warningStyle}>
              This listing is {listing.status || 'not available'} and cannot be purchased.
            </div>
          )}

          {/* Seller Info Card */}
          <div style={sellerCardStyle}>
            <div style={sellerHeaderStyle}>
              <span style={sellerNameStyle}>Verified Seller</span>
              <span style={verifiedBadgeStyle}>✓</span>
            </div>
            <div style={ratingStyle}>⭐⭐⭐⭐⭐ 100%</div>
            <div style={reviewsStyle}>50+ successful trades</div>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #2d3447', fontSize: '12px', color: '#6b7280' }}>
              Seller identity protected for privacy. Communication coordinated through assigned middleman.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;

