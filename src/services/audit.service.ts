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

  // Limpar logs antigos (apenas para admins, com cuidado)
  static async cleanupOldLogs(days: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)

      const { data, error } = await supabase
        .from('audit_logs')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .select()

      if (error) throw error
      return data?.length || 0
    } catch (error) {
      throw error
    }
  }

  // Limpar logs por tipo de ação (LOGIN, USER_LIST, etc)
  static async cleanupLogsByAction(action: string, days: number = 7): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)

      const { data, error } = await supabase
        .from('audit_logs')
        .delete()
        .eq('action', action)
        .lt('created_at', cutoffDate.toISOString())
        .select()

      if (error) throw error
      return data?.length || 0
    } catch (error) {
      throw error
    }
  }

  // Limpar todos os logs de LOGIN e USER_LIST
  static async cleanupAuthLogs(days: number = 7): Promise<{ login: number, userList: number }> {
    try {
      const loginDeleted = await this.cleanupLogsByAction('LOGIN', days)
      const userListDeleted = await this.cleanupLogsByAction('USER_LIST', days)

      return {
        login: loginDeleted,
        userList: userListDeleted
      }
    } catch (error) {
      throw error
    }
  }

  // Limpar TODOS os logs (usar com muito cuidado!)
  static async cleanupAllLogs(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .delete()
        .not('id', 'is', null)
        .select()

      if (error) throw error
      return data?.length || 0
    } catch (error) {
      throw error
    }
  }
}
