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

// Unsubscribe from newsletter
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

// Get all subscribers (admin only)
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

export default router
