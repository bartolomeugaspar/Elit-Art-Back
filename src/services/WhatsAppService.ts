import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0'
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN

export class WhatsAppService {
  /**
   * Envia mensagem de confirmação de inscrição via WhatsApp
   * @param phoneNumber - Número de telefone no formato internacional (ex: +244XXXXXXXXX)
   * @param name - Nome do participante
   * @param eventTitle - Título do evento
   * @param eventDate - Data do evento
   * @param eventLocation - Local do evento
   */
  static async sendRegistrationConfirmation(
    phoneNumber: string,
    name: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string
  ): Promise<void> {
    // Verificar se as credenciais estão configuradas
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      return
    }

    // Limpar e validar número de telefone
    const cleanPhone = this.formatPhoneNumber(phoneNumber)
    if (!cleanPhone) {
      return
    }

    // Verificar se deve usar template (para produção) ou mensagem simples (para desenvolvimento)
    const useTemplate = process.env.WHATSAPP_USE_TEMPLATE === 'true'
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME || 'confirmacao_inscricao'

    try {
      const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`
      
      // Formatar data para melhor visualização
      const formattedDate = new Date(eventDate).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      let payload: any

      if (useTemplate) {
        // Usar template aprovado (para produção - pode enviar para qualquer número)
        payload = {
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: 'pt_PT'
            },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: name },
                  { type: 'text', text: eventTitle },
                  { type: 'text', text: formattedDate },
                  { type: 'text', text: eventLocation }
                ]
              }
            ]
          }
        }
      } else {
        // Mensagem de texto simples (apenas para números de teste em desenvolvimento)
        const message = `🎉 *Inscrição Confirmada - Elit'Arte*\n\nOlá *${name}*! 👋\n\nSua inscrição foi *confirmada com sucesso* no seguinte evento:\n\n📌 *${eventTitle}*\n📅 Data: ${formattedDate}\n📍 Local: ${eventLocation}\n\n✅ Guarde esta mensagem como comprovante da sua inscrição.\n\nVocê receberá mais informações sobre o evento em breve.\n\nSe tiver alguma dúvida, entre em contato conosco.\n\n_© 2025 Elit'Arte. Todos os direitos reservados._`

        payload = {
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'text',
          text: {
            body: message
          }
        }
      }

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data && response.data.messages) {
      }
    } catch (error: any) {
      
      // Log detalhado do erro
      if (error.response?.data?.error) {
        const whatsappError = error.response.data.error
      }
      
      // Não lançar erro para não bloquear o fluxo principal
      // A inscrição já foi confirmada, o WhatsApp é um extra
    }
  }

  /**
   * Envia mensagem usando template aprovado (para conversas iniciadas pela empresa)
   * @param phoneNumber - Número no formato internacional
   * @param templateName - Nome do template aprovado no Meta Business
   * @param templateParams - Parâmetros do template
   */
  static async sendTemplateMessage(
    phoneNumber: string,
    templateName: string,
    templateParams: string[]
  ): Promise<void> {
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      return
    }

    const cleanPhone = this.formatPhoneNumber(phoneNumber)
    if (!cleanPhone) {
      return
    }

    try {
      const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`
      
      const payload = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'pt_PT'
          },
          components: [
            {
              type: 'body',
              parameters: templateParams.map(text => ({
                type: 'text',
                text
              }))
            }
          ]
        }
      }

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data && response.data.messages) {
      }
    } catch (error: any) {
    }
  }

  /**
   * Formata e valida número de telefone para WhatsApp
   * @param phoneNumber - Número original (pode conter +, espaços, etc)
   * @returns Número formatado ou null se inválido
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
        return null
      }
    }

    // Validar formato básico (mínimo 10 dígitos após o código do país)
    if (cleaned.length < 12) {
      return null
    }

    return cleaned
  }

  /**
   * Testa a conexão com a API do WhatsApp
   */
  static async testConnection(): Promise<boolean> {
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      return false
    }

    try {
      const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}`
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      })

      return true
    } catch (error: any) {
      return false
    }
  }
}
