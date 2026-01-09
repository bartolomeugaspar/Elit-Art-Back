import express, { Request, Response } from 'express'
import WhatsAppClient from './client'

const router = express.Router()
const whatsappClient = WhatsAppClient.getInstance()

/**
 * @swagger
 * /whatsapp-api/status:
 *   get:
 *     summary: Verificar status do cliente WhatsApp
 *     description: Retorna o status de conexão do WhatsApp
 *     tags: [WhatsApp API]
 *     responses:
 *       200:
 *         description: Status do cliente
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const status = await whatsappClient.getStatus()
    
    res.json({
      success: true,
      status: {
        connected: status.ready,
        initializing: status.initializing,
        message: status.ready 
          ? 'WhatsApp conectado e pronto' 
          : status.initializing 
          ? 'WhatsApp inicializando... Escaneie o QR Code no console do servidor'
          : 'WhatsApp desconectado'
      }
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
 * /whatsapp-api/initialize:
 *   post:
 *     summary: Inicializar cliente WhatsApp
 *     description: Inicia o cliente WhatsApp e gera QR Code no console
 *     tags: [WhatsApp API]
 *     responses:
 *       200:
 *         description: Cliente inicializado
 */
router.post('/initialize', async (req: Request, res: Response) => {
  try {
    await whatsappClient.initialize()
    
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
 * /whatsapp-api/messages:
 *   get:
 *     summary: Obter histórico de mensagens
 *     description: Retorna as últimas mensagens enviadas e recebidas
 *     tags: [WhatsApp API]
 *     responses:
 *       200:
 *         description: Histórico de mensagens
 */
router.get('/messages', async (req: Request, res: Response) => {
  try {
    const messages = whatsappClient.getMessageHistory()
    
    res.json({
      success: true,
      messages: messages.sort((a, b) => b.timestamp - a.timestamp)
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter mensagens',
      error: error.message
    })
  }
})

/**
 * @swagger
 * /whatsapp-api/send:
 *   post:
 *     summary: Enviar mensagem WhatsApp
 *     description: Envia mensagem de texto para um número específico
 *     tags: [WhatsApp API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - message
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Número de telefone com código do país (ex 244923456789)
 *               message:
 *                 type: string
 *                 description: Mensagem a enviar
 *     responses:
 *       200:
 *         description: Mensagem enviada com sucesso
 *       400:
 *         description: Parâmetros inválidos
 *       503:
 *         description: WhatsApp não está conectado
 */
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, message } = req.body

    if (!phoneNumber || !message) {
      res.status(400).json({
        success: false,
        message: 'phoneNumber e message são obrigatórios'
      })
      return
    }

    const status = await whatsappClient.getStatus()
    if (!status.ready) {
      res.status(503).json({
        success: false,
        message: 'WhatsApp não está conectado. Inicialize primeiro.',
        hint: 'Use POST /whatsapp-api/initialize para conectar'
      })
      return
    }

    const sent = await whatsappClient.sendMessage(phoneNumber, message)

    if (sent) {
      res.json({
        success: true,
        message: 'Mensagem WhatsApp enviada com sucesso',
        to: phoneNumber
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Falha ao enviar mensagem WhatsApp'
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar WhatsApp',
      error: error.message
    })
  }
})

/**
 * @swagger
 * /whatsapp-api/send-bulk:
 *   post:
 *     summary: Enviar mensagens em massa
 *     description: Envia a mesma mensagem para múltiplos números
 *     tags: [WhatsApp API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumbers
 *               - message
 *             properties:
 *               phoneNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array de números de telefone
 *               message:
 *                 type: string
 *                 description: Mensagem a enviar
 *               delayMs:
 *                 type: number
 *                 description: Delay entre mensagens em ms (padrão 2000)
 *     responses:
 *       200:
 *         description: Mensagens enviadas
 */
router.post('/send-bulk', async (req: Request, res: Response) => {
  try {
    const { phoneNumbers, message, delayMs = 2000 } = req.body

    if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'phoneNumbers deve ser um array não vazio'
      })
      return
    }

    if (!message) {
      res.status(400).json({
        success: false,
        message: 'message é obrigatório'
      })
      return
    }

    const status = await whatsappClient.getStatus()
    if (!status.ready) {
      res.status(503).json({
        success: false,
        message: 'WhatsApp não está conectado. Inicialize primeiro.'
      })
      return
    }

    const results: Array<{ phone: string; success: boolean }> = []

    for (let i = 0; i < phoneNumbers.length; i++) {
      const phone = phoneNumbers[i]
      const sent = await whatsappClient.sendMessage(phone, message)
      results.push({ phone, success: sent })

      // Add delay between messages to avoid being blocked
      if (i < phoneNumbers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    res.json({
      success: true,
      message: `Envio em massa concluído: ${successCount} enviadas, ${failCount} falhas`,
      total: phoneNumbers.length,
      sent: successCount,
      failed: failCount,
      results
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagens em massa',
      error: error.message
    })
  }
})

export default router
