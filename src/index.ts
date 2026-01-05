import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import { connectDB } from './config/database'
import { swaggerSpec } from './config/swagger'
import { errorHandler } from './middleware/errorHandler'
import { UploadService } from './services/UploadService'
import { LogCleanupService } from './services/LogCleanupService'
import authRoutes from './routes/auth'
import artistRoutes from './routes/artists'
import eventRoutes from './routes/events'
import newsletterRoutes from './routes/newsletter'
import uploadRoutes from './routes/upload'
import usersRoutes from './routes/users'
import registrationsRoutes from './routes/registrations'
import auditRoutes from './routes/audit.routes'
import productRoutes from './routes/products'
import orderRoutes from './routes/orders'
import blogRoutes from './routes/blog'
import artworkRoutes from './routes/artworks'
import pressRoutes from './routes/press'
import forumRoutes from './routes/forum'
import contactRoutes from './routes/contact'
import whatsappRoutes from './routes/whatsapp'
import financialReportsRoutes from './routes/financial-reports'

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
  customCss: '.swagger-ui { background-color: #fafafa; }',
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui.css',
  swaggerUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-bundle.js',
}))

// Root route - redirect to Swagger
app.get('/', (req, res) => {
  res.redirect('/api-docs')
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/artists', artistRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/registrations', registrationsRoutes)
app.use('/api/audit-logs', auditRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/artworks', artworkRoutes)
app.use('/api/press', pressRoutes)
app.use('/api/forum', forumRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/whatsapp', whatsappRoutes)
app.use('/api/financial-reports', financialReportsRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
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
    
    // Start log cleanup scheduler (runs every 6 hours)
    LogCleanupService.startCleanupScheduler(6)
    
    app.listen(PORT, () => {
    })
  } catch (error) {
    process.exit(1)
  }
}

startServer()

export default app
