import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useResponsive } from '../../hooks/useResponsive';

function Settings() {
  const { isMobile, isTablet } = useResponsive();
  const [activeTab, setActiveTab] = useState('commission'); // 'commission' or 'marketplace'
  const [commissionPercent, setCommissionPercent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, newCommission: null, oldCommission: null });

  // Marketplace configuration state
  const [categories, setCategories] = useState([]);
  const [survivals, setSurvivals] = useState([]);
  const [loadingMarketplace, setLoadingMarketplace] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSurvivalName, setNewSurvivalName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSurvival, setEditingSurvival] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editSurvivalName, setEditSurvivalName] = useState('');
  const [marketplaceError, setMarketplaceError] = useState(null);
  const [marketplaceSuccess, setMarketplaceSuccess] = useState(null);

  // Define fetchMarketplaceConfig before useEffect
  const fetchMarketplaceConfig = async () => {
    try {
      setLoadingMarketplace(true);
      setMarketplaceError(null);

      const [categoriesRes, survivalsRes] = await Promise.all([
        apiClient.get('/api/auth/settings/categories/all'),
        apiClient.get('/api/auth/settings/survivals/all')
      ]);

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.categories || []);
      }

      if (survivalsRes.data.success) {
        setSurvivals(survivalsRes.data.survivals || []);
      }
    } catch (err) {
      setMarketplaceError('Failed to load marketplace configuration');
      console.error('Error fetching marketplace config:', err);
    } finally {
      setLoadingMarketplace(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/api/auth/settings');

        if (response.data.success && response.data.settings) {
          setCommissionPercent(response.data.settings.commissionPercent.toString());
        } else {
          setError('Failed to load settings');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    fetchMarketplaceConfig();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setCommissionPercent(value);
    setValidationError(null);
    setSuccessMessage(null);
    setError(null);
  };

  const validateInput = (value) => {
    const num = parseFloat(value);

    if (value === '' || isNaN(num)) {
      return 'Commission must be a number';
    }

    if (num < 5 || num > 40) {
      return 'Commission must be between 5% and 40%';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);
    setError(null);

    const validation = validateInput(commissionPercent);
    if (validation) {
      setValidationError(validation);
      return;
    }

    // Get current commission for comparison - fetch from API response
    const currentCommission = parseFloat(commissionPercent);
    try {
      const settingsResponse = await apiClient.get('/api/auth/settings');
      const oldCommission = settingsResponse.data.success && settingsResponse.data.settings 
        ? settingsResponse.data.settings.commissionPercent 
        : 20;

      setConfirmModal({
        isOpen: true,
        newCommission: currentCommission,
        oldCommission
      });
    } catch (err) {
      // If fetch fails, use default
      setConfirmModal({
        isOpen: true,
        newCommission: currentCommission,
        oldCommission: 20
      });
    }
  };

  const handleConfirmCommissionUpdate = async () => {
    try {
      setSaving(true);
      setConfirmModal({ isOpen: false, newCommission: null, oldCommission: null });
      setValidationError(null);
      setSuccessMessage(null);
      setError(null);

      const response = await apiClient.put('/api/auth/settings/commission', {
        commissionPercent: confirmModal.newCommission
      });

      if (response.data.success) {
        setSuccessMessage(`Commission percentage updated to ${response.data.commissionPercent}%`);
        // Update local state with the returned value
        setCommissionPercent(response.data.commissionPercent.toString());
      } else {
        setError('Failed to update commission');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update commission');
    } finally {
      setSaving(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  useEffect(() => {
    if (marketplaceSuccess || marketplaceError) {
      const timer = setTimeout(() => {
        setMarketplaceSuccess(null);
        setMarketplaceError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [marketplaceSuccess, marketplaceError]);

  // Category handlers
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const response = await apiClient.post('/api/auth/settings/categories', {
        name: newCategoryName.trim()
      });

      if (response.data.success) {
        setMarketplaceSuccess('Category created successfully');
        setNewCategoryName('');
        await fetchMarketplaceConfig();
      }
    } catch (err) {
      setMarketplaceError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    if (!editCategoryName.trim()) return;

    try {
      const response = await apiClient.put(`/api/auth/settings/categories/${categoryId}`, {
        name: editCategoryName.trim()
      });

      if (response.data.success) {
        setMarketplaceSuccess('Category updated successfully');
        setEditingCategory(null);
        setEditCategoryName('');
        await fetchMarketplaceConfig();
      }
    } catch (err) {
      setMarketplaceError(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleToggleCategory = async (categoryId) => {
    try {
      const response = await apiClient.post(`/api/auth/settings/categories/${categoryId}/disable`);

      if (response.data.success) {
        setMarketplaceSuccess('Category status updated');
        await fetchMarketplaceConfig();
      }
    } catch (err) {
      setMarketplaceError(err.response?.data?.message || 'Failed to update category');
    }
  };

  // Survival handlers
  const handleCreateSurvival = async (e) => {
    e.preventDefault();
    if (!newSurvivalName.trim()) return;

    try {
      const response = await apiClient.post('/api/auth/settings/survivals', {
        name: newSurvivalName.trim()
      });

      if (response.data.success) {
        setMarketplaceSuccess('Survival created successfully');
        setNewSurvivalName('');
        await fetchMarketplaceConfig();
      }
    } catch (err) {
      setMarketplaceError(err.response?.data?.message || 'Failed to create survival');
    }
  };

  const handleUpdateSurvival = async (survivalId) => {
    if (!editSurvivalName.trim()) return;

    try {
      const response = await apiClient.put(`/api/auth/settings/survivals/${survivalId}`, {
        name: editSurvivalName.trim()
      });

      if (response.data.success) {
        setMarketplaceSuccess('Survival updated successfully');
        setEditingSurvival(null);
        setEditSurvivalName('');
        await fetchMarketplaceConfig();
      }
    } catch (err) {
      setMarketplaceError(err.response?.data?.message || 'Failed to update survival');
    }
  };

  const handleToggleSurvival = async (survivalId) => {
    try {
      const response = await apiClient.post(`/api/auth/settings/survivals/${survivalId}/disable`);

      if (response.data.success) {
        setMarketplaceSuccess('Survival status updated');
        await fetchMarketplaceConfig();
      }
    } catch (err) {
      setMarketplaceError(err.response?.data?.message || 'Failed to update survival');
    }
  };

  // Define all styles before early returns
  const containerStyle = {
    maxWidth: '1200px',
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

  const loadingStyle = {
    color: '#b8bcc8',
    textAlign: 'center',
    padding: '80px 20px',
    fontSize: '16px'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Settings</h1>
        <div style={loadingStyle}>Loading settings...</div>
      </div>
    );
  }

  const tabsContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    borderBottom: '2px solid #2d3447'
  };

  const tabStyle = {
    padding: '12px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: '#6b7280',
    borderBottom: '3px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.2s'
  };

  const activeTabStyle = {
    ...tabStyle,
    color: '#fbbf24',
    borderBottomColor: '#fbbf24'
  };

  const sectionStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: isMobile ? '20px' : isTablet ? '24px' : '28px',
    marginBottom: '20px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#ffffff',
    borderBottom: '2px solid #2d3447',
    paddingBottom: '12px'
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

  const inputGroupStyle = {
    marginBottom: '20px'
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

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#ef4444'
  };

  const helpTextStyle = {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '8px'
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '8px',
    fontWeight: '500'
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#fbbf24',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: saving ? 'not-allowed' : 'pointer',
    opacity: saving ? 0.6 : 1,
    transition: 'all 0.2s ease'
  };

  const messageStyle = {
    padding: '14px 18px',
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
    backgroundColor: '#ef4444',
    color: '#ffffff'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Settings</h1>
      <p style={subtitleStyle}>
        Manage platform configuration
      </p>

      {/* Tabs */}
      <div style={tabsContainerStyle}>
        <button
          onClick={() => setActiveTab('commission')}
          style={activeTab === 'commission' ? activeTabStyle : tabStyle}
        >
          Commission
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          style={activeTab === 'marketplace' ? activeTabStyle : tabStyle}
        >
          Marketplace Configuration
        </button>
      </div>

      {/* Commission Tab */}
      {activeTab === 'commission' && (
        <>
          {/* Success Message */}
          {successMessage && (
            <div style={successMessageStyle}>
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={errorMessageStyle}>
              {error}
            </div>
          )}

          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>Commission Settings</div>

            <form onSubmit={handleSubmit}>
              <div style={inputGroupStyle}>
                <label style={labelStyle} htmlFor="commissionPercent">
                  Commission Percentage (%)
                </label>
                <input
                  type="number"
                  id="commissionPercent"
                  value={commissionPercent}
                  onChange={handleChange}
                  min="5"
                  max="40"
                  step="0.1"
                  style={validationError ? errorInputStyle : inputStyle}
                  placeholder="Enter commission percentage"
                  onFocus={(e) => {
                    if (!validationError) {
                      e.target.style.borderColor = '#fbbf24';
                      e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!validationError) {
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
                />
                <div style={helpTextStyle}>
                  Valid range: 5% to 40%. This percentage will be applied to all new orders.
                </div>
                {validationError && (
                  <div style={errorStyle}>{validationError}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.target.style.backgroundColor = '#f59e0b';
                    e.target.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving) {
                    e.target.style.backgroundColor = '#fbbf24';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                {saving ? 'Saving...' : 'Update Commission'}
              </button>
            </form>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#1a1f35',
              border: '1px solid #2d3447',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#b8bcc8',
              lineHeight: '1.6'
            }}>
              <strong style={{ color: '#ffffff' }}>Note:</strong> Changes to commission percentage will only affect new orders completed after this update. Existing transactions will not be affected.
            </div>
          </div>
        </>
      )}

      {/* Marketplace Configuration Tab */}
      {activeTab === 'marketplace' && (
        <>
          {marketplaceSuccess && (
            <div style={successMessageStyle}>
              {marketplaceSuccess}
            </div>
          )}

          {marketplaceError && (
            <div style={errorMessageStyle}>
              {marketplaceError}
            </div>
          )}

          {loadingMarketplace ? (
            <div style={sectionStyle}>
              <div style={{ color: '#b8bcc8' }}>Loading marketplace configuration...</div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile 
                ? '1fr' 
                : isTablet 
                  ? 'repeat(2, 1fr)' 
                  : 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: isMobile ? '20px' : isTablet ? '20px' : '24px'
            }}>
              {/* Categories Management */}
              <div style={sectionStyle}>
                <div style={sectionTitleStyle}>Item Categories</div>

                <form onSubmit={handleCreateCategory} style={{ 
                  marginBottom: '20px', 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '12px' : '8px' 
                }}>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name (e.g., Weapon, Armor)"
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fbbf24';
                      e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#2d3447';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button type="submit" style={{ ...buttonStyle, width: isMobile ? '100%' : 'auto' }}>
                    Add Category
                  </button>
                </form>

                {categories.length === 0 ? (
                  <div style={{ color: '#6b7280', fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>No categories configured</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {categories.map((category) => (
                      <div key={category._id} style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'stretch' : 'center',
                        gap: isMobile ? '12px' : '12px',
                        padding: isMobile ? '12px' : '14px',
                        border: '1px solid #2d3447',
                        borderRadius: '8px',
                        backgroundColor: category.active ? '#1a1f35' : '#131829'
                      }}>
                        {editingCategory === category._id ? (
                          <>
                            <input
                              type="text"
                              value={editCategoryName}
                              onChange={(e) => setEditCategoryName(e.target.value)}
                              style={{ ...inputStyle, flex: 1, margin: 0 }}
                              autoFocus
                              onFocus={(e) => {
                                e.target.style.borderColor = '#fbbf24';
                                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#2d3447';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                            <button
                              onClick={() => handleUpdateCategory(category._id)}
                              style={{ ...buttonStyle, padding: '8px 16px', fontSize: '13px' }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f59e0b';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#fbbf24';
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingCategory(null);
                                setEditCategoryName('');
                              }}
                              style={{
                                padding: '8px 16px',
                                border: '1px solid #2d3447',
                                borderRadius: '6px',
                                backgroundColor: '#1a1f35',
                                color: '#b8bcc8',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#252b42';
                                e.target.style.color = '#ffffff';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#1a1f35';
                                e.target.style.color = '#b8bcc8';
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ flex: 1, fontWeight: category.active ? '600' : '400', color: category.active ? '#ffffff' : '#6b7280', fontSize: '14px' }}>
                              {category.name}
                              {!category.active && <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '12px' }}>(Disabled)</span>}
                            </span>
                            <button
                              onClick={() => {
                                setEditingCategory(category._id);
                                setEditCategoryName(category.name);
                              }}
                              style={{
                                padding: '6px 12px',
                                border: '1px solid #3b82f6',
                                borderRadius: '4px',
                                backgroundColor: '#fff',
                                color: '#3b82f6',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              Rename
                            </button>
                            <button
                              onClick={() => handleToggleCategory(category._id)}
                              style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '6px',
                                backgroundColor: category.active ? '#f59e0b' : '#10b981',
                                color: '#ffffff',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.opacity = '0.9';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.opacity = '1';
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              {category.active ? 'Disable' : 'Enable'}
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Survivals Management */}
              <div style={sectionStyle}>
                <div style={sectionTitleStyle}>Survivals / Worlds</div>

                <form onSubmit={handleCreateSurvival} style={{ 
                  marginBottom: '20px', 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '12px' : '8px' 
                }}>
                  <input
                    type="text"
                    value={newSurvivalName}
                    onChange={(e) => setNewSurvivalName(e.target.value)}
                    placeholder="Enter survival/world name (e.g., Survival-1, Hardcore)"
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fbbf24';
                      e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#2d3447';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button type="submit" style={{ ...buttonStyle, width: isMobile ? '100%' : 'auto' }}>
                    Add Survival
                  </button>
                </form>

                {survivals.length === 0 ? (
                  <div style={{ color: '#6b7280', fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>No survivals configured</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {survivals.map((survival) => (
                      <div key={survival._id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px',
                        border: '1px solid #2d3447',
                        borderRadius: '8px',
                        backgroundColor: survival.active ? '#1a1f35' : '#131829'
                      }}>
                        {editingSurvival === survival._id ? (
                          <>
                            <input
                              type="text"
                              value={editSurvivalName}
                              onChange={(e) => setEditSurvivalName(e.target.value)}
                              style={{ ...inputStyle, flex: 1, margin: 0 }}
                              autoFocus
                              onFocus={(e) => {
                                e.target.style.borderColor = '#fbbf24';
                                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#2d3447';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                            <button
                              onClick={() => handleUpdateSurvival(survival._id)}
                              style={{ ...buttonStyle, padding: '8px 16px', fontSize: '13px' }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f59e0b';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#fbbf24';
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingSurvival(null);
                                setEditSurvivalName('');
                              }}
                              style={{
                                padding: '8px 16px',
                                border: '1px solid #2d3447',
                                borderRadius: '6px',
                                backgroundColor: '#1a1f35',
                                color: '#b8bcc8',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#252b42';
                                e.target.style.color = '#ffffff';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#1a1f35';
                                e.target.style.color = '#b8bcc8';
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ flex: 1, fontWeight: survival.active ? '600' : '400', color: survival.active ? '#ffffff' : '#6b7280', fontSize: '14px' }}>
                              {survival.name}
                              {!survival.active && <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '12px' }}>(Disabled)</span>}
                            </span>
                            <button
                              onClick={() => {
                                setEditingSurvival(survival._id);
                                setEditSurvivalName(survival.name);
                              }}
                              style={{
                                padding: '8px 16px',
                                border: '1px solid #fbbf24',
                                borderRadius: '6px',
                                backgroundColor: 'transparent',
                                color: '#fbbf24',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#fbbf24';
                                e.target.style.color = '#0a0e27';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#fbbf24';
                              }}
                            >
                              Rename
                            </button>
                            <button
                              onClick={() => handleToggleSurvival(survival._id)}
                              style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '6px',
                                backgroundColor: survival.active ? '#f59e0b' : '#10b981',
                                color: '#ffffff',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.opacity = '0.9';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.opacity = '1';
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              {survival.active ? 'Disable' : 'Enable'}
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal for Commission Update */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, newCommission: null, oldCommission: null })}
        onConfirm={handleConfirmCommissionUpdate}
        title="Update Commission Percentage"
        message={`Are you sure you want to change the commission percentage from ${confirmModal.oldCommission}% to ${confirmModal.newCommission}%? This will affect all future transactions.`}
        confirmText="Update Commission"
        isDestructive={false}
        isLoading={saving}
      />
    </div>
  );
}

export default Settings;

