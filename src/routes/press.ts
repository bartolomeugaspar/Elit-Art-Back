import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { PressService } from '../services/PressService'

const router = Router()

// ===== PRESS RELEASES =====

/**
 * @swagger
 * /press/releases:
 *   get:
 *     summary: Listar press releases
 *     tags:
 *       - Imprensa
 *     responses:
 *       200:
 *         description: Lista de press releases
 */
router.get(
  '/releases',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const releases = await PressService.getAllPressReleases()

    res.status(200).json({
      success: true,
      releases,
    })
  })
)

/**
 * @swagger
 * /press/releases/{id}:
 *   get:
 *     summary: Obter detalhes de um press release
 *     tags:
 *       - Imprensa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do press release
 *       404:
 *         description: Press release não encontrado
 */
router.get(
  '/releases/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const release = await PressService.getPressReleaseById(req.params.id)

    if (!release) {
      return res.status(404).json({
        success: false,
        message: 'Press release not found',
      })
    }

    res.status(200).json({
      success: true,
      release,
    })
  })
)

/**
 * @swagger
 * /press/releases:
 *   post:
 *     summary: Criar novo press release (admin only)
 *     tags:
 *       - Imprensa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, summary, author, publication_date]
 *     responses:
 *       201:
 *         description: Press release criado com sucesso
 */
router.post(
  '/releases',
  authenticate,
  authorize('admin'),
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('summary').notEmpty().withMessage('Summary is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('publication_date').isISO8601().withMessage('Valid date is required'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const release = await PressService.createPressRelease(req.body)

    res.status(201).json({
      success: true,
      message: 'Press release created successfully',
      release,
    })
  })
)

/**
 * @swagger
 * /press/releases/{id}:
 *   patch:
 *     summary: Atualizar press release (admin only)
 *     tags:
 *       - Imprensa
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
 *         description: Press release atualizado com sucesso
 */
router.patch(
  '/releases/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const release = await PressService.updatePressRelease(req.params.id, req.body)

    res.status(200).json({
      success: true,
      message: 'Press release updated successfully',
      release,
    })
  })
)

/**
 * @swagger
 * /press/releases/{id}:
 *   delete:
 *     summary: Deletar press release (admin only)
 *     tags:
 *       - Imprensa
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
 *         description: Press release deletado com sucesso
 */
router.delete(
  '/releases/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await PressService.deletePressRelease(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Press release deleted successfully',
    })
  })
)

/**
 * @swagger
 * /press/releases/{id}/publish:
 *   patch:
 *     summary: Publicar press release (admin only)
 *     tags:
 *       - Imprensa
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
 *         description: Press release publicado com sucesso
 */
router.patch(
  '/releases/:id/publish',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const release = await PressService.publishPressRelease(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Press release published successfully',
      release,
    })
  })
)

// ===== MEDIA KIT =====

/**
 * @swagger
 * /press/media-kit:
 *   get:
 *     summary: Listar media kits
 *     tags:
 *       - Imprensa
 *     responses:
 *       200:
 *         description: Lista de media kits
 */
router.get(
  '/media-kit',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const kits = await PressService.getAllMediaKits()

    res.status(200).json({
      success: true,
      kits,
    })
  })
)

/**
 * @swagger
 * /press/media-kit/{id}:
 *   get:
 *     summary: Obter detalhes de um media kit
 *     tags:
 *       - Imprensa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do media kit
 */
router.get(
  '/media-kit/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const kit = await PressService.getMediaKitById(req.params.id)

    if (!kit) {
      return res.status(404).json({
        success: false,
        message: 'Media kit not found',
      })
    }

    res.status(200).json({
      success: true,
      kit,
    })
  })
)

/**
 * @swagger
 * /press/media-kit:
 *   post:
 *     summary: Criar novo media kit (admin only)
 *     tags:
 *       - Imprensa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, file_url, file_type, file_size]
 *     responses:
 *       201:
 *         description: Media kit criado com sucesso
 */
router.post(
  '/media-kit',
  authenticate,
  authorize('admin'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('file_url').notEmpty().withMessage('File URL is required'),
  body('file_type').isIn(['pdf', 'zip', 'doc']),
  body('file_size').isInt({ min: 0 }),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const kit = await PressService.createMediaKit(req.body)

    res.status(201).json({
      success: true,
      message: 'Media kit created successfully',
      kit,
    })
  })
)

/**
 * @swagger
 * /press/media-kit/{id}:
 *   patch:
 *     summary: Atualizar media kit (admin only)
 *     tags:
 *       - Imprensa
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
 *         description: Media kit atualizado com sucesso
 */
router.patch(
  '/media-kit/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const kit = await PressService.updateMediaKit(req.params.id, req.body)

    res.status(200).json({
      success: true,
      message: 'Media kit updated successfully',
      kit,
    })
  })
)

/**
 * @swagger
 * /press/media-kit/{id}:
 *   delete:
 *     summary: Deletar media kit (admin only)
 *     tags:
 *       - Imprensa
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
 *         description: Media kit deletado com sucesso
 */
router.delete(
  '/media-kit/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await PressService.deleteMediaKit(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Media kit deleted successfully',
    })
  })
)

/**
 * @swagger
 * /press/media-kit/{id}/download:
 *   post:
 *     summary: Download media kit
 *     tags:
 *       - Imprensa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Download registrado com sucesso
 */
router.post(
  '/media-kit/:id/download',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const kit = await PressService.incrementDownloads(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Download recorded',
      kit,
    })
  })
)

export default router
