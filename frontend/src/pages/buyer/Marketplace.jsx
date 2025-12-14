import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../api/axios';
import SkeletonCard from '../../components/skeletons/SkeletonCard';
import CategoryIcon from '../../components/CategoryIcon';
import { useResponsive } from '../../hooks/useResponsive';

function Marketplace() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [priceFilter, setPriceFilter] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();
  const [filtersOpen, setFiltersOpen] = useState(!isMobile);

  // Get search query from URL
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/api/auth/listings');

        if (response.data.success) {
          const listingsData = response.data.listings;
          setListings(listingsData);
          setFilteredListings(listingsData);
        } else {
          setError('Failed to load listings');
        }
      } catch (err) {
        // Improved error handling with HTTP status and response message
        const status = err.response?.status;
        const message = err.response?.data?.message || err.message || 'Failed to fetch listings';

        console.error('Marketplace fetch error:', {
          status,
          message,
          response: err.response?.data,
          url: err.config?.url
        });

        if (status) {
          setError(`Error ${status}: ${message}`);
        } else {
          setError(`Network error: ${message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(listings.map(l => l.category))];

  // Filter and sort listings
  useEffect(() => {
    let filtered = [...listings];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(l =>
        l.title.toLowerCase().includes(query) ||
        l.itemName.toLowerCase().includes(query) ||
        l.category.toLowerCase().includes(query) ||
        l.survival.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(l => l.category === selectedCategory);
    }

    // Price filter
    if (priceFilter === 'low') {
      filtered = filtered.filter(l => l.price < 1000);
    } else if (priceFilter === 'medium') {
      filtered = filtered.filter(l => l.price >= 1000 && l.price < 5000);
    } else if (priceFilter === 'high') {
      filtered = filtered.filter(l => l.price >= 5000);
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredListings(filtered);
  }, [listings, selectedCategory, sortBy, priceFilter, searchQuery]);

  const handleViewListing = (listingId) => {
    navigate(`/listings/${listingId}`);
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto'
  };

  const headerStyle = {
    marginBottom: '32px'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #ffffff 0%, #b8bcc8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle = {
    color: '#6b7280',
    fontSize: '14px'
  };

  const filtersSectionStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: isMobile ? '16px' : '20px',
    marginBottom: isMobile ? '20px' : '32px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const filtersRowStyle = {
    display: 'flex',
    gap: isMobile ? '8px' : '16px',
    alignItems: 'center',
    flexWrap: 'wrap'
  };

  const filterLabelStyle = {
    color: '#b8bcc8',
    fontSize: '13px',
    fontWeight: '600',
    marginRight: '8px'
  };

  const categoryChipStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: '9999px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? '#fbbf24' : '#1a1f35',
    color: isActive ? '#0a0e27' : '#b8bcc8',
    border: `1px solid ${isActive ? '#fbbf24' : '#2d3447'}`
  });

  const selectStyle = {
    padding: isMobile ? '14px 16px' : '10px 16px',
    backgroundColor: '#1a1f35',
    border: '1px solid #2d3447',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: isMobile ? '48px' : '40px', // Touch-friendly size
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fbbf24' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px',
    paddingRight: isMobile ? '40px' : '36px',
    boxSizing: 'border-box',
    outline: 'none',
    width: '100%', // Full width by default
    display: 'block' // Block display to ensure proper width
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile
      ? '1fr'
      : isTablet
        ? 'repeat(2, 1fr)'
        : 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: isMobile ? '16px' : isTablet ? '20px' : '24px'
  };

  const cardStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const cardImageStyle = {
    width: '100%',
    height: '200px',
    backgroundColor: '#1a1f35',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    color: '#6b7280',
    borderBottom: '1px solid #2d3447'
  };

  const cardContentStyle = {
    padding: isMobile ? '16px' : '20px'
  };

  const cardTitleStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: '600',
    marginBottom: '12px',
    lineHeight: '1.4'
  };

  const sellerInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
    fontSize: '13px',
    color: '#b8bcc8',
    flexWrap: 'wrap'
  };

  const verifiedBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    flexShrink: 0,
    lineHeight: 1,
    fontSize: '10px',
    color: '#ffffff',
    fontWeight: '700',
    verticalAlign: 'middle',
    marginLeft: '4px'
  };

  const priceRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #2d3447'
  };

  const priceStyle = {
    color: '#fbbf24',
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: '700'
  };

  const deliveryStyle = {
    fontSize: '12px',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#fbbf24',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const loadingStyle = {
    color: '#b8bcc8',
    textAlign: 'center',
    padding: '80px 20px',
    fontSize: '16px'
  };

  const errorStyle = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '16px 20px',
    borderRadius: '12px',
    marginBottom: '24px',
    textAlign: 'center',
    fontSize: '14px'
  };

  const emptyStyle = {
    color: '#b8bcc8',
    textAlign: 'center',
    padding: '80px 20px',
    fontSize: '16px',
    backgroundColor: '#1e2338',
    borderRadius: '12px',
    border: '1px solid #2d3447'
  };

  const contentStyle = {
    animation: loading ? 'none' : 'fadeIn 0.4s ease-in'
  };

  // Add fade-in animation style
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

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Marketplace</h1>
        <p style={subtitleStyle}>
          {searchQuery ? (
            <>
              Search results for "<strong style={{ color: '#fbbf24' }}>{searchQuery}</strong>" ({filteredListings.length} {filteredListings.length === 1 ? 'item' : 'items'})
            </>
          ) : (
            'Discover premium Minecraft items from trusted sellers'
          )}
        </p>
      </div>

      {/* Filters Section */}
      <div style={filtersSectionStyle}>
        {isMobile && (
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#252b42',
              border: '1px solid #2d3447',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: filtersOpen ? '16px' : '0'
            }}
          >
            <span>Filters</span>
            <span style={{ fontSize: '18px' }}>{filtersOpen ? '−' : '+'}</span>
          </button>
        )}
        {(filtersOpen || !isMobile) && (
          <>
            <div style={filtersRowStyle}>
              <span style={{ ...filterLabelStyle, width: isMobile ? '100%' : 'auto', marginBottom: isMobile ? '8px' : '0' }}>Category:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    ...categoryChipStyle(selectedCategory === cat),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== cat) {
                      e.target.style.backgroundColor = '#252b42';
                      e.target.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== cat) {
                      e.target.style.backgroundColor = '#1a1f35';
                      e.target.style.color = '#b8bcc8';
                    }
                  }}
                >
                  {cat !== 'all' && <CategoryIcon category={cat} size={16} />}
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

            <div style={{ 
              ...filtersRowStyle, 
              marginTop: isMobile ? '12px' : '16px',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '12px' : '16px',
              alignItems: isMobile ? 'stretch' : 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                gap: isMobile ? '8px' : '12px',
                width: isMobile ? '100%' : 'auto',
                flex: isMobile ? '1' : '1 1 auto',
                minWidth: isMobile ? '100%' : '180px'
              }}>
                <span style={{ 
                  ...filterLabelStyle, 
                  width: isMobile ? '100%' : 'auto', 
                  marginBottom: isMobile ? '6px' : '0',
                  marginLeft: isMobile ? '0' : '0',
                  flexShrink: 0
                }}>Price:</span>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  style={{ 
                    ...selectStyle, 
                    width: isMobile ? '100%' : '100%', 
                    minWidth: isMobile ? '100%' : '180px',
                    flex: '1 1 auto'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#2d3447';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="all">All Prices</option>
                  <option value="low">Under ₹1,000</option>
                  <option value="medium">₹1,000 - ₹5,000</option>
                  <option value="high">Above ₹5,000</option>
                </select>
              </div>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                gap: isMobile ? '8px' : '12px',
                width: isMobile ? '100%' : 'auto',
                flex: isMobile ? '1' : '1 1 auto',
                minWidth: isMobile ? '100%' : '180px'
              }}>
                <span style={{ 
                  ...filterLabelStyle, 
                  width: isMobile ? '100%' : 'auto', 
                  marginTop: isMobile ? '0' : '0',
                  marginBottom: isMobile ? '6px' : '0',
                  marginLeft: isMobile ? '0' : '0',
                  flexShrink: 0
                }}>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ 
                    ...selectStyle, 
                    width: isMobile ? '100%' : '100%', 
                    minWidth: isMobile ? '100%' : '180px',
                    flex: '1 1 auto'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#2d3447';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {loading ? (
        <div style={gridStyle}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div style={errorStyle}>Error: {error}</div>
      ) : filteredListings.length === 0 ? (
        <div style={emptyStyle}>No listings found matching your filters</div>
      ) : (
        <div style={{ ...gridStyle, ...contentStyle }}>
          {filteredListings.map((listing) => (
            <div
              key={listing._id}
              style={cardStyle}
              onClick={() => handleViewListing(listing._id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
                e.currentTarget.style.borderColor = '#fbbf24';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.borderColor = '#2d3447';
              }}
            >
              <div style={{
                ...cardImageStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px'
              }}>
                <CategoryIcon category={listing.category} size={64} />
              </div>
              <div style={cardContentStyle}>
                <h3 style={{
                  ...cardTitleStyle,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <CategoryIcon category={listing.category} size={20} />
                  {listing.title}
                </h3>
                <div style={sellerInfoStyle}>
                  <span>Seller: Hidden</span>
                  <span style={verifiedBadgeStyle}>✓</span>
                  {listing.seller?.averageRating > 0 && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginLeft: '8px',
                      color: '#fbbf24',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}>
                      ⭐ {listing.seller.averageRating.toFixed(1)}
                      {listing.seller.totalRatings > 0 && (
                        <span style={{ color: '#6b7280', fontWeight: '400' }}>
                          ({listing.seller.totalRatings})
                        </span>
                      )}
                    </span>
                  )}
                  {(!listing.seller?.averageRating || listing.seller.averageRating === 0) && listing.seller?.totalDeals === 0 && (
                    <span style={{
                      marginLeft: '8px',
                      color: '#6b7280',
                      fontSize: '12px',
                      fontStyle: 'italic'
                    }}>
                      New Seller
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                  {listing.category} • {listing.survival}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: listing.stock > 0 ? '#10b981' : '#ef4444',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>📦</span>
                  <span>{listing.stock > 0 ? `${listing.stock} in stock` : 'Out of stock'}</span>
                </div>
                <div style={priceRowStyle}>
                  <div>
                    <div style={priceStyle}>₹{listing.price.toLocaleString()}</div>
                    <div style={deliveryStyle}>
                      <span>⚡</span>
                      <span>Instant Delivery</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewListing(listing._id);
                  }}
                  disabled={listing.stock === 0}
                  style={{
                    ...buttonStyle,
                    opacity: listing.stock === 0 ? 0.5 : 1,
                    cursor: listing.stock === 0 ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (listing.stock > 0) {
                      e.target.style.backgroundColor = '#f59e0b';
                      e.target.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (listing.stock > 0) {
                      e.target.style.backgroundColor = '#fbbf24';
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {listing.stock === 0 ? 'Out of Stock' : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Marketplace;

