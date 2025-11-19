import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { BlogService } from '../services/BlogService'

const router = Router()

// ===== POSTS =====

/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Listar posts do blog
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de posts
 */
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { category } = req.query
    const posts = await BlogService.getAllPosts(category as string)

    res.status(200).json({
      success: true,
      posts,
    })
  })
)

/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Obter detalhes de um post
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do post
 *       404:
 *         description: Post não encontrado
 */
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await BlogService.getPostById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    res.status(200).json({
      success: true,
      post,
    })
  })
)

/**
 * @swagger
 * /blog/slug/{slug}:
 *   get:
 *     summary: Obter post por slug
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do post
 */
router.get(
  '/slug/:slug',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await BlogService.getPostBySlug(req.params.slug)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    res.status(200).json({
      success: true,
      post,
    })
  })
)

/**
 * @swagger
 * /blog/search/{query}:
 *   get:
 *     summary: Buscar posts
 *     tags:
 *       - Blog
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
    const posts = await BlogService.searchPosts(req.params.query)

    res.status(200).json({
      success: true,
      posts,
    })
  })
)

/**
 * @swagger
 * /blog:
 *   post:
 *     summary: Criar novo post (admin only)
 *     tags:
 *       - Blog
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, slug, content, excerpt, featured_image, category, author_id, author_name]
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  body('title').notEmpty().withMessage('Title is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').notEmpty().withMessage('Excerpt is required'),
  body('featured_image').notEmpty().withMessage('Featured image is required'),
  body('category').isIn(['magazine', 'story', 'article', 'poetry', 'drama', 'other']),
  body('author_id').notEmpty().withMessage('Author ID is required'),
  body('author_name').notEmpty().withMessage('Author name is required'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const post = await BlogService.createPost(req.body)

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post,
    })
  })
)

/**
 * @swagger
 * /blog/{id}:
 *   patch:
 *     summary: Atualizar post (admin only)
 *     tags:
 *       - Blog
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
 *         description: Post atualizado com sucesso
 */
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await BlogService.updatePost(req.params.id, req.body)

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post,
    })
  })
)

/**
 * @swagger
 * /blog/{id}:
 *   delete:
 *     summary: Deletar post (admin only)
 *     tags:
 *       - Blog
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
 *         description: Post deletado com sucesso
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await BlogService.deletePost(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    })
  })
)

/**
 * @swagger
 * /blog/{id}/like:
 *   post:
 *     summary: Curtir post
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post curtido com sucesso
 */
router.post(
  '/:id/like',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await BlogService.likePost(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Post liked successfully',
      post,
    })
  })
)

// ===== COMMENTS =====

/**
 * @swagger
 * /blog/{postId}/comments:
 *   get:
 *     summary: Obter comentários de um post
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comentários
 */
router.get(
  '/:postId/comments',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const comments = await BlogService.getCommentsByPost(req.params.postId)

    res.status(200).json({
      success: true,
      comments,
    })
  })
)

/**
 * @swagger
 * /blog/{postId}/comments:
 *   post:
 *     summary: Adicionar comentário
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [author_name, author_email, content]
 *     responses:
 *       201:
 *         description: Comentário adicionado com sucesso
 */
router.post(
  '/:postId/comments',
  body('author_name').notEmpty().withMessage('Author name is required'),
  body('author_email').isEmail().withMessage('Valid email is required'),
  body('content').notEmpty().withMessage('Content is required'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const comment = await BlogService.createComment({
      ...req.body,
      post_id: req.params.postId,
      user_id: req.userId,
    })

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment,
    })
  })
)

/**
 * @swagger
 * /blog/comments/{id}/approve:
 *   patch:
 *     summary: Aprovar comentário (admin only)
 *     tags:
 *       - Blog
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
 *         description: Comentário aprovado com sucesso
 */
router.patch(
  '/comments/:id/approve',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const comment = await BlogService.approveComment(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Comment approved successfully',
      comment,
    })
  })
)

/**
 * @swagger
 * /blog/comments/{id}:
 *   delete:
 *     summary: Deletar comentário (admin only)
 *     tags:
 *       - Blog
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
 *         description: Comentário deletado com sucesso
 */
router.delete(
  '/comments/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await BlogService.deleteComment(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    })
  })
)

export default router
