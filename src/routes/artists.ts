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
 *     summary: Listar todos os artistas (públicos por padrão, todos se showAll=true com token)
 *     tags:
 *       - Artistas
 *     parameters:
 *       - in: query
 *         name: showAll
 *         schema:
 *           type: boolean
 *         description: Mostrar todos os artistas (requer token válido)
 *     responses:
 *       200:
 *         description: Lista de artistas
 */
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // Se showAll=true e tem token de autorização, mostrar todos
    const hasAuthToken = req.headers.authorization?.startsWith('Bearer ')
    const showAll = req.query.showAll === 'true' && hasAuthToken
    const artists = await ArtistService.getArtists(showAll)

    res.status(200).json({
      success: true,
      artists,
    })
  })
)

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
 *     responses:
 *       200:
 *         description: Lista de artistas encontrados
 */
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
 *     responses:
 *       200:
 *         description: Dados do artista
 *       404:
 *         description: Artista não encontrado
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
 *                 description: Nome do artista
 *               artistic_name:
 *                 type: string
 *                 description: Nome artístico (opcional)
 *               area:
 *                 type: string
 *                 description: Área de atuação (ex. Teatro, Cinema, Literatura)
 *               description:
 *                 type: string
 *                 description: Descrição do artista
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do artista
 *               phone:
 *                 type: string
 *                 description: Telefone do artista
 *               image:
 *                 type: string
 *                 description: URL da imagem do artista
 *               role:
 *                 type: string
 *                 description: Cargo/função (opcional)
 *     responses:
 *       201:
 *         description: Artista criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (requer admin)
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
 *             properties:
 *               name:
 *                 type: string
 *               artistic_name:
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
 *     responses:
 *       200:
 *         description: Artista atualizado com sucesso
 *       404:
 *         description: Artista não encontrado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (requer admin)
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
 *     responses:
 *       200:
 *         description: Artista deletado com sucesso
 *       404:
 *         description: Artista não encontrado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (requer admin)
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
