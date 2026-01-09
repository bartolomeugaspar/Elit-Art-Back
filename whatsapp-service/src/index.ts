import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import WhatsAppClient from './whatsapp/client'
import whatsappRoutes from './whatsapp/routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/whatsapp-api', whatsappRoutes)

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'WhatsApp Service' })
})

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Elit Arte - WhatsApp Service',
    version: '1.0.0',
    endpoints: [
      'GET /health',
      'GET /api/whatsapp-api/status',
      'POST /api/whatsapp-api/initialize',
      'POST /api/whatsapp-api/send',
      'POST /api/whatsapp-api/send-bulk',
      'GET /api/whatsapp-api/messages'
    ]
  })
})

// Initialize WhatsApp on startup
const whatsappClient = WhatsAppClient.getInstance()
console.log('🚀 Inicializando cliente WhatsApp...')
whatsappClient.initialize().catch(err => {
  console.error('Erro ao inicializar WhatsApp:', err)
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ WhatsApp Service rodando na porta ${PORT}`)
  console.log(`📱 WhatsApp Status: http://localhost:${PORT}/api/whatsapp-api/status`)
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`)
})
