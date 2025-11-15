import { Router, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { supabase } from '../config/database'
import { AuditService } from '../services/audit.service'
import { auditMiddleware } from '../middleware/audit.middleware'

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
// Aplicar middleware de auditoria para rotas de usuários
router.use(auditMiddleware('user'));

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

    // Registrar ação de listagem de usuários
    await AuditService.logUserAction(
      req.user?.id,
      'USER_LIST',
      'user',
      '00000000-0000-0000-0000-000000000000',
      req
    );

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
    const { id } = req.params

    // Only allow users to view their own profile, or admins to view any profile
    if (req.user?.role !== 'admin' && req.user?.id !== id) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para visualizar este usuário',
      })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      })
    }

    // Registrar visualização do perfil
    if (req.user) {
      await AuditService.logUserAction(
        req.user.id,
        'USER_VIEW',
        'user',
        id,
        req
      );
    }

    // Remove sensitive data
    const { password, ...userData } = user

    res.status(200).json({
      success: true,
      user: userData,
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
 *                 enum: ['admin', 'Arteist', 'user']
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
