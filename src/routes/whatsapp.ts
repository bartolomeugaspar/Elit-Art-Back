import express from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { WhatsAppService } from '../services/WhatsAppService'

const router = express.Router()

/**
 * @swagger
 * /whatsapp/status:
 *   get:
 *     summary: Verificar status do WhatsApp
 *     description: Verifica se o WhatsApp está conectado e autorizado
 *     tags: [WhatsApp]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status da conexão
 *       403:
 *         description: Apenas administradores podem verificar
 */
router.get('/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const isConnected = await WhatsAppService.testConnection()
    
    res.json({
      success: true,
      connected: isConnected,
      message: isConnected 
        ? 'WhatsApp conectado com sucesso' 
        : 'WhatsApp não está conectado. Use /whatsapp/initialize para conectar',
      service: 'whatsapp-web.js'
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar status',
      error: error.message
    })
  }
})

/**
 * @swagger
 * /whatsapp/initialize:
 *   post:
 *     summary: Inicializar WhatsApp
 *     description: Inicia o cliente WhatsApp e exibe QR Code no console do servidor
 *     tags: [WhatsApp]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cliente inicializado
 *       403:
 *         description: Apenas administradores podem inicializar
 */
router.post('/initialize', authenticate, authorize('admin'), async (req, res) => {
  try {
    await WhatsAppService.initializeClient()
    
    res.json({
      success: true,
      message: 'Cliente WhatsApp inicializado. Verifique o console do servidor para escanear o QR Code.'
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao inicializar WhatsApp',
      error: error.message
    })
  }
})

/**
 * @swagger
 * /whatsapp/test-send:
 *   post:
 *     summary: Enviar mensagem de teste
 *     description: Envia uma mensagem de teste para um número específico (apenas admin)
 *     tags: [WhatsApp]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Número no formato 244XXXXXXXXX
 *                 example: "244923456789"
 *               message:
 *                 type: string
 *                 description: Mensagem personalizada (opcional)
 *                 example: "Teste de mensagem WhatsApp"
 *     responses:
 *       200:
 *         description: Mensagem enviada
 *       403:
 *         description: Apenas administradores
 */
router.post('/test-send', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { phoneNumber, message } = req.body

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Número de telefone é obrigatório'
      })
    }

    const testMessage = message || `🧪 *Teste de Mensagem - Elit'Arte*\n\nEsta é uma mensagem de teste do sistema.\n\nData/Hora: ${new Date().toLocaleString('pt-PT')}\n\n✅ Se você recebeu esta mensagem, a integração WhatsApp está funcionando corretamente!`

    // Usar método privado através de um método público de teste
    await (WhatsAppService as any).sendMessage(phoneNumber, testMessage)

    res.json({
      success: true,
      message: 'Mensagem de teste enviada com sucesso',
      phoneNumber,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Erro ao enviar mensagem de teste:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagem de teste',
      error: error.message
    })
  }
})

/**
 * @swagger
 * /whatsapp/info:
 *   get:
 *     summary: Obter informações da configuração WhatsApp
 *     description: Retorna informações sobre a configuração do WhatsApp
 *     tags: [WhatsApp]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informações da configuração
 */
router.get('/info', authenticate, authorize('admin'), async (req, res) => {
  try {
    const isConnected = await WhatsAppService.testConnection()
    
    res.json({
      success: true,
      provider: 'whatsapp-web.js',
      connected: isConnected,
      features: {
        welcomeMessages: true,
        passwordReset: true,
        registrationConfirmation: true,
        loginNotifications: true,
        contactReplies: true,
        eventNotifications: true
      },
      message: 'Sistema WhatsApp usando whatsapp-web.js com autenticação local'
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter informações',
      error: error.message
    })
  }
})

export default router
