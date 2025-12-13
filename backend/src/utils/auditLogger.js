import AuditLog from '../models/AuditLog.js';

export async function logAdminAction({ adminId, action, targetType, targetId, note }) {
  try {
    await AuditLog.create({
      admin: adminId,
      action,
      targetType,
      targetId,
      note
    });
  } catch (error) {
    // Fail silently - do not break main flow
  }
}

