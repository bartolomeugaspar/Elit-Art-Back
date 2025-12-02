import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { supabase } from '../config/database'
import { EmailService } from '../services/EmailService'
import { SMSService } from '../services/SMSService'

const router = Router()

/**
 * @swagger
 * /registrations:
 *   get:
 *     summary: Listar todas as inscrições (admin only)
 *     tags:
 *       - Inscrições
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inscrições
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.get(
  '/',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        *,
        event:events(id, title)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.status(200).json({
      success: true,
      count: registrations?.length || 0,
      registrations: registrations || [],
    })
  })
)

/**
 * @swagger
 * /registrations/{id}:
 *   get:
 *     summary: Obter inscrição por ID
 *     tags:
 *       - Inscrições
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
 *         description: Dados da inscrição
 *       404:
 *         description: Inscrição não encontrada
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { data: registration, error } = await supabase
      .from('registrations')
      .select(`
        *,
        event:events(id, title)
      `)
      .eq('id', req.params.id)
      .single()

    if (error || !registration) {
      res.status(404).json({ success: false, message: 'Registration not found' })
      return
    }

    res.status(200).json({
      success: true,
      registration,
    })
  })
)

/**
 * @swagger
 * /registrations/{id}:
 *   patch:
 *     summary: Atualizar status da inscrição
 *     tags:
 *       - Inscrições
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['registered', 'attended', 'cancelled']
 *     responses:
 *       200:
 *         description: Inscrição atualizada
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Inscrição não encontrada
 */
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  [
    body('status')
      .isIn(['registered', 'attended', 'cancelled'])
      .withMessage('Invalid status'),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (fetchError || !registration) {
      res.status(404).json({ success: false, message: 'Registration not found' })
      return
    }

    const { data: updatedRegistration, error: updateError } = await supabase
      .from('registrations')
      .update({ status: req.body.status })
      .eq('id', req.params.id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // Send confirmation email and SMS if status is changed to 'attended'
    if (req.body.status === 'attended' && updatedRegistration) {
      try {
        // Fetch event details
        const { data: event } = await supabase
          .from('events')
          .select('title, date, time, location')
          .eq('id', updatedRegistration.event_id)
          .single()

        if (event) {
          // Send email
          await EmailService.sendRegistrationConfirmationEmail(
            updatedRegistration.email,
            updatedRegistration.full_name,
            event.title,
            event.date,
            event.time,
            event.location
          )

          // Send SMS if phone number is available
          if (updatedRegistration.phone_number) {
            await SMSService.sendConfirmationSMS(
              updatedRegistration.phone_number,
              updatedRegistration.full_name,
              event.title,
              event.date,
              event.time,
              event.location
            )
            
            // Send WhatsApp confirmation
            const { WhatsAppService } = await import('../services/WhatsAppService')
            await WhatsAppService.sendRegistrationConfirmation(
              updatedRegistration.phone_number,
              updatedRegistration.full_name,
              event.title,
              event.date,
              event.location
            ).catch(err => console.error('Erro ao enviar WhatsApp:', err))
          }
        }
      } catch (emailError) {
        // Don't throw error, just log it - the registration was updated successfully
      }
    }

    res.status(200).json({
      success: true,
      message: 'Registration updated successfully',
      registration: updatedRegistration,
    })
  })
)

/**
 * @swagger
 * /registrations/{id}:
 *   delete:
 *     summary: Deletar inscrição
 *     tags:
 *       - Inscrições
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
 *         description: Inscrição deletada
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Inscrição não encontrada
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (fetchError || !registration) {
      res.status(404).json({ success: false, message: 'Registration not found' })
      return
    }

    const { error: deleteError } = await supabase
      .from('registrations')
      .delete()
      .eq('id', req.params.id)

    if (deleteError) throw deleteError

    res.status(200).json({
      success: true,
      message: 'Registration deleted successfully',
    })
  })
)

export default router
