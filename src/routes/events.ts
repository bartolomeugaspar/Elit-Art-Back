                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                import { Router, Response } from 'express'
import { body, query, validationResult } from 'express-validator'
import { EventService } from '../services/EventService'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { PDFService } from '../services/PDFService'

const router = Router()

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Listar todos os eventos
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: ['musica', 'literatura', 'teatro', 'danca', 'cinema', 'desenho']
 *         description: Filtrar por categoria
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['upcoming', 'ongoing', 'completed', 'cancelled']
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
router.get(
  '/',
  query('category').optional().trim(),
  query('status').optional().trim(),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const filters = {
      category: req.query.category as string | undefined,
      status: req.query.status as string | undefined,
    }

    const events = await EventService.getEvents(filters)

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    })
  })
)

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Obter evento por ID
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Detalhes do evento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const event = await EventService.getEventById(req.params.id)

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' })
      return
    }

    res.status(200).json({
      success: true,
      event,
    })
  })
)

/**
 * @swagger
 * /events/search/{query}:
 *   get:
 *     summary: Buscar eventos
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Resultados da busca
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
router.get(
  '/search/:query',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const events = await EventService.searchEvents(req.params.query)

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    })
  })
)

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Criar novo evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - date
 *               - time
 *               - location
 *               - image
 *               - capacity
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: ['musica', 'literatura', 'teatro', 'danca', 'cinema', 'desenho']
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               location:
 *                 type: string
 *               image:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               price:
 *                 type: number
 *               isFree:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (apenas admin/artista)
 */
// Create event (admin/artista only)
router.post(
  '/',
  authenticate,
  authorize('admin', 'artista'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').isIn(['musica', 'literatura', 'teatro', 'danca', 'cinema', 'desenho']).withMessage('Invalid category'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').optional(),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('image').trim().notEmpty().withMessage('Image URL is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('price').optional().isNumeric(),
    body('is_free').optional().isBoolean(),
    body('bank_details').optional().isObject(),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const eventData = {
      ...req.body,
      organizer_id: req.userId,
      available_spots: req.body.capacity,
    }

    const event = await EventService.createEvent(eventData)

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event,
    })
  })
)

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualizar evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               location:
 *                 type: string
 *               image:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Evento não encontrado
 */
// Update event (admin/organizer only)
router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('category').optional().isIn(['musica', 'literatura', 'teatro', 'danca', 'cinema', 'desenho']).withMessage('Invalid category'),
    body('date').optional().notEmpty().withMessage('Date cannot be empty'),
    body('time').optional(),
    body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
    body('image').optional().trim().notEmpty().withMessage('Image URL cannot be empty'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('price').optional().isNumeric(),
    body('is_free').optional().isBoolean(),
    body('bank_details').optional().isObject(),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const event = await EventService.getEventById(req.params.id)

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' })
      return
    }

    if (event.organizer_id !== req.userId && req.userRole !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to update this event' })
      return
    }

    const updatedEvent = await EventService.updateEvent(req.params.id, req.body)

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent,
    })
  })
)

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Deletar evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Evento deletado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Evento não encontrado
 */
// Delete event (admin/organizer only)
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const event = await EventService.getEventById(req.params.id)

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' })
      return
    }

    if (event.organizer_id !== req.userId && req.userRole !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to delete this event' })
      return
    }

    await EventService.deleteEvent(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    })
  })
)

/**
 * @swagger
 * /events/{id}/register:
 *   post:
 *     summary: Registrar em um evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Registrado com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Evento não encontrado
 */
// Register for event (no authentication required)
router.post(
  '/:id/register',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { full_name, email, phone_number, payment_method, proof_url } = req.body

    const registration = await EventService.registerUserForEvent(
      req.userId,
      req.params.id,
      {
        full_name,
        email,
        phone_number,
        payment_method,
        proof_url,
      }
    )

    res.status(201).json({
      success: true,
      message: 'Registered successfully',
      registration,
    })
  })
)

/**
 * @swagger
 * /events/registrations/{registrationId}:
 *   delete:
 *     summary: Cancelar registro em evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: registrationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Registro cancelado com sucesso
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Registro não encontrado
 */
// Cancel registration
router.delete(
  '/registrations/:registrationId',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await EventService.cancelRegistration(req.params.registrationId)

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
    })
  })
)

/**
 * @swagger
 * /events/{id}/registrations:
 *   get:
 *     summary: Obter registros de um evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de registros
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Evento não encontrado
 */
// Get event registrations (organizer/admin only)
router.get(
  '/:id/registrations',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const event = await EventService.getEventById(req.params.id)

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' })
      return
    }

    if (event.organizer_id !== req.userId && req.userRole !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized' })
      return
    }

    const registrations = await EventService.getEventRegistrations(req.params.id)

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    })
  })
)

/**
 * @swagger
 * /events/user/my-registrations:
 *   get:
 *     summary: Obter meus registros em eventos
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de meus registros
 *       401:
 *         description: Não autenticado
 */
// Get user registrations
router.get(
  '/user/my-registrations',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const registrations = await EventService.getUserRegistrations(req.userId!)

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    })
  })
)

/**
 * @swagger
 * /events/{id}/testimonials:
 *   post:
 *     summary: Adicionar depoimento sobre um evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Depoimento adicionado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */
// Add testimonial
router.post(
  '/:id/testimonials',
  authenticate,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const testimonial = await EventService.addTestimonial(
      req.userId!,
      req.params.id,
      req.body.rating,
      req.body.comment
    )

    res.status(201).json({
      success: true,
      message: 'Testimonial added successfully',
      testimonial,
    })
  })
)

/**
 * @swagger
 * /events/{id}/testimonials:
 *   get:
 *     summary: Obter depoimentos de um evento
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de depoimentos
 *       404:
 *         description: Evento não encontrado
 */
// Get event testimonials
router.get(
  '/:id/testimonials',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const testimonials = await EventService.getEventTestimonials(req.params.id)

    res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials,
    })
  })
)

/**
 * @swagger
 * /events/{id}/registrations/pdf:
 *   get:
 *     summary: Baixar PDF com lista de inscritos do evento
 *     tags:
 *       - Eventos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: detailed
 *         schema:
 *           type: boolean
 *         description: Se true, gera PDF detalhado
 *     responses:
 *       200:
 *         description: PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Evento não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get(
  '/:id/registrations/pdf',
  authenticate,
  authorize('admin', 'artista'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
      const event = await EventService.getEventById(req.params.id)
      if (!event) {
        res.status(404).json({ success: false, message: 'Event not found' })
        return
      }

      const registrations = await EventService.getEventRegistrations(req.params.id)
      
      if (!registrations || registrations.length === 0) {
        res.status(404).json({ success: false, message: 'No registrations found for this event' })
        return
      }

      const detailed = req.query.detailed === 'true'

      const doc = detailed 
        ? await PDFService.generateEventRegistrationsDetailedPDF(event, registrations)
        : await PDFService.generateEventRegistrationsPDF(event, registrations)

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="inscritos-${event.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf"`
      )

      // Pipe PDF to response
      doc.pipe(res)
      doc.end()
    } catch (error) {
      console.error('Error generating PDF:', error)
      res.status(500).json({ 
        success: false, 
        message: 'Error generating PDF',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  })
)

export default router
