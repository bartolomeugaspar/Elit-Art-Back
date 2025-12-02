import fs from 'fs'
import path from 'path'

export class UploadService {
  static getImageUrl(filename: string): string {
    const baseUrl = process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:5000'
    return `${baseUrl}/uploads/images/${filename}`
  }

  static deleteImage(filename: string): boolean {
    try {
      const filepath = path.join('uploads/images', filename)
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  static ensureUploadDir(): void {
    // Skip in production (Vercel) - uploads are handled by cloud storage
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const uploadDir = 'uploads/images'
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
    } catch (error) {
      // Don't throw - allow app to continue
    }
  }
}
