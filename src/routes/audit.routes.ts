import { Router, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { AuditService } from '../services/audit.service';
import { LogCleanupService } from '../services/LogCleanupService';
import { asyncHandler } from '../middleware/errorHandler';

export const router = Router();

/**
 * @swagger
 * /audit-logs:
 *   get:
 *     summary: Listar todos os logs de auditoria
 *     tags:
 *       - Auditoria
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de entidade (user, event, registration, etc)
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: string
 *         description: Filtrar por ID da entidade
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do usuário
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Número máximo de registros a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de registros a pular
 *     responses:
 *       200:
 *         description: Lista de logs de auditoria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: string
 *                       action:
 *                         type: string
 *                       entity_type:
 *                         type: string
 *                       entity_id:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (apenas admins)
 */
// Get audit logs (admin only)
router.get('/', 
  authenticate, 
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // O middleware authorize('admin') já garante que apenas admins podem acessar

    const { 
      entityType, 
      entityId, 
      userId, 
      limit = 50, 
      offset = 0 
    } = req.query;

    const { data, count } = await AuditService.getLogs(
      entityType as string,
      entityId as string,
      userId as string,
      parseInt(limit as string, 10),
      parseInt(offset as string, 10)
    );

    res.json({
      success: true,
      data,
      pagination: {
        total: count || 0,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10)
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar logs de auditoria' 
    });
  }
}));

/**
 * @swagger
 * /audit-logs/{entityType}/{entityId}:
 *   get:
 *     summary: Listar logs de auditoria para uma entidade específica
 *     tags:
 *       - Auditoria
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entityType
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo de entidade (user, event, registration, etc)
 *       - in: path
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da entidade
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Número máximo de registros a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de registros a pular
 *     responses:
 *       200:
 *         description: Lista de logs para a entidade
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                 pagination:
 *                   type: object
 *       401:
 *         description: Não autenticado
 */
// Get audit logs for a specific entity
router.get('/:entityType/:entityId', 
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { entityType, entityId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const { data, count } = await AuditService.getLogs(
      entityType,
      entityId,
      undefined,
      parseInt(limit as string, 10),
      parseInt(offset as string, 10)
    );

    res.json({
      success: true,
      data,
      pagination: {
        total: count || 0,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10)
      }
    });
  } catch (error) {
    console.error('Error fetching entity audit logs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao buscar logs de auditoria da entidade' 
    });
  }
}));

/**
 * @swagger
 * /audit-logs/cleanup/manual:
 *   post:
 *     summary: Executar limpeza manual de logs antigos
 *     tags:
 *       - Auditoria
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Limpeza executada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deleted:
 *                   type: object
 *                   properties:
 *                     sessionLogs:
 *                       type: integer
 *                       description: Logs de sessão deletados (>2 dias)
 *                     otherLogs:
 *                       type: integer
 *                       description: Outros logs deletados (>30 dias)
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (apenas admins)
 */
// Manual cleanup endpoint (admin only)
router.post('/cleanup/manual',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
      console.log('[Audit Routes] Manual cleanup triggered by admin:', req.user?.id);
      const result = await LogCleanupService.manualCleanup();

      res.json({
        success: true,
        message: 'Limpeza de logs executada com sucesso',
        deleted: {
          sessionLogs: result.sessionLogs,
          otherLogs: result.otherLogs,
          total: result.sessionLogs + result.otherLogs,
        },
      });
    } catch (error) {
      console.error('Error during manual cleanup:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao executar limpeza de logs',
      });
    }
  })
);

// Audit logs are read-only and cannot be deleted automatically by users
// This ensures data integrity and compliance with audit trail requirements
// Only session logs (login/logout) older than 2 days are auto-deleted
// Other logs are kept for 30 days before auto-deletion

export default router;
