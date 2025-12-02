import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

// Green-API Configuration
const GREEN_API_URL = process.env.GREEN_API_URL || 'https://7105.api.green-api.com'
const GREEN_API_MEDIA_URL = process.env.GREEN_API_MEDIA_URL || 'https://7105.media.green-api.com'
const GREEN_API_INSTANCE_ID = process.env.GREEN_API_INSTANCE_ID || '7105402510'
const GREEN_API_TOKEN = process.env.GREEN_API_TOKEN || '030e2715493345b892fbb7210475bdeb29d58339cd084a889c'

export class WhatsAppService {
  /**
   * Envia mensagem de texto via Green-API
   * @param phoneNumber - Número de telefone (ex: 244XXXXXXXXX sem o +)
   * @param message - Mensagem a enviar
   */
  private static async sendMessage(phoneNumber: string, message: string): Promise<void> {
    if (!GREEN_API_INSTANCE_ID || !GREEN_API_TOKEN) {
      console.log('⚠️ Green-API não configurado. Mensagem WhatsApp não enviada.')
      return
    }

    const cleanPhone = this.formatPhoneNumber(phoneNumber)
    if (!cleanPhone) {
      console.log('⚠️ Número de telefone inválido:', phoneNumber)
      return
    }

    try {
      const url = `${GREEN_API_URL}/waInstance${GREEN_API_INSTANCE_ID}/sendMessage/${GREEN_API_TOKEN}`
      
      const payload = {
        chatId: `${cleanPhone}@c.us`,
        message: message
      }

      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.data && response.data.idMessage) {
        console.log(`✅ WhatsApp enviado com sucesso para ${cleanPhone}`)
      }
    } catch (error: any) {
      console.error('❌ Erro ao enviar WhatsApp via Green-API:', error.response?.data || error.message)
      // Não lançar erro para não bloquear o fluxo principal
    }
  }

  /**
   * Envia mensagem de boas-vindas via WhatsApp
   */
  static async sendWelcomeMessage(
    phoneNumber: string,
    name: string,
    temporaryPassword?: string
  ): Promise<void> {
    const loginUrl = process.env.FRONTEND_URL || 'https://elit-arte.vercel.app'
    
    let message = `🎉 *Bem-vindo à Elit'Arte!*\n\n`
    message += `Olá *${name}*! 👋\n\n`
    message += `Sua conta na *Elit'Arte* foi criada com sucesso!\n\n`
    message += `📧 *Email:* ${phoneNumber}\n`
    
    if (temporaryPassword) {
      message += `🔑 *Senha temporária:* ${temporaryPassword}\n\n`
      message += `⚠️ *Importante:* Por segurança, altere sua senha no primeiro acesso.\n\n`
    }
    
    message += `🚀 *Acesse:* ${loginUrl}/admin/login\n\n`
    message += `✨ *O que você pode fazer:*\n`
    message += `• Gerenciar eventos culturais\n`
    message += `• Cadastrar artistas angolanos\n`
    message += `• Publicar conteúdo cultural\n`
    message += `• Administrar galeria de arte\n\n`
    message += `_© ${new Date().getFullYear()} Elit'Arte. Todos os direitos reservados._`

    await this.sendMessage(phoneNumber, message)
  }

  /**
   * Envia mensagem de reset de senha via WhatsApp
   */
  static async sendPasswordResetMessage(
    phoneNumber: string,
    name: string,
    resetLink: string
  ): Promise<void> {
    let message = `🔐 *Recuperação de Senha - Elit'Arte*\n\n`
    message += `Olá *${name}*,\n\n`
    message += `Recebemos uma solicitação para recuperar sua senha.\n\n`
    message += `🔗 *Link para redefinir:*\n${resetLink}\n\n`
    message += `⏰ *Importante:* Este link expira em 1 hora.\n\n`
    message += `Se você não solicitou esta recuperação, ignore esta mensagem.\n\n`
    message += `_© ${new Date().getFullYear()} Elit'Arte. Todos os direitos reservados._`

    await this.sendMessage(phoneNumber, message)
  }

  /**
   * Envia mensagem de confirmação de inscrição via WhatsApp
   */
  static async sendRegistrationConfirmation(
    phoneNumber: string,
    name: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string
  ): Promise<void> {
    const formattedDate = new Date(eventDate).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    let message = `🎉 *Inscrição Confirmada - Elit'Arte*\n\n`
    message += `Olá *${name}*! 👋\n\n`
    message += `Sua inscrição foi *confirmada com sucesso* no seguinte evento:\n\n`
    message += `📌 *${eventTitle}*\n`
    message += `📅 Data: ${formattedDate}\n`
    message += `📍 Local: ${eventLocation}\n\n`
    message += `✅ Guarde esta mensagem como comprovante da sua inscrição.\n\n`
    message += `Você receberá mais informações sobre o evento em breve.\n\n`
    message += `Se tiver alguma dúvida, entre em contato conosco.\n\n`
    message += `_© ${new Date().getFullYear()} Elit'Arte. Todos os direitos reservados._`

    await this.sendMessage(phoneNumber, message)
  }

  /**
   * Envia mensagem de registro recebido via WhatsApp
   */
  static async sendRegistrationReceived(
    phoneNumber: string,
    name: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string
  ): Promise<void> {
    let message = `📝 *Inscrição Recebida - Elit'Arte*\n\n`
    message += `Olá *${name}*,\n\n`
    message += `Obrigado por se inscrever! Recebemos sua inscrição no seguinte evento:\n\n`
    message += `📌 *${eventTitle}*\n`
    message += `📅 Data: ${eventDate}\n`
    message += `🕒 Hora: ${eventTime}\n`
    message += `📍 Local: ${eventLocation}\n\n`
    message += `Sua inscrição está sendo processada. Você receberá uma confirmação em breve.\n\n`
    message += `Guarde esta mensagem como comprovante da sua inscrição.\n\n`
    message += `_© ${new Date().getFullYear()} Elit'Arte. Todos os direitos reservados._`

    await this.sendMessage(phoneNumber, message)
  }

  /**
   * Envia resposta de contato via WhatsApp
   */
  static async sendContactReply(
    phoneNumber: string,
    recipientName: string,
    originalSubject: string,
    replyMessage: string,
    adminName: string
  ): Promise<void> {
    let message = `📬 *Resposta à sua mensagem - Elit'Arte*\n\n`
    message += `Olá *${recipientName}*,\n\n`
    message += `Obrigado por entrar em contacto connosco.\n\n`
    message += `*Resposta:*\n${replyMessage}\n\n`
    message += `---\n`
    message += `*Sua mensagem original:*\n`
    message += `Assunto: ${originalSubject}\n\n`
    message += `Se tiver mais alguma dúvida, não hesite em nos contactar novamente.\n\n`
    message += `Cumprimentos,\n*${adminName}*\nEquipa Elit'Arte\n\n`
    message += `_© ${new Date().getFullYear()} Elit'Arte. Todos os direitos reservados._`

    await this.sendMessage(phoneNumber, message)
  }

  /**
   * Envia notificação de login via WhatsApp
   */
  static async sendLoginNotification(
    phoneNumber: string,
    name: string,
    ipAddress: string,
    timestamp: string
  ): Promise<void> {
    let message = `🔐 *Novo Login Detectado - Elit'Arte*\n\n`
    message += `Olá *${name}*,\n\n`
    message += `Detectámos um novo login na sua conta:\n\n`
    message += `📍 *IP:* ${ipAddress}\n`
    message += `🕒 *Data/Hora:* ${timestamp}\n\n`
    message += `⚠️ *Não reconhece este login?*\n`
    message += `Se não foi você, altere imediatamente sua senha e entre em contacto connosco.\n\n`
    message += `Se foi você, pode ignorar esta mensagem.\n\n`
    message += `_© ${new Date().getFullYear()} Elit'Arte. Todos os direitos reservados._`

    await this.sendMessage(phoneNumber, message)
  }

  /**
   * Envia notificação de novo evento via WhatsApp
   */
  static async sendNewEventNotification(
    phoneNumber: string,
    eventTitle: string,
    eventDescription: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string,
    eventCategory: string,
    eventPrice?: number,
    isFree?: boolean
  ): Promise<void> {
    const eventUrl = `${process.env.FRONTEND_URL || 'https://elit-arte.vercel.app'}/eventos`
    
    let message = `🎉 *Novo Evento Disponível - Elit'Arte*\n\n`
    message += `📋 *${eventTitle}*\n\n`
    message += `${eventDescription.substring(0, 200)}${eventDescription.length > 200 ? '...' : ''}\n\n`
    message += `📅 *Data:* ${eventDate}\n`
    message += `🕒 *Hora:* ${eventTime}\n`
    message += `📍 *Local:* ${eventLocation}\n`
    message += `🎭 *Categoria:* ${eventCategory}\n`
    message += `💰 *Preço:* ${isFree ? 'GRÁTIS' : `${eventPrice?.toLocaleString('pt-AO')} Kz`}\n\n`
    message += `🎫 *Inscreva-se:* ${eventUrl}\n\n`
    message += `💡 Não perca! As vagas podem ser limitadas.\n\n`
    message += `_© ${new Date().getFullYear()} Elit'Arte. Todos os direitos reservados._`

    await this.sendMessage(phoneNumber, message)
  }

  /**
   * Envia notificações em massa de novo evento
   */
  static async sendBulkNewEventNotifications(
    subscribers: Array<{ phone?: string }>,
    eventTitle: string,
    eventDescription: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string,
    eventCategory: string,
    eventPrice?: number,
    isFree?: boolean
  ): Promise<void> {
    console.log(`📱 Enviando notificação de novo evento via WhatsApp para ${subscribers.length} inscritos...`)
    
    const whatsappPromises = subscribers
      .filter(sub => sub.phone)
      .map(sub => 
        this.sendNewEventNotification(
          sub.phone!,
          eventTitle,
          eventDescription,
          eventDate,
          eventTime,
          eventLocation,
          eventCategory,
          eventPrice,
          isFree
        ).catch(error => {
          console.error(`Erro ao enviar WhatsApp para ${sub.phone}:`, error)
        })
      )

    await Promise.allSettled(whatsappPromises)
    console.log(`✅ Notificações WhatsApp enviadas`)
  }

  /**
   * Formata e valida número de telefone
   * @param phoneNumber - Número original
   * @returns Número formatado (sem +) ou null se inválido
   */
  private static formatPhoneNumber(phoneNumber: string): string | null {
    if (!phoneNumber) return null

    // Remover todos os caracteres não numéricos
    let cleaned = phoneNumber.replace(/\D/g, '')
    
    // Se começar com +244 ou 244, garantir formato correto
    if (cleaned.startsWith('244')) {
      return cleaned
    }
    
    // Se for número local angolano (9 dígitos), adicionar código do país
    if (cleaned.length === 9 && cleaned.match(/^9[0-9]{8}$/)) {
      return '244' + cleaned
    }

    // Validar tamanho mínimo
    if (cleaned.length < 12) {
      return null
    }

    return cleaned
  }

  /**
   * Testa a conexão com a Green-API
   */
  static async testConnection(): Promise<boolean> {
    if (!GREEN_API_INSTANCE_ID || !GREEN_API_TOKEN) {
      return false
    }

    try {
      const url = `${GREEN_API_URL}/waInstance${GREEN_API_INSTANCE_ID}/getStateInstance/${GREEN_API_TOKEN}`
      const response = await axios.get(url)

      return response.data?.stateInstance === 'authorized'
    } catch (error: any) {
      console.error('Erro ao testar conexão Green-API:', error.message)
      return false
    }
  }
}
