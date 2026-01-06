import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { AuthService } from '../services/AuthService'
import { AuditService } from '../services/audit.service'
import { PasswordResetService } from '../services/PasswordResetService'
import { EmailService } from '../services/EmailService'
import { authenticate, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário (apenas admins)
 *     tags:
 *       - Autenticação
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado - apenas admins podem registrar usuários
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/register',
  authenticate,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // Check if user is admin
    const user = await AuthService.getUserById(req.userId!)
    if (!user || user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Only admins can register new users',
      })
      return
    }

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { name, email, password, profile_image } = req.body
    const { user: newUser, token } = await AuthService.register(name, email, password, profile_image)

    // Enviar email e WhatsApp de boas-vindas com senha temporária (async, não bloqueia a resposta)
    EmailService.sendWelcomeEmail(newUser.email, newUser.name, password)
      .catch(err => console.error('Erro ao enviar email de boas-vindas:', err))
    
    const { WhatsAppService } = await import('../services/WhatsAppService')
    WhatsAppService.sendWelcomeMessage(newUser.email, newUser.name, password)
      .catch(err => console.error('Erro ao enviar WhatsApp de boas-vindas:', err))

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    })
  })
)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description: Email ou senha inválidos
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // Registrar tentativa de login falhada (validação)
      try {
        await AuditService.log({
          userId: null,
          action: 'LOGIN_FAILED_VALIDATION',
          entityType: 'user',
          entityId: req.body.email || 'unknown',
          newValues: { reason: 'Formato de email ou senha inválido' },
          ipAddress: req.ip || req.socket.remoteAddress || undefined,
          userAgent: req.get('user-agent'),
        }, req)
      } catch (error) {
      }
      
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { email, password } = req.body
    
    try {
      // Get IP address and User-Agent
      const ipAddress = req.ip || req.socket.remoteAddress || req.headers['x-forwarded-for'] as string || 'Desconhecido'
      const userAgent = req.get('user-agent')
      
      const { user, token } = await AuthService.login(email, password, ipAddress, userAgent)

      // Registrar login bem-sucedido no audit log
      try {
        await AuditService.log({
          userId: user.id,
          action: 'LOGIN',
          entityType: 'user',
          entityId: user.id,
          ipAddress: ipAddress,
          userAgent: userAgent,
        }, req)
      } catch (error) {
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      })
    } catch (error: any) {
      // Registrar tentativa de login falhada (credenciais inválidas)
      try {
        await AuditService.log({
          userId: null,
          action: 'LOGIN_FAILED',
          entityType: 'user',
          entityId: email,
          newValues: { reason: error.message || 'Invalid credentials' },
          ipAddress: req.ip || req.socket.remoteAddress || undefined,
          userAgent: req.get('user-agent'),
        }, req)
      } catch (logError) {
      }
      
      res.status(401).json({
        success: false,
        message: error.message || 'Email ou senha incorretos',
      })
    }
  })
)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Fazer logout
 *     tags:
 *       - Autenticação
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Não autenticado
 */
router.post(
  '/logout',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // Registrar logout no audit log
    try {
      await AuditService.log({
        userId: req.userId,
        action: 'LOGOUT',
        entityType: 'user',
        entityId: req.userId!,
        ipAddress: req.ip || req.socket.remoteAddress || undefined,
        userAgent: req.get('user-agent'),
      }, req)
    } catch (error) {
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    })
  })
)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     tags:
 *       - Autenticação
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autenticado
 */
router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await AuthService.getUserById(req.userId!)

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    })
    return
  }

  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
}))

/**
 * @swagger
 * /auth/password-length:
 *   get:
 *     summary: Obter tamanho da senha do usuário (para exibição visual)
 *     tags:
 *       - Autenticação
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Tamanho da senha retornado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 passwordLength:
 *                   type: number
 *       401:
 *         description: Não autenticado
 */
router.get('/password-length', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const passwordLength = await AuthService.getPasswordLength(req.userId!)

  res.status(200).json({
    success: true,
    passwordLength,
  })
}))

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     tags:
 *       - Autenticação
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               bio:
 *                 type: string
 *                 example: Artista e criador
 *               phone:
 *                 type: string
 *                 example: +244 923 123 456
 *               profileImage:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autenticado
 */
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

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email de recuperação enviado
 *       400:
 *         description: Email inválido
 */
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email is required')],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { email } = req.body
    await PasswordResetService.requestPasswordReset(email)

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
    })
  })
)

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Redefinir senha com token
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { email, token, newPassword } = req.body

    // Validate token first
    const isValid = await PasswordResetService.validateResetToken(email, token)
    if (!isValid) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      })
      return
    }

    await PasswordResetService.resetPassword(email, token, newPassword)

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    })
  })
)

/**
 * @swagger
 * /auth/test-log:
 *   post:
 *     summary: Teste de log de auditoria
 *     tags:
 *       - Autenticação
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Log de teste criado
 */
router.post('/test-log', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    await AuditService.log({
      userId: req.userId,
      action: 'TEST',
      entityType: 'test',
      entityId: 'test-123',
      newValues: { message: 'Test log entry' }
    }, req)

    res.status(200).json({
      success: true,
      message: 'Test log created successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating test log',
    })
  }
}))

export default router
