import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { NotificationService } from '../services/NotificationService'

const router = Router()

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Buscar notificações do usuário
 *     tags:
 *       - Notificações
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *         description: Retornar apenas não lidas
 *     responses:
 *       200:
 *         description: Lista de notificações
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const unreadOnly = req.query.unreadOnly === 'true'
    const notifications = await NotificationService.getUserNotifications(
      req.userId!,
      unreadOnly
    )

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    })
  })
)

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Contar notificações não lidas
 *     tags:
 *       - Notificações
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contagem de não lidas
 */
router.get(
  '/unread-count',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const count = await NotificationService.getUnreadCount(req.userId!)

    res.status(200).json({
      success: true,
      unreadCount: count
    })
  })
)

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Marcar notificação como lida
 *     tags:
 *       - Notificações
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 */
router.patch(
  '/:id/read',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await NotificationService.markAsRead(req.params.id, req.userId!)

    res.status(200).json({
      success: true,
      message: 'Notificação marcada como lida'
    })
  })
)

/**
 * @swagger
 * /notifications/mark-all-read:
 *   patch:
 *     summary: Marcar todas as notificações como lidas
 *     tags:
 *       - Notificações
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todas as notificações marcadas como lidas
 */
router.patch(
  '/mark-all-read',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await NotificationService.markAllAsRead(req.userId!)

    res.status(200).json({
      success: true,
      message: 'Todas as notificações marcadas como lidas'
    })
  })
)

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Deletar notificação
 *     tags:
 *       - Notificações
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificação deletada
 */
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await NotificationService.deleteNotification(req.params.id, req.userId!)

    res.status(200).json({
      success: true,
      message: 'Notificação deletada'
    })
  })
)

export default router
