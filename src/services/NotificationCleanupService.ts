import { NotificationService } from './NotificationService'
import * as cron from 'node-cron'

export class NotificationCleanupService {
  private static cleanupTask: cron.ScheduledTask | null = null

  // Iniciar limpeza automática (executa diariamente às 3h da manhã)
  static startAutoCleanup(): void {
    if (this.cleanupTask) {
      console.log('[NotificationCleanup] Limpeza automática já está em execução')
      return
    }

    console.log('[NotificationCleanup] ✅ Iniciando limpeza automática de notificações antigas')

    // Executar diariamente às 3h da manhã
    this.cleanupTask = cron.schedule('0 3 * * *', async () => {
      try {
        console.log('[NotificationCleanup] 🧹 Executando limpeza de notificações antigas...')
        await this.cleanupOldNotifications()
        console.log('[NotificationCleanup] ✅ Limpeza concluída com sucesso')
      } catch (error) {
        console.error('[NotificationCleanup] ❌ Erro ao executar limpeza:', error)
      }
    })

    // Executar também na inicialização (mas não falhar se tabela não existir)
    this.cleanupOldNotifications().catch(error => {
      // Silenciar erro se tabela não existir ainda
      if (error?.message?.includes('relation "notifications" does not exist') || 
          error?.message?.includes('fetch failed')) {
        console.log('[NotificationCleanup] ⚠️ Tabela notifications ainda não criada. Execute a migration primeiro.')
      } else {
        console.error('[NotificationCleanup] ❌ Erro na limpeza inicial:', error)
      }
    })
  }

  // Parar limpeza automática
  static stopAutoCleanup(): void {
    if (this.cleanupTask) {
      this.cleanupTask.stop()
      this.cleanupTask = null
      console.log('[NotificationCleanup] ⏹️ Limpeza automática parada')
    }
  }

  // Limpar notificações com mais de 2 semanas (14 dias)
  static async cleanupOldNotifications(): Promise<number> {
    try {
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

      const deletedCount = await NotificationService.deleteOldNotifications(14)
      
      console.log(`[NotificationCleanup] 🗑️ ${deletedCount} notificações antigas deletadas (anteriores a ${twoWeeksAgo.toLocaleDateString('pt-BR')})`)
      
      return deletedCount
    } catch (error) {
      console.error('[NotificationCleanup] Erro ao limpar notificações:', error)
      throw error
    }
  }

  // Limpar notificações lidas com mais de 1 semana
  static async cleanupOldReadNotifications(): Promise<number> {
    try {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      const deletedCount = await NotificationService.deleteOldReadNotifications(7)
      
      console.log(`[NotificationCleanup] 🗑️ ${deletedCount} notificações lidas antigas deletadas (anteriores a ${oneWeekAgo.toLocaleDateString('pt-BR')})`)
      
      return deletedCount
    } catch (error) {
      console.error('[NotificationCleanup] Erro ao limpar notificações lidas:', error)
      throw error
    }
  }
}
