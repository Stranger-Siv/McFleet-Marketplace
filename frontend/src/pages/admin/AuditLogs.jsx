import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { usePolling } from '../../hooks/usePolling';
import { useResponsive } from '../../hooks/useResponsive';
import LoadingSpinner from '../../components/LoadingSpinner';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isMobile, isTablet } = useResponsive();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/auth/audit-logs');

      if (response.data.success && response.data.logs) {
        setLogs(response.data.logs);
      } else {
        setError('Failed to load audit logs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLogs();
  }, []);

  // Set up polling (30 seconds interval)
  usePolling(fetchLogs, 30000);

  const getActionLabel = (action) => {
    const actionLabels = {
      'APPROVE_SELLER': 'Approved Seller',
      'REJECT_SELLER': 'Rejected Seller Request',
      'BAN_USER': 'Banned User',
      'UNBAN_USER': 'Unbanned User',
      'MAKE_MIDDLEMAN': 'Made Middleman',
      'REMOVE_MIDDLEMAN': 'Removed Middleman',
      'ASSIGN_MIDDLEMAN': 'Assigned Middleman',
      'DISABLE_LISTING': 'Disabled Listing',
      'REMOVE_LISTING': 'Removed Listing',
      'COMPLETE_ORDER': 'Completed Order',
      'MARK_PAYOUT': 'Marked Payout as Paid',
      'UPDATE_COMMISSION': 'Updated Commission',
      'CREATE_CATEGORY': 'Created Category',
      'UPDATE_CATEGORY': 'Updated Category',
      'ENABLE_CATEGORY': 'Enabled Category',
      'DISABLE_CATEGORY': 'Disabled Category',
      'CREATE_SURVIVAL': 'Created Survival',
      'UPDATE_SURVIVAL': 'Updated Survival',
      'ENABLE_SURVIVAL': 'Enabled Survival',
      'DISABLE_SURVIVAL': 'Disabled Survival'
    };
    return actionLabels[action] || action;
  };

  const getActionColor = (action) => {
    if (action.includes('APPROVE') || action.includes('ENABLE') || action.includes('UNBAN')) {
      return '#10b981'; // green
    }
    if (action.includes('REJECT') || action.includes('BAN') || action.includes('DISABLE') || action.includes('REMOVE')) {
      return '#ef4445'; // red
    }
    if (action.includes('UPDATE') || action.includes('ASSIGN') || action.includes('COMPLETE') || action.includes('MARK')) {
      return '#3b82f6'; // blue
    }
    if (action.includes('CREATE') || action.includes('MAKE')) {
      return '#8b5cf6'; // purple
    }
    return '#6b7280'; // gray
  };

  const getTargetLabel = (targetType, targetId) => {
    return `${targetType.charAt(0).toUpperCase() + targetType.slice(1)} #${targetId.toString().slice(-6)}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobile ? '16px' : isTablet ? '20px' : '24px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '700',
    marginBottom: isMobile ? '8px' : '8px'
  };

  const subtitleStyle = {
    color: '#9ca3af',
    fontSize: isMobile ? '13px' : '14px',
    marginBottom: isMobile ? '16px' : '24px'
  };

  const errorStyle = {
    backgroundColor: '#ed4245',
    color: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500'
  };

  const tableContainerStyle = {
    overflowX: 'auto',
    backgroundColor: '#1e2338',
    border: '1px solid #2d3447',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const thStyle = {
    backgroundColor: '#131829',
    padding: '16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#b8bcc8',
    borderBottom: '1px solid #2d3447',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    position: 'sticky',
    top: 0,
    zIndex: 10
  };

  const tdStyle = {
    padding: '16px',
    borderBottom: '1px solid #2d3447',
    color: '#ffffff',
    fontSize: '14px',
    backgroundColor: '#1e2338'
  };

  const actionBadgeStyle = (action) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: getActionColor(action)
  });

  const noteStyle = {
    fontSize: '12px',
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: '4px'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: isMobile ? '40px 16px' : '60px 20px',
    color: '#b8bcc8',
    backgroundColor: '#1e2338',
    borderRadius: '12px',
    border: '1px solid #2d3447'
  };

  const mobileCardListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '12px'
  };

  const mobileCardStyle = {
    backgroundColor: '#1e2338',
    borderRadius: '12px',
    border: '1px solid #2d3447',
    padding: '14px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  };

  const mobileRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#e5e7eb'
  };

  const mobileLabelStyle = {
    color: '#9ca3af',
    fontWeight: 500,
    marginRight: '6px'
  };

  return (
    <div style={containerStyle}>
      {loading ? (
        <>
          <h1 style={titleStyle}>Audit Logs</h1>
          <div style={{ textAlign: 'center', padding: '40px', color: '#b8bcc8' }}>
            <LoadingSpinner size="32px" /> Loading audit logs...
          </div>
        </>
      ) : error ? (
        <>
          <h1 style={titleStyle}>Audit Logs</h1>
          <div style={errorStyle}>Error: {error}</div>
        </>
      ) : (
        <>
          <h1 style={titleStyle}>Audit Logs</h1>
          <p style={subtitleStyle}>
            Complete record of all admin actions. Logs are immutable and read-only.
          </p>

          {logs.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '24px', marginBottom: '12px', color: '#ffffff' }}>
                No audit logs found
              </div>
              <div style={{ fontSize: '14px' }}>
                Audit logs will appear here as admin actions are performed.
              </div>
            </div>
          ) : isMobile ? (
            <div style={mobileCardListStyle}>
              {logs.map((log) => (
                <div key={log._id} style={mobileCardStyle}>
                  <div style={mobileRowStyle}>
                    <span style={actionBadgeStyle(log.action)}>
                      {getActionLabel(log.action)}
                    </span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                      {formatDateTime(log.createdAt)}
                    </span>
                  </div>
                  <div style={mobileRowStyle}>
                    <span style={mobileLabelStyle}>Target</span>
                    <span style={{ fontSize: '13px', color: '#e5e7eb' }}>
                      {getTargetLabel(log.targetType, log.targetId)}
                    </span>
                  </div>
                  <div style={mobileRowStyle}>
                    <span style={mobileLabelStyle}>By</span>
                    <span style={{ fontSize: '13px', color: '#e5e7eb' }}>
                      {log.admin?.discordUsername || 'Unknown'}
                    </span>
                  </div>
                  {log.note && (
                    <div style={{ fontSize: '12px', color: '#e5e7eb', marginTop: '4px' }}>
                      {log.note}
                    </div>
                  )}
                  {!log.note && (
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>—</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Action</th>
                    <th style={thStyle}>Target</th>
                    <th style={thStyle}>Performed By</th>
                    <th style={thStyle}>Date & Time</th>
                    <th style={thStyle}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log._id}
                      style={{
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#252b42';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1e2338';
                      }}
                    >
                      <td style={tdStyle}>
                        <span style={actionBadgeStyle(log.action)}>
                          {getActionLabel(log.action)}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {getTargetLabel(log.targetType, log.targetId)}
                      </td>
                      <td style={tdStyle}>
                        <strong>{log.admin?.discordUsername || 'Unknown'}</strong>
                      </td>
                      <td style={tdStyle}>
                        {formatDateTime(log.createdAt)}
                      </td>
                      <td style={tdStyle}>
                        {log.note ? (
                          <div>
                            <div style={{ color: '#ffffff' }}>{log.note}</div>
                          </div>
                        ) : (
                          <span style={{ color: '#6b7280', fontSize: '13px' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AuditLogs;

