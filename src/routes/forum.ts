import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { ForumService } from '../services/ForumService'

const router = Router()

// ===== TOPICS =====

/**
 * @swagger
 * /forum/topics:
 *   get:
 *     summary: Listar tópicos do fórum
 *     tags:
 *       - Fórum
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tópicos
 */
router.get(
  '/topics',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { category } = req.query
    const topics = await ForumService.getAllTopics(category as string)

    res.status(200).json({
      success: true,
      topics,
    })
  })
)

/**
 * @swagger
 * /forum/topics/{id}:
 *   get:
 *     summary: Obter detalhes de um tópico
 *     tags:
 *       - Fórum
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do tópico
 *       404:
 *         description: Tópico não encontrado
 */
router.get(
  '/topics/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const topic = await ForumService.getTopicById(req.params.id)

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      })
    }

    // Increment views
    await ForumService.incrementViews(req.params.id)

    res.status(200).json({
      success: true,
      topic,
    })
  })
)

/**
 * @swagger
 * /forum/topics:
 *   post:
 *     summary: Criar novo tópico (autenticado)
 *     tags:
 *       - Fórum
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category, author_name]
 *     responses:
 *       201:
 *         description: Tópico criado com sucesso
 */
router.post(
  '/topics',
  authenticate,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['general', 'art', 'events', 'collaboration', 'feedback']),
  body('author_name').notEmpty().withMessage('Author name is required'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const topic = await ForumService.createTopic({
      ...req.body,
      author_id: req.userId,
    })

    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      topic,
    })
  })
)

/**
 * @swagger
 * /forum/topics/{id}:
 *   patch:
 *     summary: Atualizar tópico
 *     tags:
 *       - Fórum
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
 *         description: Tópico atualizado com sucesso
 */
router.patch(
  '/topics/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const topic = await ForumService.updateTopic(req.params.id, req.body)

    res.status(200).json({
      success: true,
      message: 'Topic updated successfully',
      topic,
    })
  })
)

/**
 * @swagger
 * /forum/topics/{id}:
 *   delete:
 *     summary: Deletar tópico (admin only)
 *     tags:
 *       - Fórum
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
 *         description: Tópico deletado com sucesso
 */
router.delete(
  '/topics/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await ForumService.deleteTopic(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Topic deleted successfully',
    })
  })
)

/**
 * @swagger
 * /forum/topics/{id}/pin:
 *   patch:
 *     summary: Fixar tópico (admin only)
 *     tags:
 *       - Fórum
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
 *         description: Tópico fixado com sucesso
 */
router.patch(
  '/topics/:id/pin',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const topic = await ForumService.pinTopic(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Topic pinned successfully',
      topic,
    })
  })
)

/**
 * @swagger
 * /forum/topics/{id}/close:
 *   patch:
 *     summary: Fechar tópico (admin only)
 *     tags:
 *       - Fórum
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
 *         description: Tópico fechado com sucesso
 */
router.patch(
  '/topics/:id/close',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const topic = await ForumService.closeTopic(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Topic closed successfully',
      topic,
    })
  })
)

/**
 * @swagger
 * /forum/recent:
 *   get:
 *     summary: Obter tópicos recentes
 *     tags:
 *       - Fórum
 *     responses:
 *       200:
 *         description: Tópicos recentes
 */
router.get(
  '/recent',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const topics = await ForumService.getRecentTopics()

    res.status(200).json({
      success: true,
      topics,
    })
  })
)

/**
 * @swagger
 * /forum/popular:
 *   get:
 *     summary: Obter tópicos populares
 *     tags:
 *       - Fórum
 *     responses:
 *       200:
 *         description: Tópicos populares
 */
router.get(
  '/popular',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const topics = await ForumService.getPopularTopics()

    res.status(200).json({
      success: true,
      topics,
    })
  })
)

// ===== REPLIES =====

/**
 * @swagger
 * /forum/topics/{topicId}/replies:
 *   get:
 *     summary: Obter respostas de um tópico
 *     tags:
 *       - Fórum
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de respostas
 */
router.get(
  '/topics/:topicId/replies',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const replies = await ForumService.getRepliesByTopic(req.params.topicId)

    res.status(200).json({
      success: true,
      replies,
    })
  })
)

/**
 * @swagger
 * /forum/topics/{topicId}/replies:
 *   post:
 *     summary: Adicionar resposta a um tópico (autenticado)
 *     tags:
 *       - Fórum
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content, author_name]
 *     responses:
 *       201:
 *         description: Resposta adicionada com sucesso
 */
router.post(
  '/topics/:topicId/replies',
  authenticate,
  body('content').notEmpty().withMessage('Content is required'),
  body('author_name').notEmpty().withMessage('Author name is required'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const reply = await ForumService.createReply({
      ...req.body,
      topic_id: req.params.topicId,
      author_id: req.userId,
    })

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      reply,
    })
  })
)

/**
 * @swagger
 * /forum/replies/{id}:
 *   patch:
 *     summary: Atualizar resposta
 *     tags:
 *       - Fórum
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
 *         description: Resposta atualizada com sucesso
 */
router.patch(
  '/replies/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const reply = await ForumService.updateReply(req.params.id, req.body)

    res.status(200).json({
      success: true,
      message: 'Reply updated successfully',
      reply,
    })
  })
)

/**
 * @swagger
 * /forum/replies/{id}:
 *   delete:
 *     summary: Deletar resposta
 *     tags:
 *       - Fórum
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
 *         description: Resposta deletada com sucesso
 */
router.delete(
  '/replies/:id',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await ForumService.deleteReply(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Reply deleted successfully',
    })
  })
)

/**
 * @swagger
 * /forum/replies/{id}/like:
 *   post:
 *     summary: Curtir resposta
 *     tags:
 *       - Fórum
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resposta curtida com sucesso
 */
router.post(
  '/replies/:id/like',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const reply = await ForumService.likeReply(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Reply liked successfully',
      reply,
    })
  })
)

export default router
