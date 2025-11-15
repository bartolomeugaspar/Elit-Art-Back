import { Router, Response } from 'express'
import { upload } from '../config/multer'
import { UploadService } from '../services/UploadService'
import { AuthRequest } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload de imagem (sem autenticação necessária)
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
 *                 filename:
 *                   type: string
 *       400:
 *         description: Erro no upload
 */
router.post(
  '/image',
  upload.single('image'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No image file provided',
      })
      return
    }

    const imageUrl = UploadService.getImageUrl(req.file.filename)

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
      filename: req.file.filename,
    })
  })
)

export default router
