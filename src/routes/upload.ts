import { Router, Response } from 'express'
import { upload } from '../config/multer'
import { SupabaseStorageService } from '../services/SupabaseStorageService'
import { AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload de imagem (arquivo ou URL)
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               imageUrl:
 *                 type: string
 *                 description: URL da imagem (alternativa ao upload de arquivo)
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *       400:
 *         description: Erro no upload
 */
router.post(
  '/image',
  upload.single('image'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { imageUrl: urlFromBody } = req.body

    // Check if either file or URL is provided
    if (!req.file && !urlFromBody) {
      res.status(400).json({
        success: false,
        message: 'Either image file or imageUrl must be provided',
      })
      return
    }

    let imageUrl: string

    if (req.file) {
      // Upload file to Supabase Storage
      imageUrl = await SupabaseStorageService.uploadImage(req.file)
    } else {
      // Upload from URL to Supabase Storage
      imageUrl = await SupabaseStorageService.uploadImageFromUrl(urlFromBody)
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
    })
  })
)

export default router
