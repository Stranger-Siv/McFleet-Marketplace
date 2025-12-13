import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { usePolling } from '../../hooks/usePolling';
import ConfirmationModal from '../../components/ConfirmationModal';

function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, userId: null, username: null });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/auth/users');

      if (response.data.success && response.data.users) {
        setUsers(response.data.users);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Set up polling (7 seconds interval)
  usePolling(fetchUsers, 7000);

  const handleBanClick = (userId, username) => {
    // Prevent self-ban
    if (userId === currentUser?.userId) {
      setActionError('Cannot ban yourself');
      return;
    }
    setConfirmModal({
      isOpen: true,
      action: 'ban',
      userId,
      username
    });
  };

  const handleBan = async (userId) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      setActionError(null);
      setActionMessage(null);
      setConfirmModal({ isOpen: false, action: null, userId: null, username: null });

      const response = await apiClient.post(`/api/auth/users/${userId}/ban`);

      if (response.data.success) {
        setActionMessage('User banned successfully');
        await fetchUsers();
      } else {
        setActionError('Failed to ban user');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to ban user');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleUnbanClick = (userId, username) => {
    setConfirmModal({
      isOpen: true,
      action: 'unban',
      userId,
      username
    });
  };

  const handleUnban = async (userId) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      setActionError(null);
      setActionMessage(null);
      setConfirmModal({ isOpen: false, action: null, userId: null, username: null });

      const response = await apiClient.post(`/api/auth/users/${userId}/unban`);

      if (response.data.success) {
        setActionMessage('User unbanned successfully');
        await fetchUsers();
      } else {
        setActionError('Failed to unban user');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to unban user');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleMakeMiddleman = async (userId) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      setActionError(null);
      setActionMessage(null);

      const response = await apiClient.post(`/api/auth/users/${userId}/make-middleman`);

      if (response.data.success) {
        setActionMessage('User promoted to middleman successfully');
        await fetchUsers();
      } else {
        setActionError('Failed to make user middleman');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to make user middleman');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleRemoveMiddleman = async (userId) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      setActionError(null);
      setActionMessage(null);

      const response = await apiClient.post(`/api/auth/users/${userId}/remove-middleman`);

      if (response.data.success) {
        setActionMessage('Middleman role removed successfully');
        await fetchUsers();
      } else {
        setActionError('Failed to remove middleman role');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to remove middleman role');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (actionMessage || actionError) {
      const timer = setTimeout(() => {
        setActionMessage(null);
        setActionError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage, actionError]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#ef4444'; // red
      case 'seller':
        return '#3b82f6'; // blue
      case 'middleman':
        return '#8b5cf6'; // purple
      default:
        return '#6b7280'; // gray
    }
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '24px'
  };

  const loadingStyle = {
    color: '#b9bbbe',
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px'
  };

  const errorStyle = {
    backgroundColor: '#ed4245',
    color: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px'
  };

  if (loading) {
    return <div style={loadingStyle}>Loading users...</div>;
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>User Management</h1>
        <div style={errorStyle}>Error: {error}</div>
      </div>
    );
  }

  const tableContainerStyle = {
    overflowX: 'auto',
    marginTop: '20px',
    backgroundColor: '#2f3136',
    borderRadius: '8px',
    border: '1px solid #40444b',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#2f3136',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const thStyle = {
    backgroundColor: '#202225',
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#dcddde',
    borderBottom: '1px solid #40444b',
    fontSize: '14px'
  };

  const tdStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #40444b',
    color: '#dcddde',
    fontSize: '14px',
    transition: 'background-color 0.2s ease'
  };

  const statusBadgeStyle = (banned) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: banned ? '#ed4245' : '#3ba55d'
  });

  const roleBadgeStyle = (role) => {
    const colors = {
      admin: '#ed4245',
      seller: '#5865f2',
      middleman: '#8b5cf6',
      user: '#72767d'
    };
    return {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: colors[role] || '#72767d'
    };
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  };

  const buttonStyle = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  };

  const banButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ed4245',
    color: '#ffffff'
  };

  const unbanButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3ba55d',
    color: '#ffffff'
  };

  const middlemanButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#8b5cf6',
    color: '#ffffff'
  };

  const removeMiddlemanButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#faa61a',
    color: '#ffffff'
  };

  const disabledButtonStyle = {
    opacity: 0.5,
    cursor: 'not-allowed'
  };

  const messageStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px'
  };

  const successMessageStyle = {
    ...messageStyle,
    backgroundColor: '#3ba55d',
    color: '#ffffff'
  };

  const errorMessageStyle = {
    ...messageStyle,
    backgroundColor: '#ed4245',
    color: '#ffffff'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#b9bbbe',
    backgroundColor: '#2f3136',
    borderRadius: '8px',
    marginTop: '20px',
    border: '1px solid #40444b'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>User Management</h1>

      {/* Success/Error Messages */}
      {actionMessage && (
        <div style={successMessageStyle}>
          {actionMessage}
        </div>
      )}

      {actionError && (
        <div style={errorMessageStyle}>
          {actionError}
        </div>
      )}

      {users.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '24px', marginBottom: '12px', color: '#b9bbbe' }}>
            No users found
          </div>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isCurrentUser = user._id === currentUser?.userId;
                const isLoading = actionLoading[user._id];

                return (
                  <tr 
                    key={user._id}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#40444b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={tdStyle}>
                      <span style={{ color: '#ffffff', fontWeight: '500' }}>
                        {user.discordUsername || 'Unknown'}
                      </span>
                      {isCurrentUser && (
                        <span style={{ marginLeft: '8px', fontSize: '12px', color: '#72767d' }}>
                          (You)
                        </span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <span style={roleBadgeStyle(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(user.banned)}>
                        {user.banned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={buttonGroupStyle}>
                        {user.banned ? (
                          <button
                            onClick={() => handleUnbanClick(user._id, user.discordUsername)}
                            disabled={isLoading || isCurrentUser}
                            style={{
                              ...unbanButtonStyle,
                              ...(isLoading || isCurrentUser ? disabledButtonStyle : {})
                            }}
                            onMouseEnter={(e) => !isLoading && !isCurrentUser && (e.target.style.backgroundColor = '#2d8f4f')}
                            onMouseLeave={(e) => !isLoading && !isCurrentUser && (e.target.style.backgroundColor = '#3ba55d')}
                          >
                            {isLoading ? 'Processing...' : 'Unban'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBanClick(user._id, user.discordUsername)}
                            disabled={isLoading || isCurrentUser || user.role === 'admin'}
                            style={{
                              ...banButtonStyle,
                              ...(isLoading || isCurrentUser || user.role === 'admin' ? disabledButtonStyle : {})
                            }}
                            title={user.role === 'admin' ? 'Cannot ban admin' : isCurrentUser ? 'Cannot ban yourself' : ''}
                            onMouseEnter={(e) => !isLoading && !isCurrentUser && user.role !== 'admin' && (e.target.style.backgroundColor = '#c03537')}
                            onMouseLeave={(e) => !isLoading && !isCurrentUser && user.role !== 'admin' && (e.target.style.backgroundColor = '#ed4245')}
                          >
                            {isLoading ? 'Processing...' : 'Ban'}
                          </button>
                        )}

                        {user.role === 'middleman' ? (
                          <button
                            onClick={() => handleRemoveMiddleman(user._id)}
                            disabled={isLoading || isCurrentUser}
                            style={{
                              ...removeMiddlemanButtonStyle,
                              ...(isLoading || isCurrentUser ? disabledButtonStyle : {})
                            }}
                            onMouseEnter={(e) => !isLoading && !isCurrentUser && (e.target.style.backgroundColor = '#d4941a')}
                            onMouseLeave={(e) => !isLoading && !isCurrentUser && (e.target.style.backgroundColor = '#faa61a')}
                          >
                            {isLoading ? 'Processing...' : 'Remove Middleman'}
                          </button>
                        ) : user.role !== 'admin' && (
                          <button
                            onClick={() => handleMakeMiddleman(user._id)}
                            disabled={isLoading || isCurrentUser}
                            style={{
                              ...middlemanButtonStyle,
                              ...(isLoading || isCurrentUser ? disabledButtonStyle : {})
                            }}
                            onMouseEnter={(e) => !isLoading && !isCurrentUser && (e.target.style.backgroundColor = '#7c3aed')}
                            onMouseLeave={(e) => !isLoading && !isCurrentUser && (e.target.style.backgroundColor = '#8b5cf6')}
                          >
                            {isLoading ? 'Processing...' : 'Make Middleman'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, userId: null, username: null })}
        onConfirm={() => {
          if (confirmModal.action === 'ban') {
            handleBan(confirmModal.userId);
          } else if (confirmModal.action === 'unban') {
            handleUnban(confirmModal.userId);
          }
        }}
        title={confirmModal.action === 'ban' ? 'Ban User' : 'Unban User'}
        message={
          confirmModal.action === 'ban'
            ? `Are you sure you want to ban "${confirmModal.username}"? This action will prevent them from accessing the platform.`
            : `Are you sure you want to unban "${confirmModal.username}"? They will regain access to the platform.`
        }
        confirmText={confirmModal.action === 'ban' ? 'Ban User' : 'Unban User'}
        isDestructive={confirmModal.action === 'ban'}
        isLoading={confirmModal.userId && actionLoading[confirmModal.userId]}
      />
    </div>
  );
}

export default Users;

