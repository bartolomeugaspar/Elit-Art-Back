import { Router, Response } from 'express'
import { body, query, validationResult } from 'express-validator'
import { EventService } from '../services/EventService'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

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
 *           enum: ['Workshop', 'Exposição', 'Masterclass', 'Networking']
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

// Create event (admin/artist only)
router.post(
  '/',
  authenticate,
  authorize('admin', 'artist'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').isIn(['Workshop', 'Exposição', 'Masterclass', 'Networking']),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('image').trim().notEmpty().withMessage('Image URL is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
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

// Update event (admin/organizer only)
router.put(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const event = await EventService.getEventById(req.params.id)

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' })
      return
    }

    if (event.organizer.toString() !== req.userId && req.userRole !== 'admin') {
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

    if (event.organizer.toString() !== req.userId && req.userRole !== 'admin') {
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

// Register for event
router.post(
  '/:id/register',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const registration = await EventService.registerUserForEvent(req.userId!, req.params.id)

    res.status(201).json({
      success: true,
      message: 'Registered successfully',
      registration,
    })
  })
)

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

    if (event.organizer.toString() !== req.userId && req.userRole !== 'admin') {
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

export default router
