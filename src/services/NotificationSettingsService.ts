import { supabase } from '../config/database'
import { NotificationSettings, NotificationSettingsUpdate } from '../models/NotificationSettings'

export class NotificationSettingsService {
  // Obter configurações do usuário (criar se não existir)
  static async getUserSettings(userId: string): Promise<NotificationSettings | null> {
    // Tentar buscar configurações existentes
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // Se não existir, criar com valores padrão
      if (error.code === 'PGRST116') {
        return await this.createDefaultSettings(userId)
      }
      throw error
    }

    return this.mapFromDatabase(data)
  }

  // Criar configurações padrão
  static async createDefaultSettings(userId: string): Promise<NotificationSettings> {
    const { data, error } = await supabase
      .from('notification_settings')
      .insert({
        user_id: userId,
        email_enabled: true,
        push_enabled: true,
        weekly_report: true,
        monthly_report: true,
        new_registrations: true,
        new_orders: true,
        new_contacts: true,
        new_comments: true,
        new_users: true,
        two_factor_enabled: false
      })
      .select()
      .single()

    if (error) throw error
    return this.mapFromDatabase(data)
  }

  // Atualizar configurações
  static async updateSettings(
    userId: string, 
    updates: NotificationSettingsUpdate
  ): Promise<NotificationSettings> {
    const dbUpdates: any = {}
    
    if (updates.emailEnabled !== undefined) dbUpdates.email_enabled = updates.emailEnabled
    if (updates.pushEnabled !== undefined) dbUpdates.push_enabled = updates.pushEnabled
    if (updates.weeklyReport !== undefined) dbUpdates.weekly_report = updates.weeklyReport
    if (updates.monthlyReport !== undefined) dbUpdates.monthly_report = updates.monthlyReport
    if (updates.newRegistrations !== undefined) dbUpdates.new_registrations = updates.newRegistrations
    if (updates.newOrders !== undefined) dbUpdates.new_orders = updates.newOrders
    if (updates.newContacts !== undefined) dbUpdates.new_contacts = updates.newContacts
    if (updates.newComments !== undefined) dbUpdates.new_comments = updates.newComments
    if (updates.newUsers !== undefined) dbUpdates.new_users = updates.newUsers
    if (updates.twoFactorEnabled !== undefined) dbUpdates.two_factor_enabled = updates.twoFactorEnabled

    const { data, error } = await supabase
      .from('notification_settings')
      .update(dbUpdates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return this.mapFromDatabase(data)
  }

  // Verificar se usuário deve receber notificação de um tipo específico
  static async shouldNotify(userId: string, notificationType: string): Promise<boolean> {
    const settings = await this.getUserSettings(userId)
    if (!settings) return false

    // Verificar se notificações estão habilitadas
    if (!settings.emailEnabled && !settings.pushEnabled) return false

    // Verificar tipo específico
    switch (notificationType) {
      case 'registration':
        return settings.newRegistrations
      case 'order':
        return settings.newOrders
      case 'contact':
        return settings.newContacts
      case 'comment':
        return settings.newComments
      case 'user':
        return settings.newUsers
      default:
        return true
    }
  }

  // Mapear do formato do banco para o modelo
  private static mapFromDatabase(data: any): NotificationSettings {
    return {
      id: data.id,
      userId: data.user_id,
      emailEnabled: data.email_enabled,
      pushEnabled: data.push_enabled,
      weeklyReport: data.weekly_report,
      monthlyReport: data.monthly_report,
      newRegistrations: data.new_registrations,
      newOrders: data.new_orders,
      newContacts: data.new_contacts,
      newComments: data.new_comments,
      newUsers: data.new_users,
      twoFactorEnabled: data.two_factor_enabled,
      twoFactorSecret: data.two_factor_secret,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }
}
