import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import SkeletonListingDetail from '../../components/skeletons/SkeletonListingDetail';
import LoadingSpinner from '../../components/LoadingSpinner';
import CategoryIcon from '../../components/CategoryIcon';
import { useResponsive } from '../../hooks/useResponsive';

function ListingDetail() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(`/api/auth/listings/${listingId}`);

        if (response.data.success && response.data.listing) {
          const listingData = response.data.listing;
          setListing(listingData);
          // Reset quantity to 1 when listing changes, or clamp to available stock
          if (listingData.stock && listingData.stock > 0) {
            setQuantity(prev => Math.min(prev, listingData.stock));
          } else {
            setQuantity(1);
          }
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

    // Validate listing exists
    if (!listing) {
      setOrderError('Listing not found');
      return;
    }

    // Validate and clamp quantity to available stock
    const availableStock = listing.stock || 0;
    const validQuantity = Math.max(1, Math.min(quantity, availableStock));
    
    if (validQuantity !== quantity) {
      setQuantity(validQuantity);
      setOrderError(`Quantity adjusted to ${validQuantity} (available stock)`);
      return;
    }

    if (quantity < 1) {
      setOrderError('Quantity must be at least 1');
      return;
    }

    if (quantity > availableStock) {
      setOrderError(`Only ${availableStock} unit${availableStock !== 1 ? 's' : ''} available`);
      return;
    }

    if (availableStock === 0) {
      setOrderError('Item is out of stock');
      return;
    }

    try {
      setIsCreatingOrder(true);
      setOrderError(null);

      const requestBody = { listingId, quantity: validQuantity };
      const requestUrl = '/api/auth/orders';

      const response = await apiClient.post(requestUrl, requestBody);

      if (response.data.success) {
        // Redirect to orders page on success
        navigate('/buyer/orders');
      } else {
        setOrderError('Failed to create order');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create order';
      console.error('Order creation error:', err);
      setOrderError(errorMessage);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Calculate total price
  const totalPrice = listing ? (listing.price * quantity) : 0;
  const availableStock = listing?.stock || 0;
  const isOutOfStock = availableStock === 0;
  const canPurchase = !isOutOfStock && quantity >= 1 && quantity <= availableStock;

  // Clamp quantity to available stock whenever stock changes
  useEffect(() => {
    if (listing && listing.stock !== undefined && quantity > listing.stock) {
      setQuantity(Math.max(1, listing.stock));
    }
  }, [listing, quantity]);

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto'
  };

  const mainLayoutStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1fr 420px',
    gap: isMobile ? '24px' : isTablet ? '28px' : '32px',
    marginBottom: isMobile ? '32px' : '48px'
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
    height: isMobile ? '300px' : isTablet ? '400px' : '500px',
    backgroundColor: '#1a1f35',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isMobile ? '80px' : isTablet ? '100px' : '120px',
    color: '#2d3447',
    borderBottom: '1px solid #2d3447'
  };

  const infoSectionStyle = {
    padding: isMobile ? '20px' : isTablet ? '24px' : '32px'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '24px' : isTablet ? '28px' : '32px',
    fontWeight: '700',
    marginBottom: '16px',
    lineHeight: '1.3'
  };

  const metaStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: isMobile ? '8px' : '16px',
    marginBottom: '24px',
    fontSize: isMobile ? '12px' : '14px',
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
    padding: isMobile ? '20px' : isTablet ? '24px' : '32px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    position: isMobile ? 'relative' : 'sticky',
    top: isMobile ? 'auto' : '100px',
    height: 'fit-content'
  };

  const priceStyle = {
    color: '#fbbf24',
    fontSize: isMobile ? '36px' : isTablet ? '42px' : '48px',
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
    gap: '10px',
    marginBottom: '12px'
  };

  const sellerNameStyle = {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600'
  };

  const verifiedBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    flexShrink: 0,
    lineHeight: 1,
    fontSize: '12px',
    color: '#ffffff',
    fontWeight: '700',
    verticalAlign: 'middle'
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
            <CategoryIcon category={listing.category} size={isMobile ? 80 : isTablet ? 100 : 120} />
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

            {listing.description && (
              <div style={detailBlockStyle}>
                <div style={detailLabelStyle}>Description & Enchantments</div>
                <div style={{ ...detailValueStyle, color: '#b8bcc8', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {listing.description}
                </div>
              </div>
            )}

            {!listing.description && (
              <div style={detailBlockStyle}>
                <div style={detailLabelStyle}>Description</div>
                <div style={{ ...detailValueStyle, color: '#b8bcc8', lineHeight: '1.6' }}>
                  Premium quality {listing.itemName} for {listing.survival}.
                  Fast delivery guaranteed with full buyer protection.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Purchase Panel */}
        <div style={purchasePanelStyle}>
          <div style={priceStyle}>₹{listing.price.toLocaleString()}</div>
          <div style={priceSubtextStyle}>Per unit</div>

          {/* Stock Display */}
          <div style={{
            ...infoBlockStyle,
            marginBottom: '20px',
            backgroundColor: isOutOfStock ? '#7f1d1d' : '#1a1f35',
            borderColor: isOutOfStock ? '#ef4444' : '#2d3447'
          }}>
            <span style={infoIconStyle}>📦</span>
            <div style={infoTextStyle}>
              <div style={infoTitleStyle}>
                {isOutOfStock ? 'Out of Stock' : `Stock: ${availableStock} available`}
              </div>
              <div style={infoDescStyle}>
                {isOutOfStock ? 'This item is currently unavailable' : 'Units in stock'}
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div style={{
              backgroundColor: '#1a1f35',
              border: '1px solid #2d3447',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                ...detailLabelStyle,
                marginBottom: '12px',
                fontSize: '13px'
              }}>Select Quantity</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifyContent: 'center',
                height: '44px'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    border: '2px solid #2d3447',
                    backgroundColor: quantity <= 1 ? '#0f1419' : '#1e2338',
                    color: quantity <= 1 ? '#4b5563' : '#ffffff',
                    fontSize: '24px',
                    fontWeight: '600',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    userSelect: 'none',
                    padding: 0,
                    margin: 0,
                    lineHeight: '1',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (quantity > 1) {
                      e.target.style.backgroundColor = '#2d3447';
                      e.target.style.borderColor = '#fbbf24';
                      e.target.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (quantity > 1) {
                      e.target.style.backgroundColor = '#1e2338';
                      e.target.style.borderColor = '#2d3447';
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={availableStock}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    const clamped = Math.max(1, Math.min(availableStock, val));
                    setQuantity(clamped);
                  }}
                  style={{
                    width: '120px',
                    height: '44px',
                    padding: '0 16px',
                    backgroundColor: '#0f1419',
                    border: '2px solid #2d3447',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '20px',
                    fontWeight: '700',
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    margin: 0,
                    flexShrink: 0
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#2d3447';
                    e.target.style.boxShadow = 'none';
                    const val = parseInt(e.target.value) || 1;
                    const clamped = Math.max(1, Math.min(availableStock, val));
                    setQuantity(clamped);
                  }}
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                />
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    border: '2px solid #2d3447',
                    backgroundColor: quantity >= availableStock ? '#0f1419' : '#1e2338',
                    color: quantity >= availableStock ? '#4b5563' : '#ffffff',
                    fontSize: '24px',
                    fontWeight: '600',
                    cursor: quantity >= availableStock ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    userSelect: 'none',
                    padding: 0,
                    margin: 0,
                    lineHeight: '1',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (quantity < availableStock) {
                      e.target.style.backgroundColor = '#2d3447';
                      e.target.style.borderColor = '#fbbf24';
                      e.target.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (quantity < availableStock) {
                      e.target.style.backgroundColor = '#1e2338';
                      e.target.style.borderColor = '#2d3447';
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  +
                </button>
              </div>
              <div style={{
                fontSize: '11px',
                color: '#6b7280',
                fontWeight: '500',
                textAlign: 'center',
                marginTop: '8px'
              }}>
                Max: {availableStock} available
              </div>
            </div>
          )}

          {/* Total Price Display */}
          {!isOutOfStock && (
            <div style={{
              ...infoBlockStyle,
              marginBottom: '20px',
              backgroundColor: '#1a1f35',
              border: quantity > 1 ? '2px solid #fbbf24' : '1px solid #2d3447'
            }}>
              <span style={infoIconStyle}>💰</span>
              <div style={infoTextStyle}>
                <div style={{
                  ...infoTitleStyle,
                  color: quantity > 1 ? '#fbbf24' : '#ffffff',
                  fontSize: quantity > 1 ? '18px' : '16px',
                  fontWeight: '700'
                }}>
                  {quantity > 1 ? `Total: ₹${totalPrice.toLocaleString()}` : `Price: ₹${totalPrice.toLocaleString()}`}
                </div>
                {quantity > 1 && (
                  <div style={infoDescStyle}>
                    {quantity} × ₹{listing.price.toLocaleString()} per unit
                  </div>
                )}
                {quantity === 1 && (
                  <div style={infoDescStyle}>
                    Single unit price
                  </div>
                )}
              </div>
            </div>
          )}

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
                disabled={isCreatingOrder || !canPurchase}
                style={{
                  ...(isCreatingOrder || !canPurchase ? buttonDisabledStyle : buttonPrimaryStyle),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!isCreatingOrder && canPurchase) {
                    e.target.style.backgroundColor = '#f59e0b';
                    e.target.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCreatingOrder && canPurchase) {
                    e.target.style.backgroundColor = '#fbbf24';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                {isCreatingOrder ? (
                  <>
                    <LoadingSpinner size="16px" color="#0a0e27" /> Processing...
                  </>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  `Buy Now${quantity > 1 ? ` (${quantity} units)` : ''}`
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
            {listing.seller?.averageRating > 0 ? (
              <>
                <div style={ratingStyle}>
                  ⭐ {listing.seller.averageRating.toFixed(1)} / 5.0
                </div>
                <div style={reviewsStyle}>
                  {listing.seller.totalRatings} rating{listing.seller.totalRatings !== 1 ? 's' : ''} • {listing.seller.totalDeals} deal{listing.seller.totalDeals !== 1 ? 's' : ''} completed
                </div>
              </>
            ) : listing.seller?.totalDeals > 0 ? (
              <>
                <div style={ratingStyle}>
                  {listing.seller.totalDeals} deal{listing.seller.totalDeals !== 1 ? 's' : ''} completed
                </div>
                <div style={reviewsStyle}>
                  No ratings yet
                </div>
              </>
            ) : (
              <>
                <div style={ratingStyle}>New Seller</div>
                <div style={reviewsStyle}>No completed deals yet</div>
              </>
            )}
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

