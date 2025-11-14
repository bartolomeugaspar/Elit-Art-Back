import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { AuthService } from '../services/AuthService'
import { authenticate, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()

// Register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { name, email, password } = req.body
    const { user, token } = await AuthService.register(name, email, password)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  })
)

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { email, password } = req.body
    const { user, token } = await AuthService.login(email, password)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  })
)

// Get current user
router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await AuthService.getUserById(req.userId!)

  res.status(200).json({
    success: true,
    user,
  })
}))

// Update profile
router.put(
  '/profile',
  authenticate,
  [body('name').optional().trim().notEmpty(), body('bio').optional().trim()],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const updatedUser = await AuthService.updateUser(req.userId!, req.body)

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  })
)

export default router
