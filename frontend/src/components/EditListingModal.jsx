import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import LoadingSpinner from './LoadingSpinner';

function EditListingModal({ listing, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    stock: '',
    category: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [hasActiveOrders, setHasActiveOrders] = useState(false);
  const [checkingOrders, setCheckingOrders] = useState(true);

  // Pre-fill form when listing changes
  useEffect(() => {
    if (listing && isOpen) {
      setFormData({
        itemName: listing.itemName || '',
        price: listing.price || '',
        stock: listing.stock || '',
        category: listing.category || '',
        description: listing.description || ''
      });
      setErrors({});
      setSubmitError(null);
      checkActiveOrders();
    }
  }, [listing, isOpen]);

  // Fetch categories
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          setLoadingOptions(true);
          const response = await apiClient.get('/api/auth/settings/categories');
          if (response.data.success) {
            setCategories(response.data.categories || []);
          }
        } catch (err) {
          console.error('Error fetching categories:', err);
        } finally {
          setLoadingOptions(false);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  // Check for active orders
  const checkActiveOrders = async () => {
    try {
      setCheckingOrders(true);
      // Fetch seller orders to check if this listing has active orders
      const response = await apiClient.get('/api/auth/seller/orders');
      if (response.data.success) {
        const activeStatuses = ['pending_payment', 'paid', 'item_collected', 'item_delivered', 'disputed'];
        const activeOrders = response.data.orders.filter(order => 
          order.listing._id === listing._id && 
          activeStatuses.includes(order.status)
        );
        setHasActiveOrders(activeOrders.length > 0);
      }
    } catch (err) {
      console.error('Error checking orders:', err);
    } finally {
      setCheckingOrders(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setSubmitError(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.stock === '' || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    // Check if any changes were made
    const hasChanges = 
      formData.itemName !== listing.itemName ||
      parseFloat(formData.price) !== listing.price ||
      parseInt(formData.stock) !== listing.stock ||
      formData.category !== listing.category ||
      formData.description !== listing.description;

    if (!hasChanges) {
      setSubmitError('No changes detected');
      return;
    }

    try {
      setIsSubmitting(true);

      const requestBody = {
        itemName: formData.itemName.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        description: formData.description.trim()
      };

      const response = await apiClient.put(`/api/auth/listings/${listing._id}`, requestBody);

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setSubmitError('Failed to update listing');
      }
    } catch (err) {
      console.error('Listing update error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update listing';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalOverlayStyle = {
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
  };

  const modalStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '24px'
  };

  const inputGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    color: '#b8bcc8',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #2d3447',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: '#1a1f35',
    color: '#ffffff',
    transition: 'all 0.2s ease'
  };

  const selectStyle = {
    ...inputStyle,
    fontSize: '16px',
    minHeight: '48px',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fbbf24' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '12px',
    paddingRight: '40px',
    cursor: 'pointer'
  };

  const errorStyle = {
    color: '#ed4245',
    fontSize: '12px',
    marginTop: '6px',
    fontWeight: '500'
  };

  const warningStyle = {
    padding: '14px 18px',
    backgroundColor: '#f59e0b',
    border: '1px solid #d4941a',
    borderRadius: '8px',
    color: '#ffffff',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '500'
  };

  const submitErrorStyle = {
    padding: '14px 18px',
    backgroundColor: '#ef4444',
    border: '1px solid #dc2626',
    borderRadius: '8px',
    color: '#ffffff',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '500'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  };

  const buttonStyle = {
    padding: '14px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    flex: 1
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#fbbf24',
    color: '#0a0e27',
    border: 'none',
    opacity: isSubmitting || hasActiveOrders ? 0.6 : 1,
    cursor: isSubmitting || hasActiveOrders ? 'not-allowed' : 'pointer'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#b8bcc8',
    border: '1px solid #2d3447'
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={titleStyle}>Edit Listing</h2>
        <p style={subtitleStyle}>Update your listing details</p>

        {checkingOrders ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#b8bcc8' }}>
            <LoadingSpinner size="24px" color="#fbbf24" />
            <p style={{ marginTop: '16px' }}>Checking order status...</p>
          </div>
        ) : (
          <>
            {hasActiveOrders && (
              <div style={warningStyle}>
                ⚠️ Listings with active or pending orders cannot be edited or paused.
              </div>
            )}

            {submitError && (
              <div style={submitErrorStyle}>
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Item Name */}
              <div style={inputGroupStyle}>
                <label style={labelStyle} htmlFor="edit-itemName">
                  Item Name *
                </label>
                <input
                  type="text"
                  id="edit-itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  disabled={hasActiveOrders}
                  style={{
                    ...inputStyle,
                    borderColor: errors.itemName ? '#ef4444' : '#2d3447',
                    opacity: hasActiveOrders ? 0.6 : 1,
                    cursor: hasActiveOrders ? 'not-allowed' : 'text'
                  }}
                  placeholder="e.g., Diamond Sword"
                />
                {errors.itemName && <div style={errorStyle}>{errors.itemName}</div>}
              </div>

              {/* Price */}
              <div style={inputGroupStyle}>
                <label style={labelStyle} htmlFor="edit-price">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  id="edit-price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  disabled={hasActiveOrders}
                  style={{
                    ...inputStyle,
                    borderColor: errors.price ? '#ef4444' : '#2d3447',
                    opacity: hasActiveOrders ? 0.6 : 1,
                    cursor: hasActiveOrders ? 'not-allowed' : 'text'
                  }}
                  onWheel={(e) => e.target.blur()}
                />
                {errors.price && <div style={errorStyle}>{errors.price}</div>}
              </div>

              {/* Stock */}
              <div style={inputGroupStyle}>
                <label style={labelStyle} htmlFor="edit-stock">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="edit-stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  disabled={hasActiveOrders}
                  style={{
                    ...inputStyle,
                    borderColor: errors.stock ? '#ef4444' : '#2d3447',
                    opacity: hasActiveOrders ? 0.6 : 1,
                    cursor: hasActiveOrders ? 'not-allowed' : 'text'
                  }}
                  onWheel={(e) => e.target.blur()}
                />
                {errors.stock && <div style={errorStyle}>{errors.stock}</div>}
              </div>

              {/* Category */}
              <div style={inputGroupStyle}>
                <label style={labelStyle} htmlFor="edit-category">
                  Category *
                </label>
                <select
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={hasActiveOrders || loadingOptions}
                  style={{
                    ...selectStyle,
                    borderColor: errors.category ? '#ef4444' : '#2d3447',
                    opacity: hasActiveOrders || loadingOptions ? 0.6 : 1,
                    cursor: hasActiveOrders || loadingOptions ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && <div style={errorStyle}>{errors.category}</div>}
              </div>

              {/* Description */}
              <div style={inputGroupStyle}>
                <label style={labelStyle} htmlFor="edit-description">
                  Item Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  maxLength="2000"
                  disabled={hasActiveOrders}
                  style={{
                    ...inputStyle,
                    minHeight: '120px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    borderColor: errors.description ? '#ef4444' : '#2d3447',
                    opacity: hasActiveOrders ? 0.6 : 1,
                    cursor: hasActiveOrders ? 'not-allowed' : 'text'
                  }}
                  placeholder="e.g., Sharpness V, Unbreaking III, Mending..."
                />
                {errors.description && <div style={errorStyle}>{errors.description}</div>}
                <div style={{ ...errorStyle, color: '#6b7280', marginTop: '4px' }}>
                  {formData.description.length}/2000 characters
                </div>
              </div>

              {/* Buttons */}
              <div style={buttonGroupStyle}>
                <button
                  type="button"
                  onClick={onClose}
                  style={secondaryButtonStyle}
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
                  type="submit"
                  disabled={isSubmitting || hasActiveOrders}
                  style={primaryButtonStyle}
                  onMouseEnter={(e) => {
                    if (!isSubmitting && !hasActiveOrders) {
                      e.target.style.backgroundColor = '#f59e0b';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting && !hasActiveOrders) {
                      e.target.style.backgroundColor = '#fbbf24';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="16px" color="#0a0e27" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default EditListingModal;

