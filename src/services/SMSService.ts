import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

// Suporte para múltiplos provedores de SMS
const SMS_PROVIDER = process.env.SMS_PROVIDER || 'twilio' // twilio, nexmo, aws-sns, etc
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

export class SMSService {
  /**
   * Envia SMS de confirmação de inscrição
   * @param phoneNumber - Número de telefone no formato internacional (ex: +244999123456)
   * @param name - Nome do participante
   * @param eventTitle - Título do evento
   * @param eventDate - Data do evento
   * @param eventTime - Hora do evento
   * @param eventLocation - Local do evento
   */
  static async sendRegistrationSMS(
    phoneNumber: string,
    name: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string
  ): Promise<void> {
    // Validar número de telefone
    const cleanPhone = this.formatPhoneNumber(phoneNumber)
    if (!cleanPhone) {
      console.warn(`⚠️ Número de telefone inválido: ${phoneNumber}`)
      return
    }

    // Verificar se o SMS está configurado
    if (!this.isConfigured()) {
      console.warn(`⚠️ SMS não configurado. Provedor: ${SMS_PROVIDER}`)
      return
    }

    try {
      const message = this.buildRegistrationMessage(name, eventTitle, eventDate, eventTime, eventLocation)

      if (SMS_PROVIDER === 'twilio') {
        await this.sendViaTwilio(cleanPhone, message)
      } else {
        console.warn(`⚠️ Provedor SMS não suportado: ${SMS_PROVIDER}`)
      }
    } catch (error) {
      console.error('❌ Error sending SMS:', error)
      // Não lançar erro para não bloquear o fluxo principal
    }
  }

  /**
   * Envia SMS de confirmação quando admin confirma a inscrição
   * @param phoneNumber - Número de telefone no formato internacional
   * @param name - Nome do participante
   * @param eventTitle - Título do evento
   * @param eventDate - Data do evento
   * @param eventTime - Hora do evento
   * @param eventLocation - Local do evento
   */
  static async sendConfirmationSMS(
    phoneNumber: string,
    name: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string
  ): Promise<void> {
    const cleanPhone = this.formatPhoneNumber(phoneNumber)
    if (!cleanPhone) {
      console.warn(`⚠️ Número de telefone inválido: ${phoneNumber}`)
      return
    }

    if (!this.isConfigured()) {
      console.warn(`⚠️ SMS não configurado. Provedor: ${SMS_PROVIDER}`)
      return
    }

    try {
      const message = this.buildConfirmationMessage(name, eventTitle, eventDate, eventTime, eventLocation)

      if (SMS_PROVIDER === 'twilio') {
        await this.sendViaTwilio(cleanPhone, message)
      } else {
        console.warn(`⚠️ Provedor SMS não suportado: ${SMS_PROVIDER}`)
      }
    } catch (error) {
      console.error('❌ Error sending confirmation SMS:', error)
    }
  }

  /**
   * Envia SMS via Twilio
   */
  private static async sendViaTwilio(phoneNumber: string, message: string): Promise<void> {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error('Twilio credentials not configured')
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`

    const data = new URLSearchParams()
    data.append('From', TWILIO_PHONE_NUMBER)
    data.append('To', phoneNumber)
    data.append('Body', message)

    try {
      const response = await axios.post(url, data, {
        auth: {
          username: TWILIO_ACCOUNT_SID,
          password: TWILIO_AUTH_TOKEN,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      if (response.data && response.data.sid) {
        console.log(`✅ SMS sent successfully to ${phoneNumber}`)
        console.log(`📱 Message SID: ${response.data.sid}`)
      }
    } catch (error: any) {
      console.error('❌ Twilio API Error:', error.response?.data || error.message)
      throw error
    }
  }

  /**
   * Constrói mensagem de inscrição recebida
   */
  private static buildRegistrationMessage(
    name: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string
  ): string {
    return `🎉 Elit'Arte - Inscrição Recebida\n\nOlá ${name}!\n\nRecebemos sua inscrição no evento:\n\n📌 ${eventTitle}\n📅 ${eventDate}\n🕐 ${eventTime}\n📍 ${eventLocation}\n\nSua inscrição está sendo processada. Você receberá uma confirmação em breve.\n\nGuarde esta mensagem como comprovante.`
  }

  /**
   * Constrói mensagem de confirmação
   */
  private static buildConfirmationMessage(
    name: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string
  ): string {
    return `✅ Elit'Arte - Inscrição Confirmada\n\nOlá ${name}!\n\nSua inscrição foi confirmada com sucesso!\n\n📌 ${eventTitle}\n📅 ${eventDate}\n🕐 ${eventTime}\n📍 ${eventLocation}\n\nGuarde esta mensagem como comprovante. Você receberá mais informações em breve.`
  }

  /**
   * Formata e valida número de telefone
   */
  private static formatPhoneNumber(phoneNumber: string): string | null {
    if (!phoneNumber) return null

    // Remover caracteres não numéricos exceto o +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '')

    // Garantir que começa com +
    if (!cleaned.startsWith('+')) {
      // Se começar com 244 (código de Angola), adicionar +
      if (cleaned.startsWith('244')) {
        cleaned = '+' + cleaned
      } else {
        // Tentar adicionar + se tiver 9 dígitos (assumir Angola)
        if (cleaned.length === 9) {
          cleaned = '+244' + cleaned
        } else {
          return null
        }
      }
    }

    // Validar comprimento mínimo
    if (cleaned.length < 12) {
      return null
    }

    return cleaned
  }

  /**
   * Verifica se o SMS está configurado
   */
  private static isConfigured(): boolean {
    if (SMS_PROVIDER === 'twilio') {
      return !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER)
    }
    return false
  }

  /**
   * Testa a conexão com o provedor SMS
   */
  static async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      console.error(`⚠️ SMS não configurado. Provedor: ${SMS_PROVIDER}`)
      return false
    }

    try {
      if (SMS_PROVIDER === 'twilio') {
        // Testar com uma mensagem vazia (Twilio retorna erro, mas confirma a conexão)
        const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}`
        const response = await axios.get(url, {
          auth: {
            username: TWILIO_ACCOUNT_SID!,
            password: TWILIO_AUTH_TOKEN!,
          },
        })

        console.log('✅ SMS (Twilio) connection successful')
        console.log('📱 Account:', response.data.friendly_name)
        return true
      }
    } catch (error: any) {
      console.error('❌ SMS connection failed:', error.response?.data || error.message)
      return false
    }

    return false
  }
}
