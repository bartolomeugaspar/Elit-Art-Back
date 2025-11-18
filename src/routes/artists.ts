import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { ArtistService } from '../services/ArtistService'
import { authenticate, authorize } from '../middleware/auth'
import { asyncHandler } from '../middleware/asyncHandler'
import { AuthRequest } from '../types/auth'

const router = Router()

/**
 * @swagger
 * /artists:
 *   get:
 *     summary: Listar todos os artistas
 *     tags:
 *       - Artistas
 *     responses:
 *       200:
 *         description: Lista de artistas
 */
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const artists = await ArtistService.getArtists()

    res.status(200).json({
      success: true,
      artists,
    })
  })
)

/**
 * @swagger
 * /artists/{id}:
 *   get:
 *     summary: Obter artista por ID
 *     tags:
 *       - Artistas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
/**
 * @swagger
 * /artists/search/{query}:
 *   get:
 *     summary: Buscar artistas
 *     tags:
 *       - Artistas
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 */
router.get(
  '/search/:query',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const artists = await ArtistService.searchArtists(req.params.query)

    res.status(200).json({
      success: true,
      count: artists.length,
      artists,
    })
  })
)

router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const artist = await ArtistService.getArtistById(req.params.id)

    if (!artist) {
      res.status(404).json({ success: false, message: 'Artista não encontrado' })
      return
    }

    res.status(200).json({
      success: true,
      artist,
    })
  })
)

/**
 * @swagger
 * /artists:
 *   post:
 *     summary: Criar novo artista
 *     tags:
 *       - Artistas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - area
 *               - description
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               artisticName:
 *                 type: string
 *               area:
 *                 type: string
 *               description:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               image:
 *                 type: string
 *               role:
 *                 type: string
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('area').trim().notEmpty().withMessage('Área é obrigatória'),
    body('description').trim().notEmpty().withMessage('Descrição é obrigatória'),
    body('email').isEmail().withMessage('Email inválido'),
    body('phone').trim().notEmpty().withMessage('Telefone é obrigatório'),
  ],
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const artist = await ArtistService.createArtist(req.body)

    res.status(201).json({
      success: true,
      message: 'Artista criado com sucesso',
      artist,
    })
  })
)

/**
 * @swagger
 * /artists/{id}:
 *   put:
 *     summary: Atualizar artista
 *     tags:
 *       - Artistas
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
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const artist = await ArtistService.getArtistById(req.params.id)

    if (!artist) {
      res.status(404).json({ success: false, message: 'Artista não encontrado' })
      return
    }

    const updatedArtist = await ArtistService.updateArtist(req.params.id, req.body)

    res.status(200).json({
      success: true,
      message: 'Artista atualizado com sucesso',
      artist: updatedArtist,
    })
  })
)

/**
 * @swagger
 * /artists/{id}:
 *   delete:
 *     summary: Deletar artista
 *     tags:
 *       - Artistas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const artist = await ArtistService.getArtistById(req.params.id)

    if (!artist) {
      res.status(404).json({ success: false, message: 'Artista não encontrado' })
      return
    }

    const success = await ArtistService.deleteArtist(req.params.id)

    if (!success) {
      res.status(500).json({ success: false, message: 'Erro ao deletar artista' })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Artista deletado com sucesso',
    })
  })
)

export default router
