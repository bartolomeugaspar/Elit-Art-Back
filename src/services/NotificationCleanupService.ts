import { NotificationService } from './NotificationService'
import * as cron from 'node-cron'

export class NotificationCleanupService {
  private static cleanupTask: cron.ScheduledTask | null = null

  // Iniciar limpeza automática (executa diariamente às 3h da manhã)
  static startAutoCleanup(): void {
    if (this.cleanupTask) {
      return
    }


    // Executar diariamente às 3h da manhã
    this.cleanupTask = cron.schedule('0 3 * * *', async () => {
      try {
        await this.cleanupOldNotifications()
      } catch (error) {
      }
    })

    // Executar também na inicialização (mas não falhar se tabela não existir)
    this.cleanupOldNotifications().catch(error => {
      // Silenciar erro se tabela não existir ainda
      if (error?.message?.includes('relation "notifications" does not exist') || 
          error?.message?.includes('fetch failed')) {
      } else {
      }
    })
  }

  // Parar limpeza automática
  static stopAutoCleanup(): void {
    if (this.cleanupTask) {
      this.cleanupTask.stop()
      this.cleanupTask = null
    }
  }

  // Limpar notificações com mais de 2 semanas (14 dias)
  static async cleanupOldNotifications(): Promise<number> {
    try {
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

      const deletedCount = await NotificationService.deleteOldNotifications(14)
      
      
      return deletedCount
    } catch (error) {
      throw error
    }
  }

  // Limpar notificações lidas com mais de 1 semana
  static async cleanupOldReadNotifications(): Promise<number> {
    try {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      const deletedCount = await NotificationService.deleteOldReadNotifications(7)
      
      
      return deletedCount
    } catch (error) {
      throw error
    }
  }
}
