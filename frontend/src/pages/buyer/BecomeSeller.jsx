import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function BecomeSeller() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [sellerRequestStatus, setSellerRequestStatus] = useState(null);
  const [rejectionTime, setRejectionTime] = useState(null);
  const [hoursRemaining, setHoursRemaining] = useState(null);

  useEffect(() => {
    const checkSellerRequest = async () => {
      try {
        setChecking(true);
        // Fetch current user data to get seller request status
        const response = await apiClient.get('/api/auth/me');
        
        if (response.data.success) {
          const userData = response.data.user;
          
          // If user is already a seller, redirect to seller dashboard
          if (userData.role === 'seller') {
            navigate('/seller/dashboard', { replace: true });
            return;
          }
          
          // Set seller request status if exists
          if (userData.sellerRequest) {
            setSellerRequestStatus(userData.sellerRequest.status);
            // If rejected, store rejection time for countdown
            if (userData.sellerRequest.status === 'rejected' && userData.sellerRequest.updatedAt) {
              setRejectionTime(new Date(userData.sellerRequest.updatedAt));
            }
          }
        }
      } catch (err) {
        console.error('Error checking seller request:', err);
      } finally {
        setChecking(false);
      }
    };

    checkSellerRequest();
  }, [navigate]);

  // Countdown timer for rejected requests
  useEffect(() => {
    if (!rejectionTime || sellerRequestStatus !== 'rejected') {
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = rejectionTime.getTime() + (24 * 60 * 60 * 1000) - now.getTime();
      
      if (timeDiff > 0) {
        const hours = Math.ceil(timeDiff / (1000 * 60 * 60));
        setHoursRemaining(hours);
      } else {
        setHoursRemaining(0);
      }
    };

    // Update immediately
    updateCountdown();

    // Update every minute
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [rejectionTime, sellerRequestStatus]);

  const handleSubmitRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await apiClient.post('/api/auth/seller-request');

      if (response.data.success) {
        setSuccessMessage('Seller request sent for admin approval');
        setSellerRequestStatus('pending');
        
        // Update user context with new seller request status
        const meResponse = await apiClient.get('/api/auth/me');
        if (meResponse.data.success) {
          const token = localStorage.getItem('token');
          if (token) {
            login(token, meResponse.data.user);
          }
        }
      } else {
        setError('Failed to submit seller request');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit seller request';
      const hoursRemaining = err.response?.data?.hoursRemaining;
      const canResubmitAt = err.response?.data?.canResubmitAt;
      
      setError(message);
      
      // If there's a cooldown, set the rejection time and hours remaining
      if (hoursRemaining !== undefined && canResubmitAt) {
        setRejectionTime(new Date(canResubmitAt));
        setHoursRemaining(hoursRemaining);
        setSellerRequestStatus('rejected'); // Show as rejected to display cooldown
      }
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If user is already a seller, this shouldn't render, but just in case
  if (user?.role === 'seller') {
    return null;
  }

  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#333'
  };

  const descriptionStyle = {
    color: '#666',
    marginBottom: '24px',
    lineHeight: '1.6'
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s'
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  };

  const statusCardStyle = {
    padding: '16px',
    borderRadius: '6px',
    marginBottom: '20px',
    border: '1px solid'
  };

  const pendingStatusStyle = {
    ...statusCardStyle,
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
    color: '#92400e'
  };

  const approvedStatusStyle = {
    ...statusCardStyle,
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
    color: '#065f46'
  };

  const rejectedStatusStyle = {
    ...statusCardStyle,
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
    color: '#991b1b'
  };

  const successMessageStyle = {
    backgroundColor: '#d1fae5',
    border: '1px solid #10b981',
    color: '#065f46',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px'
  };

  const errorMessageStyle = {
    backgroundColor: '#fee2e2',
    border: '1px solid #ef4444',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px'
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return 'Your seller request is pending admin approval.';
      case 'approved':
        return 'Your seller request has been approved! Please refresh the page or log out and log back in to access seller features.';
      case 'rejected':
        if (hoursRemaining !== null && hoursRemaining > 0) {
          return `Your seller request was rejected. You can resubmit after ${hoursRemaining} hour(s).`;
        } else if (hoursRemaining === 0) {
          return 'Your seller request was rejected. You can now submit a new request.';
        }
        return 'Your seller request was rejected. You can submit a new request if needed.';
      default:
        return '';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return pendingStatusStyle;
      case 'approved':
        return approvedStatusStyle;
      case 'rejected':
        return rejectedStatusStyle;
      default:
        return {};
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Become a Seller</h1>
        <p style={descriptionStyle}>
          Request seller access to start listing items on the marketplace. 
          Your request will be reviewed by an admin, and you'll be notified once a decision is made.
        </p>

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

        {/* Seller Request Status */}
        {sellerRequestStatus && (
          <div style={getStatusStyle(sellerRequestStatus)}>
            <strong>Status: {sellerRequestStatus.charAt(0).toUpperCase() + sellerRequestStatus.slice(1)}</strong>
            <p style={{ margin: '8px 0 0 0' }}>{getStatusMessage(sellerRequestStatus)}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmitRequest}
          disabled={loading || sellerRequestStatus === 'pending' || sellerRequestStatus === 'approved' || (sellerRequestStatus === 'rejected' && hoursRemaining !== null && hoursRemaining > 0)}
          style={loading || sellerRequestStatus === 'pending' || sellerRequestStatus === 'approved' || (sellerRequestStatus === 'rejected' && hoursRemaining !== null && hoursRemaining > 0) ? disabledButtonStyle : buttonStyle}
        >
          {loading
            ? 'Submitting...'
            : sellerRequestStatus === 'pending'
            ? 'Request Pending'
            : sellerRequestStatus === 'approved'
            ? 'Request Approved'
            : sellerRequestStatus === 'rejected' && hoursRemaining !== null && hoursRemaining > 0
            ? `Resubmit in ${hoursRemaining} hour(s)`
            : sellerRequestStatus === 'rejected'
            ? 'Submit New Request'
            : 'Request Seller Access'}
        </button>
      </div>
    </div>
  );
}

export default BecomeSeller;

