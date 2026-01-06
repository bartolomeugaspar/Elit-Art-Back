export interface NotificationSettings {
  id: string
  userId: string
  
  // Canais de notificação
  emailEnabled: boolean
  pushEnabled: boolean
  
  // Relatórios
  weeklyReport: boolean
  monthlyReport: boolean
  
  // Alertas específicos
  newRegistrations: boolean
  newOrders: boolean
  newContacts: boolean
  newComments: boolean
  newUsers: boolean
  
  // Segurança
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  
  createdAt: string
  updatedAt: string
}

export interface NotificationSettingsUpdate {
  emailEnabled?: boolean
  pushEnabled?: boolean
  weeklyReport?: boolean
  monthlyReport?: boolean
  newRegistrations?: boolean
  newOrders?: boolean
  newContacts?: boolean
  newComments?: boolean
  newUsers?: boolean
  twoFactorEnabled?: boolean
}
