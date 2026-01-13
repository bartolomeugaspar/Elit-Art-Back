import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { supabase } from '../config/database'

const router = Router()

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Enviar mensagem de contato
 *     tags:
 *       - Contato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, subject, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 */
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('subject').notEmpty().withMessage('Assunto é obrigatório'),
    body('message').notEmpty().withMessage('Mensagem é obrigatória'),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { name, email, phone, subject, message } = req.body

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          phone,
          subject,
          message,
          status: 'new',
        },
      ])
      .select()
      .single()

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao enviar mensagem. Por favor, execute a migração SQL para criar a tabela contact_messages.',
        error: error.message,
      })
    }

    // Enviar email de notificação ao administrador
    try {
      const { EmailService } = await import('../services/EmailService')
      await EmailService.sendContactNotificationToAdmin(
        name,
        email,
        phone || '',
        subject,
        message
      )
      console.log(`✅ Notificação de contato enviada ao administrador`)
    } catch (emailError) {
      console.error('⚠️ Erro ao enviar email ao administrador:', emailError)
      // Não bloquear a resposta mesmo se o email falhar
    }

    res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      data,
    })
  })
)

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Listar mensagens de contato (Admin)
 *     tags:
 *       - Contato
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mensagens
 */
router.get(
  '/',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar mensagens',
      })
    }

    res.status(200).json({
      success: true,
      messages: data || [],
    })
  })
)

/**
 * @swagger
 * /contact/{id}/read:
 *   patch:
 *     summary: Marcar mensagem como lida (Admin)
 *     tags:
 *       - Contato
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
 *         description: Mensagem marcada como lida
 */
router.patch(
  '/:id/read',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status: 'read' })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar mensagem',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Mensagem marcada como lida',
      data,
    })
  })
)

/**
 * @swagger
 * /contact/{id}/reply:
 *   post:
 *     summary: Responder mensagem de contato (Admin)
 *     tags:
 *       - Contato
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
 *             required: [reply]
 *             properties:
 *               reply:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resposta enviada com sucesso
 */
router.post(
  '/:id/reply',
  authenticate,
  authorize('admin'),
  [body('reply').notEmpty().withMessage('Resposta é obrigatória')],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { id } = req.params
    const { reply } = req.body

    // Buscar a mensagem original
    const { data: message, error: fetchError } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada',
      })
    }

    // Enviar email e WhatsApp de resposta
    try {
      const { EmailService } = await import('../services/EmailService')
      const { WhatsAppService } = await import('../services/WhatsAppService')
      
      await EmailService.sendContactReply(
        message.email,
        message.name,
        message.subject,
        message.message,
        reply,
        'Equipa Elit\'Arte'
      )
      
      // Enviar também por WhatsApp se houver número de telefone
      if (message.phone) {
        await WhatsAppService.sendContactReply(
          message.phone,
          message.name,
          message.subject,
          reply,
          'Equipa Elit\'Arte'
        ).catch(err => console.error('Erro ao enviar WhatsApp:', err))
      }

      // Atualizar status para "replied"
      await supabase
        .from('contact_messages')
        .update({ status: 'replied' })
        .eq('id', id)

      res.status(200).json({
        success: true,
        message: 'Resposta enviada com sucesso',
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao enviar resposta por email',
      })
    }
  })
)

/**
 * @swagger
 * /contact/{id}:
 *   delete:
 *     summary: Excluir mensagem (Admin)
 *     tags:
 *       - Contato
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
 *         description: Mensagem excluída com sucesso
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao excluir mensagem',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Mensagem excluída com sucesso',
    })
  })
)

export default router
