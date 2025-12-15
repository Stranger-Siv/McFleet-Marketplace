import { useEffect, useMemo, useState } from 'react';
import apiClient from '../api/axios';

function MiddlemanInstructions({
  orderId,
  order,
  user,
  allowCreate = false,
  tone = 'dark',
  onPendingChange
}) {
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    targetRole: 'buyer',
    targetUserId: '',
    message: '',
    discordId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [ackLoadingId, setAckLoadingId] = useState(null);

  const targetOptions = useMemo(() => {
    const options = [];
    if (order?.buyer?._id) {
      options.push({
        role: 'buyer',
        userId: order.buyer._id,
        label: `Buyer – ${order.buyer.discordUsername || 'Buyer'}`
      });
    }
    if (order?.seller?._id) {
      options.push({
        role: 'seller',
        userId: order.seller._id,
        label: `Seller – ${order.seller.discordUsername || 'Seller'}`
      });
    }
    return options;
  }, [order]);

  useEffect(() => {
    if (targetOptions.length > 0) {
      setForm((prev) => ({
        ...prev,
        targetRole: targetOptions[0].role,
        targetUserId: targetOptions[0].userId
      }));
    }
  }, [targetOptions]);

  const fetchInstructions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/api/auth/orders/${orderId}/instructions`);
      if (response.data.success) {
        setInstructions(response.data.instructions || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load instructions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchInstructions();
    }
  }, [orderId]);

  useEffect(() => {
    if (onPendingChange) {
      const hasPending = instructions.some((inst) => inst.status === 'PENDING');
      onPendingChange(hasPending);
    }
  }, [instructions, onPendingChange]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) {
      setError('Instruction message is required');
      return;
    }
    if (!form.targetUserId) {
      setError('Select a target user');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      await apiClient.post(`/api/auth/orders/${orderId}/instructions`, {
        targetRole: form.targetRole,
        targetUserId: form.targetUserId,
        message: form.message.trim(),
        discordId: form.discordId?.trim() || undefined
      });
      setSuccess('Instruction sent');
      setForm((prev) => ({
        ...prev,
        message: '',
        discordId: ''
      }));
      await fetchInstructions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send instruction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcknowledge = async (instructionId) => {
    try {
      setAckLoadingId(instructionId);
      setError(null);
      await apiClient.patch(`/api/auth/instructions/${instructionId}/acknowledge`);
      await fetchInstructions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to acknowledge instruction');
    } finally {
      setAckLoadingId(null);
    }
  };

  const colors = tone === 'light'
    ? {
        card: '#ffffff',
        border: '#e5e7eb',
        text: '#111827',
        muted: '#6b7280',
        badgePending: '#f97316',
        badgeDone: '#10b981',
        highlight: '#fef9c3',
        flashBg: '#fff7ed'
      }
    : {
        card: '#1e2338',
        border: '#2d3447',
        text: '#ffffff',
        muted: '#9ca3af',
        badgePending: '#f97316',
        badgeDone: '#10b981',
        highlight: '#1f2937',
        flashBg: '#241d16'
      };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          padding: '16px',
          boxShadow: tone === 'light' ? '0 2px 8px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.35)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🛡</span>
            <div style={{ color: colors.text, fontWeight: 700, fontSize: '16px' }}>Middleman Instruction</div>
          </div>
          {instructions.some((inst) => inst.status === 'PENDING') && (
            <div
              className="flash-alert"
              style={{
                backgroundColor: colors.flashBg,
                color: colors.text,
                borderRadius: '9999px',
                padding: '6px 12px',
                fontSize: '12px',
                border: `1px solid ${colors.badgePending}`
              }}
            >
              Action needed: pending acknowledgment
            </div>
          )}
        </div>

        {error && (
          <div style={{ backgroundColor: '#7f1d1d', color: '#fff', padding: '10px 12px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: '#064e3b', color: '#fff', padding: '10px 12px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' }}>
            {success}
          </div>
        )}

        {allowCreate && (
          <form onSubmit={handleCreate} style={{ marginBottom: '16px', padding: '12px', borderRadius: '10px', border: `1px dashed ${colors.border}`, backgroundColor: tone === 'light' ? '#f9fafb' : '#161a2b' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', color: colors.muted, fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Target
                </label>
                <select
                  value={`${form.targetRole}-${form.targetUserId}`}
                  onChange={(e) => {
                    const [role, userId] = e.target.value.split('-');
                    setForm((prev) => ({ ...prev, targetRole: role, targetUserId: userId }));
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    backgroundColor: tone === 'light' ? '#fff' : '#1a1f35',
                    color: colors.text
                  }}
                >
                  {targetOptions.map((opt) => (
                    <option key={opt.userId} value={`${opt.role}-${opt.userId}`}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={{ display: 'block', color: colors.muted, fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Discord ID (optional)
                </label>
                <input
                  type="text"
                  value={form.discordId}
                  onChange={(e) => setForm((prev) => ({ ...prev, discordId: e.target.value }))}
                  placeholder="discord#1234"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    backgroundColor: tone === 'light' ? '#fff' : '#1a1f35',
                    color: colors.text
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', color: colors.muted, fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Instruction Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                rows={3}
                maxLength={500}
                placeholder="Provide clear, single-user instructions. Example: Please accept the friend request sent by the middleman from Discord ID xyz#1234."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: tone === 'light' ? '#fff' : '#1a1f35',
                  color: colors.text,
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '10px 18px',
                  backgroundColor: submitting ? colors.muted : '#fbbf24',
                  color: '#0a0e27',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: submitting ? 'none' : '0 4px 12px rgba(251,191,36,0.25)'
                }}
              >
                {submitting ? 'Sending...' : 'Send Instruction'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div style={{ color: colors.muted, fontSize: '14px' }}>Loading instructions...</div>
        ) : instructions.length === 0 ? (
          <div style={{ color: colors.muted, fontSize: '14px' }}>No instructions yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {instructions.map((inst) => {
              const isPending = inst.status === 'PENDING';
              const isTargetUser = user?.userId && inst.targetUser?._id === user.userId;
              return (
                <div
                  key={inst._id}
                  className={isPending ? 'flash-alert' : ''}
                  style={{
                    backgroundColor: isPending ? colors.highlight : colors.card,
                    border: `1px solid ${isPending ? colors.badgePending : colors.border}`,
                    borderRadius: '10px',
                    padding: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ color: colors.text, fontWeight: 700, fontSize: '14px' }}>
                      To {inst.targetRole === 'buyer' ? 'Buyer' : 'Seller'}
                    </div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        color: '#fff',
                        backgroundColor: isPending ? colors.badgePending : colors.badgeDone
                      }}
                    >
                      {isPending ? 'Pending' : 'Acknowledged'}
                    </span>
                  </div>
                  <div style={{ color: colors.text, fontSize: '14px', marginBottom: '8px', whiteSpace: 'pre-wrap' }}>
                    {inst.message}
                  </div>
                  {inst.discordId && (
                    <div style={{ color: colors.muted, fontSize: '12px', marginBottom: '6px' }}>
                      Discord: {inst.discordId}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: colors.muted, fontSize: '12px' }}>
                    <div>
                      From {inst.createdBy?.discordUsername || 'Middleman'} • {new Date(inst.createdAt).toLocaleString()}
                    </div>
                    {isPending && isTargetUser && (
                      <button
                        onClick={() => handleAcknowledge(inst._id)}
                        disabled={ackLoadingId === inst._id}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#10b981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: ackLoadingId === inst._id ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {ackLoadingId === inst._id ? 'Saving...' : 'Acknowledge'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MiddlemanInstructions;

