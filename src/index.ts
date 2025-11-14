import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import { connectDB } from './config/database'
import { swaggerSpec } from './config/swagger'
import { errorHandler } from './middleware/errorHandler'
import authRoutes from './routes/auth'
import eventRoutes from './routes/events'
import newsletterRoutes from './routes/newsletter'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
