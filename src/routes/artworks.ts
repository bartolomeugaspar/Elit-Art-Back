import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { ArtworkService } from '../services/ArtworkService'

const router = Router()

/**
 * @swagger
 * /artworks:
 *   get:
 *     summary: Listar todas as obras
 *     tags:
 *       - Obras
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de obras
 */
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { type } = req.query
    const artworks = await ArtworkService.getAllArtworks(type as string)

    res.status(200).json({
      success: true,
      artworks,
    })
  })
)

/**
 * @swagger
 * /artworks/{id}:
 *   get:
 *     summary: Obter detalhes de uma obra
 *     tags:
 *       - Obras
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes da obra
 *       404:
 *         description: Obra não encontrada
 */
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const artwork = await ArtworkService.getArtworkById(req.params.id)

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found',
      })
    }

    res.status(200).json({
      success: true,
      artwork,
    })
  })
)

/**
 * @swagger
 * /artworks/artist/{artistId}:
 *   get:
 *     summary: Obter obras de um artista
 *     tags:
 *       - Obras
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Obras do artista
 */
router.get(
  '/artist/:artistId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const artworks = await ArtworkService.getArtworksByArtist(req.params.artistId)

    res.status(200).json({
      success: true,
      artworks,
    })
  })
)

/**
 * @swagger
 * /artworks/search/{query}:
 *   get:
 *     summary: Buscar obras
 *     tags:
 *       - Obras
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultados da busca
 */
router.get(
  '/search/:query',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const artworks = await ArtworkService.searchArtworks(req.params.query)

    res.status(200).json({
      success: true,
      artworks,
    })
  })
)

/**
 * @swagger
 * /artworks:
 *   post:
 *     summary: Criar nova obra (admin only)
 *     tags:
 *       - Obras
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, artist_id, artist_name, type, year, image_url]
 *     responses:
 *       201:
 *         description: Obra criada com sucesso
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('artist_id').notEmpty().withMessage('Artist ID is required'),
  body('artist_name').notEmpty().withMessage('Artist name is required'),
  body('type').isIn(['musica', 'literatura', 'teatro', 'danca', 'cinema', 'desenho']),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() }),
  body('image_url').notEmpty().withMessage('Image URL is required'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const artwork = await ArtworkService.createArtwork(req.body)

    res.status(201).json({
      success: true,
      message: 'Artwork created successfully',
      artwork,
    })
  })
)

/**
 * @swagger
 * /artworks/{id}:
 *   patch:
 *     summary: Atualizar obra (admin only)
 *     tags:
 *       - Obras
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
 *         description: Obra atualizada com sucesso
 */
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const artwork = await ArtworkService.updateArtwork(req.params.id, req.body)

    res.status(200).json({
      success: true,
      message: 'Artwork updated successfully',
      artwork,
    })
  })
)

/**
 * @swagger
 * /artworks/{id}:
 *   delete:
 *     summary: Deletar obra (admin only)
 *     tags:
 *       - Obras
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
 *         description: Obra deletada com sucesso
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await ArtworkService.deleteArtwork(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Artwork deleted successfully',
    })
  })
)

/**
 * @swagger
 * /artworks/featured:
 *   get:
 *     summary: Obter obras em destaque
 *     tags:
 *       - Obras
 *     responses:
 *       200:
 *         description: Obras em destaque
 */
router.get(
  '/featured',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const artworks = await ArtworkService.getFeaturedArtworks()

    res.status(200).json({
      success: true,
      artworks,
    })
  })
)

export default router
