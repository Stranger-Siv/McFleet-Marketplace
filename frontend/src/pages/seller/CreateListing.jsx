import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import SkeletonText from '../../components/skeletons/SkeletonText';
import LoadingSpinner from '../../components/LoadingSpinner';

function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    itemName: '',
    category: '',
    survival: '',
    price: '',
    stock: '1',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [survivals, setSurvivals] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        setOptionsError(null);
        
        const [categoriesRes, survivalsRes] = await Promise.all([
          apiClient.get('/api/auth/settings/categories'),
          apiClient.get('/api/auth/settings/survivals')
        ]);

        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.categories || []);
        }

        if (survivalsRes.data.success) {
          setSurvivals(survivalsRes.data.survivals || []);
        }

        // Check if no options available
        if ((categoriesRes.data.categories || []).length === 0 || 
            (survivalsRes.data.survivals || []).length === 0) {
          setOptionsError('Admin has not configured categories yet');
        }
      } catch (err) {
        setOptionsError('Failed to load options. Please try again later.');
        console.error('Error fetching options:', err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item Name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.survival) {
      newErrors.survival = 'Survival is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.stock || parseInt(formData.stock) < 1) {
      newErrors.stock = 'Stock must be at least 1';
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

    try {
      setIsSubmitting(true);
      
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        setSubmitError('Price must be a valid positive number');
        setIsSubmitting(false);
        return;
      }

      const requestBody = {
        title: formData.title.trim(),
        itemName: formData.itemName.trim(),
        category: formData.category,
        survival: formData.survival,
        price: priceValue,
        stock: parseInt(formData.stock) || 1,
        description: formData.description.trim()
      };

      const response = await apiClient.post('/api/auth/listings', requestBody);

      if (response.data.success) {
        // Redirect to seller dashboard on success
        navigate('/seller/dashboard');
      } else {
        setSubmitError('Failed to create listing');
      }
    } catch (err) {
      console.error('Listing creation error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create listing';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contentStyle = {
    animation: loadingOptions ? 'none' : 'fadeIn 0.4s ease-in'
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

  const containerStyle = {
    maxWidth: '700px',
    margin: '0 auto'
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
    fontSize: '14px',
    marginBottom: '32px'
  };

  const formStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
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
    fontSize: '16px', // Prevent zoom on iOS
    minHeight: '48px', // Touch-friendly size
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fbbf24' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '12px',
    paddingRight: '40px',
    cursor: 'pointer',
    outline: 'none',
    width: '100%', // Full width
    display: 'block' // Block display
  };

  const inputFocusStyle = {
    outline: 'none',
    borderColor: '#5865f2'
  };

  const errorStyle = {
    color: '#ed4245',
    fontSize: '12px',
    marginTop: '6px',
    fontWeight: '500'
  };

  const buttonStyle = {
    padding: '16px 24px',
    backgroundColor: '#fbbf24',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    opacity: isSubmitting ? 0.6 : 1,
    width: '100%',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
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

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Create New Listing</h1>
      <p style={subtitleStyle}>Add a new item to your marketplace inventory</p>

      <div style={{ ...formStyle, ...contentStyle }}>
        {submitError && (
          <div style={submitErrorStyle}>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <div style={inputGroupStyle}>
            <label style={labelStyle} htmlFor="title">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: errors.title ? '#ef4444' : '#2d3447'
              }}
              onFocus={(e) => {
                if (!errors.title) {
                  e.target.style.borderColor = '#fbbf24';
                  e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                }
              }}
              onBlur={(e) => {
                if (!errors.title) {
                  e.target.style.borderColor = '#2d3447';
                  e.target.style.boxShadow = 'none';
                }
              }}
              placeholder="e.g., Diamond Sword - Sharpness V"
            />
            {errors.title && <div style={errorStyle}>{errors.title}</div>}
          </div>

        {/* Item Name Field */}
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="itemName">
            Item Name *
          </label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.itemName ? '#ef4444' : '#2d3447'
            }}
              onFocus={(e) => {
                if (!errors.itemName) {
                  e.target.style.borderColor = '#fbbf24';
                  e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                }
              }}
              onBlur={(e) => {
                if (!errors.itemName) {
                  e.target.style.borderColor = '#2d3447';
                  e.target.style.boxShadow = 'none';
                }
              }}
            placeholder="e.g., Diamond Sword"
          />
          {errors.itemName && <div style={errorStyle}>{errors.itemName}</div>}
        </div>

        {/* Category Field */}
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="category">
            Category *
          </label>
          {loadingOptions ? (
            <SkeletonText height="48px" width="100%" />
          ) : (
            <>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={categories.length === 0}
                style={{
                  ...selectStyle,
                  borderColor: errors.category ? '#ef4444' : '#2d3447',
                  opacity: categories.length === 0 ? 0.6 : 1,
                  cursor: categories.length === 0 ? 'not-allowed' : 'pointer'
                }}
                onFocus={(e) => {
                  if (categories.length > 0) {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.category ? '#ef4444' : '#2d3447';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">
                  {categories.length === 0 ? 'No categories available' : 'Select a category'}
                </option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <div style={errorStyle}>{errors.category}</div>}
              {categories.length === 0 && (
                <div style={{ ...errorStyle, color: '#faa61a' }}>
                  Admin has not configured categories yet
                </div>
              )}
            </>
          )}
        </div>

        {/* Survival Field */}
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="survival">
            Survival / World *
          </label>
          {loadingOptions ? (
            <SkeletonText height="48px" width="100%" />
          ) : (
            <>
              <select
                id="survival"
                name="survival"
                value={formData.survival}
                onChange={handleChange}
                disabled={survivals.length === 0}
                style={{
                  ...selectStyle,
                  borderColor: errors.survival ? '#ef4444' : '#2d3447',
                  opacity: survivals.length === 0 ? 0.6 : 1,
                  cursor: survivals.length === 0 ? 'not-allowed' : 'pointer'
                }}
                onFocus={(e) => {
                  if (survivals.length > 0) {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.survival ? '#ef4444' : '#2d3447';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">
                  {survivals.length === 0 ? 'No survivals available' : 'Select a survival/world'}
                </option>
                {survivals.map(sur => (
                  <option key={sur} value={sur}>
                    {sur}
                  </option>
                ))}
              </select>
              {errors.survival && <div style={errorStyle}>{errors.survival}</div>}
              {survivals.length === 0 && (
                <div style={{ ...errorStyle, color: '#faa61a' }}>
                  Admin has not configured survivals yet
                </div>
              )}
            </>
          )}
        </div>

        {/* Price Field */}
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="price">
            Price (₹) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="1"
            step="1"
            style={{
              ...inputStyle,
              borderColor: errors.price ? '#ef4444' : '#2d3447'
            }}
            onFocus={(e) => {
              if (!errors.price) {
                e.target.style.borderColor = '#fbbf24';
                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.price) {
                e.target.style.borderColor = '#2d3447';
                e.target.style.boxShadow = 'none';
              }
            }}
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
              }
            }}
            placeholder="Enter price"
          />
          {errors.price && <div style={errorStyle}>{errors.price}</div>}
        </div>

        {/* Stock Field */}
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="stock">
            Stock Quantity *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="1"
            step="1"
            style={{
              ...inputStyle,
              borderColor: errors.stock ? '#ef4444' : '#2d3447'
            }}
            onFocus={(e) => {
              if (!errors.stock) {
                e.target.style.borderColor = '#fbbf24';
                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.stock) {
                e.target.style.borderColor = '#2d3447';
                e.target.style.boxShadow = 'none';
              }
            }}
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
              }
            }}
            placeholder="Enter stock quantity (e.g., 10, 50, 100)"
          />
          {errors.stock && <div style={errorStyle}>{errors.stock}</div>}
          <div style={{ ...errorStyle, color: '#6b7280', marginTop: '4px' }}>
            Number of units available for sale
          </div>
        </div>

        {/* Description Field */}
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="description">
            Item Description (Enchantments, Details)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            maxLength="2000"
            style={{
              ...inputStyle,
              minHeight: '120px',
              resize: 'vertical',
              fontFamily: 'inherit',
              borderColor: errors.description ? '#ef4444' : '#2d3447'
            }}
            onFocus={(e) => {
              if (!errors.description) {
                e.target.style.borderColor = '#fbbf24';
                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
              }
            }}
            onBlur={(e) => {
              if (!errors.description) {
                e.target.style.borderColor = '#2d3447';
                e.target.style.boxShadow = 'none';
              }
            }}
            placeholder="e.g., Sharpness V, Unbreaking III, Mending, Looting III..."
          />
          {errors.description && <div style={errorStyle}>{errors.description}</div>}
          <div style={{ ...errorStyle, color: '#6b7280', marginTop: '4px' }}>
            {formData.description.length}/2000 characters. Include enchantments, item details, and any special notes.
          </div>
        </div>

        {/* Options Error Message */}
        {optionsError && (
          <div style={{
            ...submitErrorStyle,
            backgroundColor: '#faa61a',
            borderColor: '#d4941a',
            color: '#ffffff'
          }}>
            {optionsError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || loadingOptions || categories.length === 0 || survivals.length === 0}
          style={{
            ...buttonStyle,
            opacity: (isSubmitting || loadingOptions || categories.length === 0 || survivals.length === 0) ? 0.6 : 1,
            cursor: (isSubmitting || loadingOptions || categories.length === 0 || survivals.length === 0) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting && !loadingOptions && categories.length > 0 && survivals.length > 0) {
              e.target.style.backgroundColor = '#f59e0b';
              e.target.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting && !loadingOptions && categories.length > 0 && survivals.length > 0) {
              e.target.style.backgroundColor = '#fbbf24';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          {isSubmitting && <LoadingSpinner size="16px" color="#0a0e27" />}
          {isSubmitting ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
      </div>
    </div>
  );
}

export default CreateListing;

