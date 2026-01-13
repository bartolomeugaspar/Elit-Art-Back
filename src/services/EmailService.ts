import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Configure your email service here
// For development, you can use Mailtrap, SendGrid, or any SMTP service
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export class EmailService {
  static async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string,
    resetLink: string
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@elitArte.com',
        to: email,
        subject: 'Recuperação de Senha - Elit\'Arte',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
             <img src="https://elit-Arte.vercel.app/icon.jpeg" alt="Elit'Arte Logo" style="max-width: 100px; height: auto; margin-bottom: 15px; border-radius: 100%;">
              <h1 style="color: #DAA520; margin: 0;">Elit'Arte</h1>
              <p style="color: #F4A460; margin: 5px 0 0 0;">Recuperação de Senha</p>
            </div>
            
            <div style="background: #fafaebff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #8B4513;">
              <p style="color: #2D1810; font-size: 16px;">Olá <strong>${name}</strong>,</p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Recebemos uma solicitação para recuperar sua senha. Clique no botão abaixo para redefinir sua senha:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Redefinir Senha
                </a>
              </div>
              
              <p style="color: #2D1810; font-size: 12px; line-height: 1.6;">
                Ou copie e cole este link no seu navegador:<br/>
                <a href="${resetLink}" style="color: #8B4513; word-wrap: break-word; word-break: break-all; display: block; background: #f0f0f0; padding: 10px; border-radius: 3px; margin-top: 10px; font-size: 11px;">
                  ${resetLink}
                </a>
              </p>
              
              <p style="color: #654321; font-size: 12px; margin-top: 20px;">
                <strong>Importante:</strong> Este link expira em 1 hora. Se você não solicitou esta recuperação, ignore este email.
              </p>
              
              <hr style="border: none; border-top: 1px solid #DAA520; margin: 20px 0;">
              
              <p style="color: #654321; font-size: 11px; text-align: center;">
                © 2025 Elit'Arte. Todos os direitos reservados.
              </p>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (error) {
      throw new Error('Failed to send password reset email')
    }
  }

  static async sendWelcomeEmail(email: string, name: string, temporaryPassword?: string): Promise<void> {
    try {
      const loginUrl = process.env.FRONTEND_URL || 'https://elit-arte.vercel.app';
      
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@elitArte.com',
        to: email,
        subject: 'Bem-vindo à Elit\'Arte',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <img src="https://elit-arte.vercel.app/icon.jpeg" alt="Elit'Arte Logo" style="max-width: 100px; height: auto; margin-bottom: 15px; border-radius: 100%;">
              <h1 style="color: #DAA520; margin: 0;">Elit'Arte</h1>
              <p style="color: #F4A460; margin: 5px 0 0 0;">Plataforma Cultural Angolana</p>
            </div>
            
            <div style="background: #fafaebff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #8B4513;">
              <p style="color: #2D1810; font-size: 16px;">Olá <strong>${name}</strong>, 🎉</p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Sua conta na <strong>Elit'Arte</strong> foi criada com sucesso! Estamos muito felizes em tê-lo(a) conosco.
              </p>
              
              <div style="background: #ffffff; border-left: 4px solid #DAA520; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #8B4513; margin: 0 0 15px 0; font-size: 16px;">📧 Suas Credenciais de Acesso</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #654321; font-size: 14px; width: 80px;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0; color: #2D1810; font-size: 14px;">${email}</td>
                  </tr>
                  ${temporaryPassword ? `
                  <tr>
                    <td style="padding: 8px 0; color: #654321; font-size: 14px;"><strong>Senha:</strong></td>
                    <td style="padding: 8px 0;">
                      <span style="color: #2D1810; font-size: 14px; font-weight: 600; font-family: monospace; background: #fff8dc; padding: 5px 10px; border-radius: 4px; display: inline-block; border: 1px solid #DAA520;">${temporaryPassword}</span>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              ${temporaryPassword ? `
              <div style="background: #fff8dc; border-left: 4px solid #DAA520; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #8B4513; font-size: 13px; margin: 0; line-height: 1.6;">
                  <strong>⚠️ Importante:</strong> Por motivos de segurança, recomendamos que você altere sua senha no primeiro acesso através do seu perfil.
                </p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="${loginUrl}/admin/login" style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); color: #DAA520; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(139, 69, 19, 0.3);">
                  🚀 Acessar Plataforma
                </a>
              </div>
              
              <div style="background: #fff8dc; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #DAA520;">
                <h3 style="color: #8B4513; margin: 0 0 15px 0; font-size: 16px;">✨ O que você pode fazer na Elit'Arte:</h3>
                <ul style="color: #2D1810; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Gerenciar eventos culturais e artísticos</li>
                  <li>Cadastrar e promover artistas angolanos</li>
                  <li>Publicar e gerenciar conteúdo na revista cultural</li>
                  <li>Administrar a galeria de obras de arte</li>
                  <li>Acompanhar inscrições e participantes</li>
                </ul>
              </div>
              
              <p style="color: #654321; font-size: 13px; line-height: 1.6; margin-top: 20px;">
                Se você tiver alguma dúvida ou precisar de ajuda, não hesite em nos contactar.
              </p>
              
              <hr style="border: none; border-top: 1px solid #DAA520; margin: 20px 0;">
              
              <p style="color: #654321; font-size: 11px; text-align: center;">
                © ${new Date().getFullYear()} Elit'Arte. Todos os direitos reservados.
              </p>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
      console.log(`✅ Email de boas-vindas enviado para: ${email}`)
    } catch (error) {
      console.error(`❌ Erro ao enviar email de boas-vindas para ${email}:`, error)
      throw new Error('Failed to send welcome email')
    }
  }

  static async sendRegistrationEmail(
    email: string,
    name: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string,
    paymentMethod?: string,
    isFree?: boolean
  ): Promise<void> {
    try {
      // Mensagem específica baseada no método de pagamento
      let paymentMessage = '';
      if (isFree) {
        paymentMessage = `
          <div style="background: #d1fae5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 4px;">
            <p style="color: #065f46; font-size: 14px; margin: 0;">
              ✅ <strong>Evento Gratuito:</strong> Sua inscrição está confirmada! Não é necessário pagamento.
            </p>
          </div>
        `;
      } else if (paymentMethod === 'Cash') {
        paymentMessage = `
          <div style="background: #dbeafe; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">
            <p style="color: #1e40af; font-size: 14px; margin: 0; line-height: 1.6;">
              💵 <strong>Pagamento em Dinheiro:</strong> Traga o valor exato no dia do evento. 
              Sua inscrição ficará como "pendente" até a confirmação do pagamento pela nossa equipe.
            </p>
          </div>
        `;
      } else if (paymentMethod) {
        paymentMessage = `
          <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px;">
            <p style="color: #92400e; font-size: 14px; margin: 0;">
              ⏳ <strong>Pagamento em Análise:</strong> Seu comprovativo está sendo verificado. Você receberá a confirmação em breve.
            </p>
          </div>
        `;
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@elitArte.com',
        to: email,
        subject: `Inscrição Recebida - ${eventTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <img src="https://elit-Arte.vercel.app/icon.jpeg" alt="Elit'Arte Logo" style="max-width: 100px; height: auto; margin-bottom: 15px; border-radius: 100%;">
              <h1 style="color: #DAA520; margin: 0;">Elit'Arte</h1>
              <p style="color: #F4A460; margin: 5px 0 0 0;">Inscrição Recebida</p>
            </div>
            
            <div style="background: #fafaebff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #8B4513;">
              <p style="color: #2D1810; font-size: 16px;">Olá <strong>${name}</strong>,</p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Obrigado por se inscrever! Recebemos sua inscrição no seguinte evento:
              </p>
              
              <div style="background: #f0f0f0; padding: 20px; border-left: 4px solid #8B4513; margin: 20px 0; border-radius: 4px;">
                <p style="color: #2D1810; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                  📌 ${eventTitle}
                </p>
                <p style="color: #654321; font-size: 14px; margin: 5px 0;">
                  <strong>Data:</strong> ${eventDate}
                </p>
                <p style="color: #654321; font-size: 14px; margin: 5px 0;">
                  <strong>Hora:</strong> ${eventTime}
                </p>
                <p style="color: #654321; font-size: 14px; margin: 5px 0;">
                  <strong>Local:</strong> ${eventLocation}
                </p>
              </div>
              
              ${paymentMessage}
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Guarde este email como comprovante da sua inscrição.
              </p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Se tiver alguma dúvida, entre em contato conosco.
              </p>
              
              <hr style="border: none; border-top: 1px solid #DAA520; margin: 20px 0;">
              
              <p style="color: #654321; font-size: 11px; text-align: center;">
                © 2025 Elit'Arte. Todos os direitos reservados.
              </p>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (error) {
      throw new Error('Failed to send registration email')
    }
  }

  static async sendRegistrationConfirmationEmail(
    email: string,
    name: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@elitArte.com',
        to: email,
        subject: `Inscrição Confirmada - ${eventTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <img src="https://elit-Arte.vercel.app/icon.jpeg" alt="Elit'Arte Logo" style="max-width: 100px; height: auto; margin-bottom: 15px; border-radius: 100%;">
              <h1 style="color: #DAA520; margin: 0;">Elit'Arte</h1>
              <p style="color: #F4A460; margin: 5px 0 0 0;">Inscrição Confirmada</p>
            </div>
            
            <div style="background: #fafaebff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #8B4513;">
              <p style="color: #2D1810; font-size: 16px;">Olá <strong>${name}</strong>,</p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Sua inscrição foi <strong style="color: #228B22;">confirmada com sucesso</strong> no seguinte evento:
              </p>
              
              <div style="background: #f0f0f0; padding: 20px; border-left: 4px solid #8B4513; margin: 20px 0; border-radius: 4px;">
                <p style="color: #2D1810; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                  📌 ${eventTitle}
                </p>
                <p style="color: #654321; font-size: 14px; margin: 5px 0;">
                  <strong>Data:</strong> ${eventDate}
                </p>
                <p style="color: #654321; font-size: 14px; margin: 5px 0;">
                  <strong>Hora:</strong> ${eventTime}
                </p>
                <p style="color: #654321; font-size: 14px; margin: 5px 0;">
                  <strong>Local:</strong> ${eventLocation}
                </p>
              </div>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Guarde este email como comprovante da sua inscrição. Você receberá mais informações sobre o evento em breve.
              </p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Se tiver alguma dúvida, entre em contato conosco.
              </p>
              
              <hr style="border: none; border-top: 1px solid #DAA520; margin: 20px 0;">
              
              <p style="color: #654321; font-size: 11px; text-align: center;">
                © 2025 Elit'Arte. Todos os direitos reservados.
              </p>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (error) {
      throw new Error('Failed to send registration confirmation email')
    }
  }

  static async sendContactReply(
    recipientEmail: string,
    recipientName: string,
    originalSubject: string,
    originalMessage: string,
    replyMessage: string,
    adminName: string
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@elitarte.com',
        to: recipientEmail,
        subject: `Re: ${originalSubject} - Elit'Arte`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <img src="https://elit-arte.vercel.app/icon.jpeg" alt="Elit'Arte Logo" style="max-width: 100px; height: auto; margin-bottom: 15px; border-radius: 100%;">
              <h1 style="color: #DAA520; margin: 0;">Elit'Arte</h1>
              <p style="color: #F4A460; margin: 5px 0 0 0;">Resposta à sua mensagem</p>
            </div>
            
            <div style="background: #fafaebff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #8B4513;">
              <p style="color: #2D1810; font-size: 16px;">Olá <strong>${recipientName}</strong>,</p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Obrigado por entrar em contacto connosco. Segue a resposta à sua mensagem:
              </p>
              
              <div style="background: white; padding: 20px; border-left: 4px solid #8B4513; margin: 20px 0; border-radius: 4px;">
                <p style="color: #2D1810; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${replyMessage}</p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #DAA520; margin: 30px 0;">
              
              <p style="color: #654321; font-size: 12px; margin-bottom: 10px;"><strong>Sua mensagem original:</strong></p>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                <p style="color: #654321; font-size: 11px; margin: 0 0 5px 0;"><strong>Assunto:</strong> ${originalSubject}</p>
                <p style="color: #654321; font-size: 12px; line-height: 1.6; white-space: pre-wrap; margin: 10px 0 0 0;">${originalMessage}</p>
              </div>
              
              <p style="color: #2D1810; font-size: 13px;">
                Se tiver mais alguma dúvida, não hesite em nos contactar novamente.
              </p>
              
              <p style="color: #2D1810; font-size: 13px; margin-top: 20px;">
                Cumprimentos,<br>
                <strong>${adminName}</strong><br>
                <span style="color: #8B4513;">Equipa Elit'Arte</span>
              </p>
              
              <hr style="border: none; border-top: 1px solid #DAA520; margin: 30px 0;">
              
              <div style="text-align: center;">
                <p style="color: #654321; font-size: 12px; margin-bottom: 10px;">Siga-nos nas redes sociais</p>
                <div style="margin: 15px 0;">
                  <a href="#" style="margin: 0 10px; color: #8B4513; text-decoration: none;">Facebook</a>
                  <a href="#" style="margin: 0 10px; color: #8B4513; text-decoration: none;">Instagram</a>
                  <a href="#" style="margin: 0 10px; color: #8B4513; text-decoration: none;">YouTube</a>
                </div>
              </div>
              
              <p style="color: #654321; font-size: 11px; text-align: center; margin-top: 20px;">
                © 2025 Elit'Arte. Todos os direitos reservados.
              </p>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (error) {
      throw new Error('Failed to send contact reply email')
    }
  }

  static async sendLoginNotification(
    email: string,
    name: string,
    ipAddress: string,
    timestamp: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@elitarte.com',
        to: email,
        subject: '[Elit\'Arte][Login] Novo acesso detectado',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
              <img src="https://elit-arte.vercel.app/icon.jpeg" alt="Elit'Arte Logo" style="max-width: 80px; height: auto; margin-bottom: 10px; border-radius: 100%;">
              <h1 style="color: #DAA520; margin: 0; font-size: 24px;">Elit'Arte</h1>
            </div>
            
            <div style="background: #fafaebff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                <p style="color: #856404; font-size: 14px; margin: 0; font-weight: bold;">
                  🔐 Novo Login Detectado
                </p>
              </div>
              
              <p style="color: #2D1810; font-size: 16px; margin-bottom: 10px;">Olá <strong>${name}</strong>,</p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                Detectámos um novo login na sua conta Elit'Arte:
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #dee2e6;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6c757d; font-size: 13px; width: 120px;">
                      <strong>📍 Endereço IP:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #2D1810; font-size: 14px; font-family: 'Courier New', monospace;">
                      ${ipAddress}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6c757d; font-size: 13px;">
                      <strong>🕒 Data/Hora:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #2D1810; font-size: 14px;">
                      ${timestamp}
                    </td>
                  </tr>
                  ${userAgent ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6c757d; font-size: 13px; vertical-align: top;">
                      <strong>💻 Dispositivo:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #2D1810; font-size: 12px; word-break: break-word;">
                      ${userAgent}
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="background: #fff; border: 2px solid #dc3545; padding: 20px; border-radius: 6px; margin: 25px 0;">
                <p style="color: #dc3545; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">
                  ⚠️ Não reconhece este login?
                </p>
                <p style="color: #2D1810; font-size: 13px; line-height: 1.6; margin: 0;">
                  Se não foi você que fez login, recomendamos que altere imediatamente a sua senha e entre em contacto connosco.
                </p>
              </div>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="https://elit-arte.vercel.app/admin/forgot-password" style="background: #8B4513; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 14px;">
                  Alterar Senha
                </a>
              </div>
              
              <p style="color: #6c757d; font-size: 12px; line-height: 1.5; margin-top: 25px; text-align: center;">
                Se foi você que fez login, pode ignorar este email. Este é um email automático de segurança.
              </p>
              
              <hr style="border: none; border-top: 1px solid #DAA520; margin: 30px 0;">
              
              <p style="color: #654321; font-size: 11px; text-align: center; margin: 0;">
                Este email foi enviado por Elit'Arte<br>
                © 2025 Elit'Arte. Todos os direitos reservados.
              </p>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (error) {
      // Log error but don't throw - login should succeed even if email fails
    }
  }

  static async sendNewEventNotification(
    email: string,
    eventTitle: string,
    eventDescription: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string,
    eventCategory: string,
    eventImage?: string,
    eventPrice?: number,
    isFree?: boolean
  ): Promise<void> {
    try {
      const eventUrl = `${process.env.FRONTEND_URL || 'https://elit-arte.vercel.app'}/eventos`;
      
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@elitarte.com',
        to: email,
        subject: `Novo Evento: ${eventTitle} - Elit'Arte`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
              <img src="https://elit-arte.vercel.app/icon.jpeg" alt="Elit'Arte Logo" style="max-width: 80px; height: auto; margin-bottom: 10px; border-radius: 100%;">
              <h1 style="color: #DAA520; margin: 0; font-size: 24px;">Elit'Arte</h1>
              <p style="color: #F4A460; margin: 5px 0 0 0; font-size: 14px;">Novo Evento Disponível</p>
            </div>
            
            <div style="background: #fafaebff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
              <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 15px; margin-bottom: 25px; border-radius: 6px; text-align: center;">
                <p style="color: white; font-size: 16px; margin: 0; font-weight: bold;">
                  🎉 Acabou de ser publicado um novo evento!
                </p>
              </div>
              
              ${eventImage ? `
              <div style="margin-bottom: 20px; text-align: center;">
                <img src="${eventImage}" alt="${eventTitle}" style="max-width: 100%; height: auto; border-radius: 8px; border: 2px solid #DAA520;">
              </div>
              ` : ''}
              
              <h2 style="color: #8B4513; font-size: 22px; margin: 0 0 10px 0; border-bottom: 2px solid #DAA520; padding-bottom: 10px;">
                ${eventTitle}
              </h2>
              
              <div style="background: #fff8dc; border-left: 4px solid #DAA520; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #2D1810; font-size: 14px; line-height: 1.6; margin: 0;">
                  ${eventDescription}
                </p>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #dee2e6;">
                <h3 style="color: #8B4513; font-size: 16px; margin: 0 0 15px 0;">📋 Detalhes do Evento</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #6c757d; font-size: 14px; width: 100px; vertical-align: top;">
                      <strong>📅 Data:</strong>
                    </td>
                    <td style="padding: 10px 0; color: #2D1810; font-size: 14px;">
                      ${eventDate}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6c757d; font-size: 14px; vertical-align: top;">
                      <strong>🕒 Hora:</strong>
                    </td>
                    <td style="padding: 10px 0; color: #2D1810; font-size: 14px;">
                      ${eventTime}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6c757d; font-size: 14px; vertical-align: top;">
                      <strong>📍 Local:</strong>
                    </td>
                    <td style="padding: 10px 0; color: #2D1810; font-size: 14px;">
                      ${eventLocation}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6c757d; font-size: 14px; vertical-align: top;">
                      <strong>🎭 Categoria:</strong>
                    </td>
                    <td style="padding: 10px 0; color: #2D1810; font-size: 14px;">
                      ${eventCategory}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6c757d; font-size: 14px; vertical-align: top;">
                      <strong>💰 Preço:</strong>
                    </td>
                    <td style="padding: 10px 0; color: #2D1810; font-size: 14px;">
                      ${isFree ? '<span style="color: #28a745; font-weight: bold;">GRÁTIS</span>' : `${eventPrice?.toLocaleString('pt-AO')} Kz`}
                    </td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${eventUrl}" style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); color: #DAA520; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(139, 69, 19, 0.3);">
                  🎫 Ver Evento e Inscrever-se
                </a>
              </div>
              
              <div style="background: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 6px; margin: 25px 0;">
                <p style="color: #004085; font-size: 13px; line-height: 1.6; margin: 0;">
                  <strong>💡 Dica:</strong> Não perca esta oportunidade! As vagas podem ser limitadas. Inscreva-se o quanto antes para garantir a sua participação.
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #DAA520; margin: 30px 0;">
              
              <p style="color: #6c757d; font-size: 12px; line-height: 1.5; text-align: center; margin: 20px 0;">
                Você está recebendo este email porque está inscrito na nossa newsletter.<br>
                Para cancelar a subscrição, <a href="${process.env.FRONTEND_URL || 'https://elit-arte.vercel.app'}/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color: #8B4513;">clique aqui</a>.
              </p>
              
              <div style="text-align: center; margin: 20px 0;">
                <p style="color: #654321; font-size: 12px; margin-bottom: 10px;">Siga-nos nas redes sociais</p>
                <div style="margin: 15px 0;">
                  <a href="#" style="margin: 0 10px; color: #8B4513; text-decoration: none; font-size: 12px;">Facebook</a>
                  <a href="#" style="margin: 0 10px; color: #8B4513; text-decoration: none; font-size: 12px;">Instagram</a>
                  <a href="#" style="margin: 0 10px; color: #8B4513; text-decoration: none; font-size: 12px;">YouTube</a>
                </div>
              </div>
              
              <p style="color: #654321; font-size: 11px; text-align: center; margin: 0;">
                © ${new Date().getFullYear()} Elit'Arte. Todos os direitos reservados.
              </p>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (error) {
      console.error(`❌ Erro ao enviar notificação de evento para ${email}:`, error)
      // Não lançar erro para não bloquear a criação do evento
    }
  }

  static async sendBulkNewEventNotifications(
    subscribers: string[],
    eventTitle: string,
    eventDescription: string,
    eventDate: string,
    eventTime: string,
    eventLocation: string,
    eventCategory: string,
    eventImage?: string,
    eventPrice?: number,
    isFree?: boolean
  ): Promise<void> {
    console.log(`📧 Enviando notificação de novo evento para ${subscribers.length} inscritos...`)
    
    const emailPromises = subscribers.map(email => 
      this.sendNewEventNotification(
        email,
        eventTitle,
        eventDescription,
        eventDate,
        eventTime,
        eventLocation,
        eventCategory,
        eventImage,
        eventPrice,
        isFree
      ).catch(error => {
        console.error(`Erro ao enviar para ${email}:`, error)
        // Continuar mesmo se falhar para um email
      })
    )

    await Promise.allSettled(emailPromises)
    console.log(`✅ Notificações enviadas para todos os inscritos`)
  }

  /**
   * Notificar administrador sobre nova mensagem de contato
   */
  static async sendContactNotificationToAdmin(
    contactName: string,
    contactEmail: string,
    contactPhone: string,
    subject: string,
    message: string
  ): Promise<void> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'faustinodomingos83@hotmail.com'
      const frontendUrl = process.env.FRONTEND_URL || 'https://elit-arte.vercel.app'

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@elitarte.com',
        to: adminEmail,
        subject: `Nova Mensagem de Contato - ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <img src="https://elit-arte.vercel.app/icon.jpeg" alt="Elit'Arte Logo" style="max-width: 100px; height: auto; margin-bottom: 15px; border-radius: 100%;">
              <h1 style="color: #DAA520; margin: 0;">Elit'Arte</h1>
              <p style="color: #F4A460; margin: 5px 0 0 0;">Nova Mensagem de Contato</p>
            </div>
            
            <div style="background: #fafaebff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #8B4513;">
              <div style="background: #fff8dc; border-left: 4px solid #DAA520; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                <p style="color: #8B4513; font-size: 14px; margin: 0;">
                  <strong>📩 Você recebeu uma nova mensagem através do formulário de contato do site.</strong>
                </p>
              </div>

              <div style="background: #ffffff; border: 1px solid #DAA520; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="color: #8B4513; margin: 0 0 15px 0; font-size: 16px;">Informações do Remetente</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #654321; font-size: 14px; width: 100px;"><strong>Nome:</strong></td>
                    <td style="padding: 8px 0; color: #2D1810; font-size: 14px;">${contactName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #654321; font-size: 14px;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0; color: #2D1810; font-size: 14px;">
                      <a href="mailto:${contactEmail}" style="color: #8B4513;">${contactEmail}</a>
                    </td>
                  </tr>
                  ${contactPhone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #654321; font-size: 14px;"><strong>Telefone:</strong></td>
                    <td style="padding: 8px 0; color: #2D1810; font-size: 14px;">
                      <a href="tel:${contactPhone}" style="color: #8B4513;">${contactPhone}</a>
                    </td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #654321; font-size: 14px;"><strong>Assunto:</strong></td>
                    <td style="padding: 8px 0; color: #2D1810; font-size: 14px;">${subject}</td>
                  </tr>
                </table>
              </div>

              <div style="background: #ffffff; border: 1px solid #DAA520; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="color: #8B4513; margin: 0 0 15px 0; font-size: 16px;">Mensagem</h3>
                <p style="color: #2D1810; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>

              <div style="text-align: center; margin: 25px 0;">
                <a href="${frontendUrl}/admin/dashboard" style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); color: #DAA520; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(139, 69, 19, 0.3);">
                  📧 Ver no Painel Admin
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #DAA520; margin: 20px 0;">
              
              <p style="color: #654321; font-size: 11px; text-align: center;">
                © ${new Date().getFullYear()} Elit'Arte. Todos os direitos reservados.
              </p>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
      console.log(`✅ Notificação de contato enviada ao administrador: ${adminEmail}`)
    } catch (error) {
      console.error('❌ Erro ao enviar notificação ao administrador:', error)
      throw new Error('Failed to send contact notification to admin')
    }
  }

  /**
   * Enviar resposta para mensagem de contato
   */
  static async sendContactReply(
    recipientEmail: string,
    recipientName: string,
    originalSubject: string,
    originalMessage: string,
    reply: string,
    adminName: string
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@elitarte.com',
        to: recipientEmail,
        subject: `Re: ${originalSubject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <img src="https://elit-arte.vercel.app/icon.jpeg" alt="Elit'Arte Logo" style="max-width: 100px; height: auto; margin-bottom: 15px; border-radius: 100%;">
              <h1 style="color: #DAA520; margin: 0;">Elit'Arte</h1>
              <p style="color: #F4A460; margin: 5px 0 0 0;">Resposta à sua Mensagem</p>
            </div>
            
            <div style="background: #fafaebff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #8B4513;">
              <p style="color: #2D1810; font-size: 16px;">Olá <strong>${recipientName}</strong>,</p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Obrigado por entrar em contato com a Elit'Arte. Aqui está a nossa resposta à sua mensagem:
              </p>

              <div style="background: #ffffff; border-left: 4px solid #DAA520; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #2D1810; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${reply}</p>
                <p style="color: #654321; font-size: 12px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #DAA520;">
                  <strong>${adminName}</strong><br>
                  Equipa Elit'Arte
                </p>
              </div>

              <div style="background: #f0f0f0; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="color: #654321; font-size: 12px; margin: 0 0 10px 0;"><strong>Sua mensagem original:</strong></p>
                <p style="color: #2D1810; font-size: 13px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${originalMessage}</p>
              </div>

              <p style="color: #654321; font-size: 13px; line-height: 1.6; margin-top: 20px;">
                Se tiver mais alguma dúvida, não hesite em nos contactar novamente.
              </p>
              
              <hr style="border: none; border-top: 1px solid #DAA520; margin: 20px 0;">
              
              <p style="color: #654321; font-size: 11px; text-align: center;">
                © ${new Date().getFullYear()} Elit'Arte. Todos os direitos reservados.
              </p>
            </div>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
      console.log(`✅ Resposta enviada para: ${recipientEmail}`)
    } catch (error) {
      console.error('❌ Erro ao enviar resposta:', error)
      throw new Error('Failed to send contact reply')
    }
  }
}
