import { supabase } from '../config/database'
import { INotification, INotificationInput } from '../models/Notification'

export class NotificationService {
  // Criar notificação
  static async createNotification(data: INotificationInput): Promise<INotification> {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return notification
  }

  // Criar notificação para todos os admins
  static async createNotificationForAdmins(
    type: INotification['type'],
    title: string,
    message: string,
    link?: string,
    reference_id?: string,
    reference_type?: string
  ): Promise<void> {
    // Buscar todos os admins
    const { data: admins, error: adminError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')

    if (adminError || !admins || admins.length === 0) {
      console.error('Nenhum admin encontrado para criar notificações')
      return
    }

    // Importar dinamicamente para evitar dependência circular
    const { NotificationSettingsService } = await import('./NotificationSettingsService')

    // Criar notificação apenas para admins que têm essa notificação habilitada
    const notificationsToCreate = []
    
    for (const admin of admins) {
      const shouldNotify = await NotificationSettingsService.shouldNotify(admin.id, type)
      if (shouldNotify) {
        notificationsToCreate.push({
          user_id: admin.id,
          type,
          title,
          message,
          link,
          reference_id,
          reference_type
        })
      }
    }

    if (notificationsToCreate.length === 0) {
      console.log(`Nenhum admin configurado para receber notificações do tipo: ${type}`)
      return
    }

    const { error } = await supabase
      .from('notifications')
      .insert(notificationsToCreate)

    if (error) {
      console.error('Erro ao criar notificações:', error)
      throw error
    }
  }

  // Buscar notificações de um usuário
  static async getUserNotifications(
    userId: string,
    unreadOnly: boolean = false
  ): Promise<INotification[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  // Marcar notificação como lida
  static async markAsRead(notificationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) throw error
  }

  // Marcar todas como lidas
  static async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
  }

  // Deletar notificação
  static async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) throw error
  }

  // Deletar notificações antigas (mais de X dias)
  static async deleteOldNotifications(days: number = 14): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const { data, error } = await supabase
      .from('notifications')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .select()

    if (error) throw error
    return data?.length || 0
  }

  // Deletar notificações lidas antigas (mais de X dias)
  static async deleteOldReadNotifications(days: number = 7): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const { data, error } = await supabase
      .from('notifications')
      .delete()
      .eq('read', true)
      .lt('created_at', cutoffDate.toISOString())
      .select()

    if (error) throw error
    return data?.length || 0
  }

  // Contar notificações não lidas
  static async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
    return count || 0
  }
}
