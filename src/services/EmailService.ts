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
      console.log(`✅ Password reset email sent to ${email}`)
    } catch (error) {
      console.error('❌ Error sending password reset email:', error)
      throw new Error('Failed to send password reset email')
    }
  }

  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@elitArte.com',
        to: email,
        subject: 'Bem-vindo à Elit\'Arte',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <img src="https://elit-Arte.vercel.app/icon.jpeg" alt="Elit'Arte Logo" style="max-width: 100px; height: auto; margin-bottom: 15px; border-radius: 100%;">
              <h1 style="color: #DAA520; margin: 0;">Elit'Arte</h1>
              <p style="color: #F4A460; margin: 5px 0 0 0;">Bem-vindo!</p>
            </div>
            
            <div style="background: #fafaebff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #8B4513;">
              <p style="color: #2D1810; font-size: 16px;">Olá <strong>${name}</strong>,</p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Bem-vindo à Elit'Arte! Sua conta foi criada com sucesso.
              </p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Agora você pode acessar a plataforma e explorar todos os nossos eventos e oportunidades.
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
      console.log(`✅ Welcome email sent to ${email}`)
    } catch (error) {
      console.error('❌ Error sending welcome email:', error)
      throw new Error('Failed to send welcome email')
    }
  }

  static async sendRegistrationEmail(
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
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Sua inscrição está sendo processada. Você receberá uma confirmação em breve.
              </p>
              
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
      console.log(`✅ Registration email sent to ${email}`)
    } catch (error) {
      console.error('❌ Error sending registration email:', error)
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
      console.log(`✅ Registration confirmation email sent to ${email}`)
    } catch (error) {
      console.error('❌ Error sending registration confirmation email:', error)
      throw new Error('Failed to send registration confirmation email')
    }
  }
}
