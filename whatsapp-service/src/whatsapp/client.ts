import { Client, LocalAuth } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import * as fs from 'fs'
import * as path from 'path'

class WhatsAppClient {
  private static instance: WhatsAppClient
  private client: Client
  private isReady: boolean = false
  private isInitializing: boolean = false
  private currentQR: string | null = null
  private messageHistory: Array<{
    id: string
    from: string
    body: string
    timestamp: number
    type: 'received' | 'sent'
  }> = []

  private constructor() {
    // Detectar executável do Chrome
    const executablePath = this.findChromeExecutable()
    
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: '.wwebjs_auth'
      }),
      puppeteer: {
        executablePath: executablePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-extensions',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-breakpad',
          '--disable-component-extensions-with-background-pages',
          '--disable-default-apps',
          '--disable-sync',
          '--disable-translate',
          '--disable-features=TranslateUI,BlinkGenPropertyTrees,AudioServiceOutOfProcess,CalculateNativeWinOcclusion',
          '--disable-ipc-flooding-protection',
          '--disable-renderer-backgrounding',
          '--enable-features=NetworkService,NetworkServiceInProcess',
          '--force-color-profile=srgb',
          '--hide-scrollbars',
          '--metrics-recording-only',
          '--mute-audio',
          '--no-default-browser-check',
          '--no-pings',
          '--password-store=basic',
          '--use-mock-keychain',
          '--safebrowsing-disable-auto-update',
          '--disable-blink-features=AutomationControlled'
        ],
        headless: true
      }
    })

    this.setupEventHandlers()
  }

  private findChromeExecutable(): string | undefined {
    // 1. Verificar cache do Puppeteer primeiro
    const cacheDir = process.env.PUPPETEER_CACHE_DIR || '/opt/render/project/src/whatsapp-service/.cache/puppeteer'
    const chromeCachePath = path.join(cacheDir, 'chrome')
    
    if (fs.existsSync(chromeCachePath)) {
      try {
        const versions = fs.readdirSync(chromeCachePath)
        for (const version of versions) {
          const chromePath = path.join(chromeCachePath, version, 'chrome-linux64', 'chrome')
          if (fs.existsSync(chromePath)) {
            console.log(`✅ Chrome found at: ${chromePath}`)
            return chromePath
          }
        }
      } catch (err) {
        console.log('⚠️ Erro ao procurar no cache do Puppeteer:', err)
      }
    }
    
    // 2. Tentar locais do sistema
    const possiblePaths = [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/snap/bin/chromium',
    ]

    for (const chromePath of possiblePaths) {
      if (chromePath && fs.existsSync(chromePath)) {
        console.log(`✅ Chrome found at: ${chromePath}`)
        return chromePath
      }
    }

    console.log('⚠️ Chrome not found, puppeteer will try to download it')
    return undefined
  }

  public static getInstance(): WhatsAppClient {
    if (!WhatsAppClient.instance) {
      WhatsAppClient.instance = new WhatsAppClient()
    }
    return WhatsAppClient.instance
  }

  private setupEventHandlers(): void {
    this.client.on('qr', (qr) => {
      this.currentQR = qr
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
      this.currentQR = null
      console.log('\n' + '='.repeat(50))
      console.log('✅ WhatsApp conectado e pronto para enviar mensagens!')
      console.log('='.repeat(50) + '\n')
    })

    this.client.on('authenticated', () => {
      this.currentQR = null
      console.log('🔐 WhatsApp autenticado com sucesso!')
    })

    this.client.on('auth_failure', (msg) => {
      this.isReady = false
      this.isInitializing = false
      this.currentQR = null
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

  public getQRCode(): string | null {
    return this.currentQR
  }

  public isClientReady(): boolean {
    return this.isReady
  }

  public async getStatus(): Promise<{ ready: boolean; initializing: boolean; qr: string | null }> {
    return {
      ready: this.isReady,
      initializing: this.isInitializing,
      qr: this.currentQR
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
