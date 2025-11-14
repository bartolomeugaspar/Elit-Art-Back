import fs from 'fs'
import path from 'path'

export class UploadService {
  static getImageUrl(filename: string): string {
    const baseUrl = process.env.API_URL || 'http://localhost:5000'
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
      console.error('Error deleting image:', error)
      return false
    }
  }

  static ensureUploadDir(): void {
    const uploadDir = 'uploads/images'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
  }
}
