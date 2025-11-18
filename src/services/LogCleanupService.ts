import AuditLog from '../models/AuditLog';

/**
 * Service to handle automatic cleanup of old audit logs
 * Runs on a scheduled interval
 */
export class LogCleanupService {
  private static cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Start the automatic cleanup scheduler
   * @param intervalHours - Interval in hours to run cleanup (default: 6 hours)
   */
  static startCleanupScheduler(intervalHours: number = 6): void {
    if (this.cleanupInterval) {
      console.log('[LogCleanupService] Cleanup scheduler already running');
      return;
    }

    console.log(`[LogCleanupService] Starting cleanup scheduler - runs every ${intervalHours} hours`);

    // Run cleanup immediately on startup
    this.runCleanup();

    // Schedule cleanup to run at regular intervals
    const intervalMs = intervalHours * 60 * 60 * 1000;
    this.cleanupInterval = setInterval(() => {
      this.runCleanup();
    }, intervalMs);
  }

  /**
   * Stop the cleanup scheduler
   */
  static stopCleanupScheduler(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('[LogCleanupService] Cleanup scheduler stopped');
    }
  }

  /**
   * Execute the cleanup process
   */
  private static async runCleanup(): Promise<void> {
    try {
      console.log('[LogCleanupService] Starting cleanup process...');
      const startTime = Date.now();

      // Delete session logs older than 2 days
      const sessionLogsDeleted = await AuditLog.deleteOldSessionLogs(2);

      // Delete all other logs older than 30 days
      const otherLogsDeleted = await AuditLog.deleteOldLogs(30);

      const duration = Date.now() - startTime;
      console.log(`[LogCleanupService] Cleanup completed in ${duration}ms`);
      console.log(`[LogCleanupService] Summary: ${sessionLogsDeleted} session logs + ${otherLogsDeleted} other logs deleted`);
    } catch (error) {
      console.error('[LogCleanupService] Error during cleanup:', error);
    }
  }

  /**
   * Manually trigger cleanup (for testing or admin purposes)
   */
  static async manualCleanup(): Promise<{ sessionLogs: number; otherLogs: number }> {
    try {
      console.log('[LogCleanupService] Manual cleanup triggered');
      const sessionLogsDeleted = await AuditLog.deleteOldSessionLogs(2);
      const otherLogsDeleted = await AuditLog.deleteOldLogs(30);

      return {
        sessionLogs: sessionLogsDeleted,
        otherLogs: otherLogsDeleted,
      };
    } catch (error) {
      console.error('[LogCleanupService] Error during manual cleanup:', error);
      return {
        sessionLogs: 0,
        otherLogs: 0,
      };
    }
  }
}

export default LogCleanupService;
