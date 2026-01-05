import { Router, Response } from 'express'
import { query, validationResult } from 'express-validator'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { FinancialReportService } from '../services/FinancialReportService'

const router = Router()

/**
 * @swagger
 * /financial-reports/overview:
 *   get:
 *     summary: Obter resumo geral das finanças
 *     tags:
 *       - Relatórios Financeiros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Resumo financeiro geral
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.get(
  '/overview',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { startDate, endDate } = req.query

    const overview = await FinancialReportService.getFinancialOverview(
      startDate as string,
      endDate as string
    )

    res.status(200).json({
      success: true,
      overview,
    })
  })
)

/**
 * @swagger
 * /financial-reports/events:
 *   get:
 *     summary: Obter resumo financeiro por evento
 *     tags:
 *       - Relatórios Financeiros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Resumo financeiro por evento
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.get(
  '/events',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { startDate, endDate } = req.query

    const eventSummaries = await FinancialReportService.getEventFinancialSummary(
      startDate as string,
      endDate as string
    )

    res.status(200).json({
      success: true,
      count: eventSummaries.length,
      events: eventSummaries,
    })
  })
)

/**
 * @swagger
 * /financial-reports/monthly:
 *   get:
 *     summary: Obter receitas mensais
 *     tags:
 *       - Relatórios Financeiros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Ano (padrão é o ano atual)
 *     responses:
 *       200:
 *         description: Receitas mensais
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.get(
  '/monthly',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined

    const monthlyRevenue = await FinancialReportService.getMonthlyRevenue(year)

    res.status(200).json({
      success: true,
      year: year || new Date().getFullYear(),
      months: monthlyRevenue,
    })
  })
)

/**
 * @swagger
 * /financial-reports/events/{eventId}/registrations:
 *   get:
 *     summary: Obter detalhes das inscrições de um evento específico
 *     tags:
 *       - Relatórios Financeiros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes das inscrições do evento
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.get(
  '/events/:eventId/registrations',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { eventId } = req.params

    const registrations = await FinancialReportService.getEventRegistrationDetails(eventId)

    res.status(200).json({
      success: true,
      count: registrations?.length || 0,
      registrations: registrations || [],
    })
  })
)

/**
 * @swagger
 * /financial-reports/payment-methods:
 *   get:
 *     summary: Obter estatísticas por método de pagamento
 *     tags:
 *       - Relatórios Financeiros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Estatísticas por método de pagamento
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.get(
  '/payment-methods',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { startDate, endDate } = req.query

    const paymentStats = await FinancialReportService.getPaymentMethodStats(
      startDate as string,
      endDate as string
    )

    res.status(200).json({
      success: true,
      count: paymentStats.length,
      paymentMethods: paymentStats,
    })
  })
)

export default router
