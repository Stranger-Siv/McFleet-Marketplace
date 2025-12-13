function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false
}) {
  if (!isOpen) return null;

  const overlayStyle = {
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

  const modalStyle = {
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    animation: 'fadeIn 0.2s ease-in'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '12px'
  };

  const messageStyle = {
    color: '#b8bcc8',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '24px'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  };

  const cancelButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#2d3447',
    color: '#ffffff',
    border: '1px solid #2d3447',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? 0.6 : 1,
    transition: 'all 0.2s ease'
  };

  const confirmButtonStyle = {
    padding: '10px 20px',
    backgroundColor: isDestructive ? '#ef4245' : '#fbbf24',
    color: isDestructive ? '#ffffff' : '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? 0.6 : 1,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div style={overlayStyle} onClick={!isLoading ? onClose : undefined}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h2 style={titleStyle}>{title}</h2>
          <p style={messageStyle}>{message}</p>
          <div style={buttonGroupStyle}>
            <button
              onClick={onClose}
              disabled={isLoading}
              style={cancelButtonStyle}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#3a4157';
                  e.target.style.borderColor = '#3a4157';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#2d3447';
                  e.target.style.borderColor = '#2d3447';
                }
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              style={confirmButtonStyle}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = isDestructive ? '#dc2626' : '#f59e0b';
                  e.target.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = isDestructive ? '#ef4245' : '#fbbf24';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              {isLoading && (
                <span style={{
                  width: '14px',
                  height: '14px',
                  border: `2px solid ${isDestructive ? '#ffffff20' : '#0a0e2720'}`,
                  borderTop: `2px solid ${isDestructive ? '#ffffff' : '#0a0e27'}`,
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  display: 'inline-block'
                }}></span>
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default ConfirmationModal;

