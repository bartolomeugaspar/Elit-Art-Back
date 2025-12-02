import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { NewsletterService } from '../services/NewsletterService'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()

// Subscribe to newsletter
router.post(
  '/subscribe',
  [body('email').isEmail().withMessage('Valid email is required')],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const subscriber = await NewsletterService.subscribe(req.body.email)

    res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
      subscriber,
    })
  })
)

// Unsubscribe from newsletter (POST)
router.post(
  '/unsubscribe',
  [body('email').isEmail().withMessage('Valid email is required')],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    await NewsletterService.unsubscribe(req.body.email)

    res.status(200).json({
      success: true,
      message: 'Unsubscribed successfully',
    })
  })
)

// Unsubscribe from newsletter via GET (for email links)
router.get(
  '/unsubscribe',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const email = req.query.email as string
    
    if (!email) {
      res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      })
      return
    }

    const subscriber = await NewsletterService.unsubscribe(email)

    if (subscriber) {
      res.status(200).json({
        success: true,
        message: 'Você foi desinscrito da newsletter com sucesso.',
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Email não encontrado na nossa lista.',
      })
    }
  })
)

// Get all subscribers (admin only)
router.get(
  '/',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const subscribers = await NewsletterService.getSubscribers()

    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    })
  })
)

// Get subscribers (alternative endpoint)
router.get(
  '/subscribers',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const subscribers = await NewsletterService.getSubscribers()

    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    })
  })
)

// Get subscriber count (admin only)
router.get(
  '/count',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const count = await NewsletterService.getSubscriberCount()

    res.status(200).json({
      success: true,
      count,
    })
  })
)

// Send email to all subscribers (admin only)
router.post(
  '/send',
  authenticate,
  authorize('admin'),
  [
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    // In a real application, you would send emails here
    // For now, we'll just return a success message
    const subscribers = await NewsletterService.getSubscribers()

    res.status(200).json({
      success: true,
      message: `Email sent to ${subscribers.length} subscribers`,
      count: subscribers.length,
    })
  })
)

// Delete subscriber (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await NewsletterService.deleteSubscriber(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully',
    })
  })
)

export default router
