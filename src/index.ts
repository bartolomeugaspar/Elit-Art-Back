import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import { connectDB } from './config/database'
import { swaggerSpec } from './config/swagger'
import { errorHandler } from './middleware/errorHandler'
import { UploadService } from './services/UploadService'
import authRoutes from './routes/auth'
import eventRoutes from './routes/events'
import newsletterRoutes from './routes/newsletter'
import uploadRoutes from './routes/upload'
import usersRoutes from './routes/users'
import registrationsRoutes from './routes/registrations'
import auditRoutes from './routes/audit.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Ensure upload directory exists
UploadService.ensureUploadDir()

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://elit-arte.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
  },
}))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/registrations', registrationsRoutes)
app.use('/api/audit-logs', auditRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Error handler
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    await connectDB()
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`)
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
