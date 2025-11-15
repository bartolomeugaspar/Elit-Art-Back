import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Ensure upload directory exists (only in development)
const uploadDir = 'uploads/images'
if (process.env.NODE_ENV !== 'production') {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
  } catch (error) {
    console.warn('[Multer] Warning: Could not create upload directory:', error)
  }
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // In production, Vercel doesn't support file uploads to disk
    // This is only for development
    if (process.env.NODE_ENV === 'production') {
      cb(new Error('File uploads are not supported in production. Use cloud storage instead.'), '')
    } else {
      cb(null, uploadDir)
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (jpeg, png, webp, gif)'))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})
