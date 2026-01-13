import { Router, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { ProductService } from '../services/ProductService'

const router = Router()

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Listar todos os produtos
 *     tags:
 *       - Produtos
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [book, magazine, ticket, merchandise]
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *         description: Include inactive products (default false)
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { category, includeInactive } = req.query
    const isActive = includeInactive === 'true' ? undefined : true
    const products = await ProductService.getAllProducts(category as string, isActive)

    res.status(200).json({
      success: true,
      products,
    })
  })
)

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obter detalhes de um produto
 *     tags:
 *       - Produtos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do produto
 *       404:
 *         description: Produto não encontrado
 */
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await ProductService.getProductById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      product,
    })
  })
)

/**
 * @swagger
 * /products/search/{query}:
 *   get:
 *     summary: Buscar produtos
 *     tags:
 *       - Produtos
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
    const products = await ProductService.searchProducts(req.params.query)

    res.status(200).json({
      success: true,
      products,
    })
  })
)

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Criar novo produto (admin only)
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, category, price, image_url, stock, sku]
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['hat', 'backpack', 'tshirt']),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  body('sku').notEmpty().withMessage('SKU is required'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const product = await ProductService.createProduct(req.body)

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    })
  })
)

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Atualizar produto (admin only)
 *     tags:
 *       - Produtos
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
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await ProductService.updateProduct(req.params.id, req.body)

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    })
  })
)

// Also support PUT for update
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await ProductService.updateProduct(req.params.id, req.body)

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    })
  })
)

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deletar produto (admin only)
 *     tags:
 *       - Produtos
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
 *         description: Produto deletado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await ProductService.deleteProduct(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    })
  })
)

export default router
