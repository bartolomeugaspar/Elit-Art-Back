import { Router, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { supabase } from '../config/database'

const router = Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos os usuários (admin only)
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
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
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.status(200).json({
      success: true,
      count: users?.length || 0,
      users: users || [],
    })
  })
)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obter usuário por ID
 *     tags:
 *       - Usuários
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
 *         description: Dados do usuário
 *       404:
 *         description: Usuário não encontrado
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error || !user) {
      res.status(404).json({ success: false, message: 'User not found' })
      return
    }

    res.status(200).json({
      success: true,
      user,
    })
  })
)

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags:
 *       - Usuários
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
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ['admin', 'artist', 'user']
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Usuário não encontrado
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (fetchError || !user) {
      res.status(404).json({ success: false, message: 'User not found' })
      return
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        name: req.body.name || user.name,
        role: req.body.role || user.role,
        is_active: req.body.is_active !== undefined ? req.body.is_active : user.is_active,
      })
      .eq('id', req.params.id)
      .select()
      .single()

    if (updateError) throw updateError

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    })
  })
)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletar usuário
 *     tags:
 *       - Usuários
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
 *         description: Usuário deletado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Usuário não encontrado
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (fetchError || !user) {
      res.status(404).json({ success: false, message: 'User not found' })
      return
    }

    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id)

    if (deleteError) throw deleteError

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    })
  })
)

export default router
