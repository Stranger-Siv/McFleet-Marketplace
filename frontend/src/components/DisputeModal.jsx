import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

function DisputeModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onSubmit({ reason: reason.trim(), description: description.trim() });
    setShowConfirm(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason('');
      setDescription('');
      setShowConfirm(false);
      onClose();
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
    zIndex: 10000,
    padding: '20px'
  };

  const modalContentStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
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

  const warningStyle = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    fontSize: '14px',
    lineHeight: '1.6'
  };

  const labelStyle = {
    display: 'block',
    color: '#b8bcc8',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#1a1f35',
    border: '1px solid #2d3447',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit',
    marginBottom: '16px',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  };

  const cancelButtonStyle = {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#2d3447',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? 0.6 : 1,
    transition: 'all 0.2s ease'
  };

  const submitButtonStyle = {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? 0.6 : 1,
    transition: 'all 0.2s ease'
  };

  return (
    <>
      <div style={modalOverlayStyle} onClick={handleClose}>
        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
          <h2 style={titleStyle}>Raise Dispute</h2>
          
          <div style={warningStyle}>
            <strong>⚠️ Warning:</strong> Raising a dispute will freeze this order. 
            All order actions will be locked until an admin resolves the dispute.
          </div>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>
              Reason <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Item not received, Wrong item, Payment issue"
              style={inputStyle}
              required
              disabled={isLoading}
              onFocus={(e) => {
                e.target.style.borderColor = '#fbbf24';
                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2d3447';
                e.target.style.boxShadow = 'none';
              }}
            />

            <label style={labelStyle}>
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional details about the issue..."
              style={textareaStyle}
              disabled={isLoading}
              onFocus={(e) => {
                e.target.style.borderColor = '#fbbf24';
                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2d3447';
                e.target.style.boxShadow = 'none';
              }}
            />

            <div style={buttonGroupStyle}>
              <button
                type="button"
                onClick={handleClose}
                style={cancelButtonStyle}
                disabled={isLoading}
                onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#252b42')}
                onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#2d3447')}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={submitButtonStyle}
                disabled={isLoading || !reason.trim()}
                onMouseEnter={(e) => !isLoading && reason.trim() && (e.target.style.backgroundColor = '#dc2626')}
                onMouseLeave={(e) => !isLoading && reason.trim() && (e.target.style.backgroundColor = '#ef4444')}
              >
                {isLoading ? 'Submitting...' : 'Submit Dispute'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Confirm Dispute"
        message={`Are you sure you want to raise a dispute for this order? The order will be frozen and cannot be modified until an admin resolves it.`}
        confirmText="Yes, Raise Dispute"
        isDestructive={true}
        isLoading={isLoading}
      />
    </>
  );
}

export default DisputeModal;

