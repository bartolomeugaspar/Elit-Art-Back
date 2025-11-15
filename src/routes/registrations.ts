import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { supabase } from '../config/database'

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
        user:users(id, name, email),
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
        user:users(id, name, email),
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
 *                 enum: ['confirmed', 'pending', 'cancelled']
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
      .isIn(['confirmed', 'pending', 'cancelled'])
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
      .select(`
        *,
        user:users(id, name, email),
        event:events(id, title)
      `)
      .single()

    if (updateError) throw updateError

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
