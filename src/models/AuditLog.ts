import { supabase } from '../config/database';

export interface AuditLogAttributes {
  id?: number;
  user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: Record<string, any> | null;
  new_values?: Record<string, any> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
  updated_at?: string;
}

export class AuditLog {
  /**
   * Create a new audit log entry
   */
  static async create(auditData: Omit<AuditLogAttributes, 'id' | 'created_at' | 'updated_at'>): Promise<AuditLogAttributes | null> {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        ...auditData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  /**
   * Find all audit logs for a specific user
   */
  static async findByUserId(userId: string): Promise<AuditLogAttributes[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  }

  /**
   * Find all audit logs for a specific entity
   */
  static async findByEntity(entityType: string, entityId: string): Promise<AuditLogAttributes[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  }

  /**
   * Helper method to log an action with automatic timestamps
   */
  static async logAction(auditData: Omit<AuditLogAttributes, 'id' | 'created_at' | 'updated_at'>): Promise<AuditLogAttributes | null> {
    return this.create(auditData);
  }

  /**
   * Delete audit logs older than specified days
   * Specifically for session logs (login/logout actions)
   */
  static async deleteOldSessionLogs(daysOld: number = 2): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffISO = cutoffDate.toISOString();

    const { data, error } = await supabase
      .from('audit_logs')
      .delete()
      .lt('created_at', cutoffISO)
      .in('action', ['login', 'logout', 'login_failed'])
      .select();

    if (error) {
      return 0;
    }

    const deletedCount = data?.length || 0;
    return deletedCount;
  }

  /**
   * Delete all audit logs older than specified days
   */
  static async deleteOldLogs(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffISO = cutoffDate.toISOString();

    const { data, error } = await supabase
      .from('audit_logs')
      .delete()
      .lt('created_at', cutoffISO)
      .select();

    if (error) {
      return 0;
    }

    const deletedCount = data?.length || 0;
    return deletedCount;
  }
}

export default AuditLog;
