import { Request } from 'express';
import { supabase } from '../config/database';

export interface AuditLogInput {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export class AuditService {
  static async log(
    data: AuditLogInput,
    req?: Request
  ): Promise<void> {
    try {
      const logData = {
        user_id: data.userId || null,
        action: data.action,
        entity_type: data.entityType,
        entity_id: data.entityId,
        old_values: data.oldValues || null,
        new_values: data.newValues || null,
        ip_address: data.ipAddress || (req?.ip || req?.socket.remoteAddress || null),
        user_agent: data.userAgent || (req?.get('user-agent') || null)
      };


      const { error, data: insertedData } = await supabase
        .from('audit_logs')
        .insert(logData)
        .select();

      if (error) {
      } else {
      }
    } catch (error) {
    }
  }

  static async getLogs(
    entityType?: string,
    entityId?: string,
    userId?: string,
    limit = 50,
    offset = 0
  ) {
    try {
      
      let query = supabase
        .from('audit_logs')
        .select('*, user:user_id(id, name, email, role)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (entityType) {
        query = query.eq('entity_type', entityType);
      }

      if (entityId) {
        query = query.eq('entity_id', entityId);
      }

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error, count } = await query;


      if (error) {
        return { data: [], count: 0 };
      }

      return { data, count };
    } catch (error) {
      return { data: [], count: 0 };
    }
  }

  static async logUserAction(
    userId: string | undefined,
    action: string,
    entityType: string,
    entityId: string,
    req?: Request,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>
  ) {
    return this.log({
      userId,
      action,
      entityType,
      entityId,
      oldValues,
      newValues,
      ipAddress: req?.ip || req?.socket.remoteAddress || null,
      userAgent: req?.get('user-agent') || null
    }, req);
  }

  // Audit logs are read-only and cannot be deleted
  // This ensures data integrity and compliance with audit trail requirements
}
