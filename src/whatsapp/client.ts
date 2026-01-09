import { Client, LocalAuth } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

class WhatsAppClient {
  private static instance: WhatsAppClient
  private client: Client
  private isReady: boolean = false
  private isInitializing: boolean = false
  private messageHistory: Array<{
    id: string
    from: string
    body: string
    timestamp: number
    type: 'received' | 'sent'
  }> = []

  private constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: '.wwebjs_auth'
      }),
      puppeteer: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ],
        headless: true
      }
    })

    this.setupEventHandlers()
  }

  public static getInstance(): WhatsAppClient {
    if (!WhatsAppClient.instance) {
      WhatsAppClient.instance = new WhatsAppClient()
    }
    return WhatsAppClient.instance
  }

  private setupEventHandlers(): void {
    this.client.on('qr', (qr) => {
      console.log('\n' + '='.repeat(50))
      console.log('📲 ESCANEIE O QR CODE ABAIXO COM O WHATSAPP:')
      console.log('='.repeat(50) + '\n')
      qrcode.generate(qr, { small: true })
      console.log('\n' + '='.repeat(50))
      console.log('⏳ Aguardando escaneamento...')
      console.log('='.repeat(50) + '\n')
    })

    this.client.on('ready', () => {
      this.isReady = true
      this.isInitializing = false
      console.log('\n' + '='.repeat(50))
      console.log('✅ WhatsApp conectado e pronto para enviar mensagens!')
      console.log('='.repeat(50) + '\n')
    })

    this.client.on('authenticated', () => {
      console.log('🔐 WhatsApp autenticado com sucesso!')
    })

    this.client.on('auth_failure', (msg) => {
      this.isReady = false
      this.isInitializing = false
      console.error('❌ Falha na autenticação WhatsApp:', msg)
    })

    this.client.on('disconnected', (reason) => {
      this.isReady = false
      console.log('⚠️ WhatsApp desconectado:', reason)
      console.log('🔄 Tentando reconectar...')
      // Attempt to reinitialize after disconnection
      setTimeout(() => {
        this.initialize().catch(err => 
          console.error('Erro ao reconectar:', err)
        )
      }, 5000)
    })

    this.client.on('message', async (msg) => {
      // Log incoming messages for debugging
      console.log(`📨 Mensagem recebida de ${msg.from}: ${msg.body}`)
      
      // Store message in history
      this.messageHistory.push({
        id: msg.id._serialized || msg.id.id || Date.now().toString(),
        from: msg.from,
        body: msg.body,
        timestamp: msg.timestamp * 1000 || Date.now(),
        type: 'received'
      })
      
      // Keep only last 100 messages to prevent memory issues
      if (this.messageHistory.length > 100) {
        this.messageHistory = this.messageHistory.slice(-100)
      }
    })
  }

  public async initialize(): Promise<void> {
    if (this.isReady) {
      console.log('✅ WhatsApp já está conectado!')
      return
    }

    if (this.isInitializing) {
      console.log('⏳ WhatsApp já está inicializando...')
      return
    }

    this.isInitializing = true
    console.log('🚀 Inicializando cliente WhatsApp...')
    
    try {
      await this.client.initialize()
    } catch (error) {
      this.isInitializing = false
      console.error('❌ Erro ao inicializar WhatsApp:', error)
      throw error
    }
  }

  public async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    if (!this.isReady) {
      console.log('⚠️ WhatsApp não está pronto. Mensagem não enviada.')
      return false
    }

    try {
      // Format phone number: remove all non-numeric characters
      const cleanPhone = phoneNumber.replace(/\D/g, '')
      
      // Ensure it starts with country code (244 for Angola)
      let formattedPhone = cleanPhone
      if (!cleanPhone.startsWith('244') && cleanPhone.length === 9) {
        formattedPhone = '244' + cleanPhone
      }

      const chatId = `${formattedPhone}@c.us`
      
      await this.client.sendMessage(chatId, message)
      console.log(`✅ WhatsApp enviado com sucesso para ${formattedPhone}`)
      
      // Store sent message in history
      this.messageHistory.push({
        id: Date.now().toString(),
        from: chatId,
        body: message,
        timestamp: Date.now(),
        type: 'sent'
      })
      
      // Keep only last 100 messages
      if (this.messageHistory.length > 100) {
        this.messageHistory = this.messageHistory.slice(-100)
      }
      
      return true
    } catch (error: any) {
      console.error('❌ Erro ao enviar WhatsApp:', error.message)
      return false
    }
  }

  public getMessageHistory() {
    return this.messageHistory
  }

  public isClientReady(): boolean {
    return this.isReady
  }

  public async getStatus(): Promise<{ ready: boolean; initializing: boolean }> {
    return {
      ready: this.isReady,
      initializing: this.isInitializing
    }
  }

  public async destroy(): Promise<void> {
    if (this.client) {
      await this.client.destroy()
      this.isReady = false
      this.isInitializing = false
      console.log('🛑 Cliente WhatsApp destruído')
    }
  }
}

export default WhatsAppClient
