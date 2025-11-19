import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { OrderService } from '../services/OrderService'

const router = Router()

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Listar todos os pedidos (admin only)
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get(
  '/',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.query
    const orders = await OrderService.getAllOrders(status as string)

    res.status(200).json({
      success: true,
      orders,
    })
  })
)

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obter detalhes de um pedido
 *     tags:
 *       - Pedidos
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
 *         description: Detalhes do pedido
 *       404:
 *         description: Pedido não encontrado
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await OrderService.getOrderById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    res.status(200).json({
      success: true,
      order,
    })
  })
)

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Obter pedidos do usuário
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedidos do usuário
 */
router.get(
  '/user/:userId',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await OrderService.getOrdersByUser(req.params.userId)

    res.status(200).json({
      success: true,
      orders,
    })
  })
)

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Criar novo pedido
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, full_name, items, final_amount, payment_method, shipping_address, shipping_city, shipping_country, shipping_postal_code]
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/',
  body('email').isEmail().withMessage('Valid email is required'),
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  body('final_amount').isFloat({ min: 0 }).withMessage('Final amount must be positive'),
  body('payment_method').isIn(['stripe', 'bank_transfer', 'cash']),
  body('shipping_address').notEmpty().withMessage('Shipping address is required'),
  body('shipping_city').notEmpty().withMessage('Shipping city is required'),
  body('shipping_country').notEmpty().withMessage('Shipping country is required'),
  body('shipping_postal_code').notEmpty().withMessage('Shipping postal code is required'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const order = await OrderService.createOrder(req.body)

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    })
  })
)

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Atualizar status do pedido (admin only)
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  body('status').isIn(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const order = await OrderService.updateOrderStatus(req.params.id, req.body.status)

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    })
  })
)

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Cancelar pedido
 *     tags:
 *       - Pedidos
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
 *         description: Pedido cancelado com sucesso
 */
router.patch(
  '/:id/cancel',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await OrderService.cancelOrder(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    })
  })
)

/**
 * @swagger
 * /orders/stats:
 *   get:
 *     summary: Obter estatísticas de pedidos (admin only)
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas de pedidos
 */
router.get(
  '/stats',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await OrderService.getOrderStats()

    res.status(200).json({
      success: true,
      stats,
    })
  })
)

export default router
