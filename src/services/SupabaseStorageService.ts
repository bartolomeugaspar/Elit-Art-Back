import { supabase } from '../config/database'
import { v4 as uuidv4 } from 'uuid'

export class SupabaseStorageService {
  private static BUCKET_NAME = 'event-images'

  /**
   * Upload an image to Supabase Storage
   * @param file - Express file object
   * @returns Public URL of the uploaded image
   */
  static async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop()
      const fileName = `${uuidv4()}.${fileExtension}`
      const filePath = `uploads/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        })

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`)
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath)

      return publicUrlData.publicUrl
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete an image from Supabase Storage
   * @param publicUrl - Public URL of the image
   * @returns true if deletion was successful
   */
  static async deleteImage(publicUrl: string): Promise<boolean> {
    try {
      // Extract file path from public URL
      // Format: https://xxxxx.supabase.co/storage/v1/object/public/event-images/uploads/filename
      const urlParts = publicUrl.split(`${this.BUCKET_NAME}/`)
      if (urlParts.length < 2) {
        return false
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath])
      if (error) {
        return false
      }

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Upload an image from a URL to Supabase Storage
   * @param imageUrl - URL of the image to download and upload
   * @returns Public URL of the uploaded image
   */
  static async uploadImageFromUrl(imageUrl: string): Promise<string> {
    try {
      // Validate URL
      try {
        new URL(imageUrl)
      } catch {
        throw new Error('Invalid URL format')
      }

      // Download image from URL
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg'
      
      // Validate content type
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedMimes.includes(contentType)) {
        throw new Error(`Invalid image type: ${contentType}. Allowed: ${allowedMimes.join(', ')}`)
      }

      // Get file extension from content type
      const extension = contentType.split('/')[1] || 'jpg'
      const fileName = `${uuidv4()}.${extension}`
      const filePath = `uploads/${fileName}`

      // Convert response to buffer
      const buffer = await response.arrayBuffer()

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, buffer, {
          contentType,
          upsert: false,
        })

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`)
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath)

      return publicUrlData.publicUrl
    } catch (error) {
      throw error
    }
  }

  /**
   * Check if bucket exists and is accessible
   */
  static async checkBucketAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage.listBuckets()

      if (error) {
        return false
      }

      const bucketExists = data?.some((b) => b.name === this.BUCKET_NAME)

      return !!bucketExists
    } catch (error) {
      return false
    }
  }
}
