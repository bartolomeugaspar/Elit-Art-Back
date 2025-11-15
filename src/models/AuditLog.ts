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
      console.error('Error creating audit log:', error);
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
      console.error('Error fetching audit logs by user ID:', error);
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
      console.error('Error fetching audit logs by entity:', error);
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
}

export default AuditLog;
