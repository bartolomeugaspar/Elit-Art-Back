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
        from: process.env.SMTP_FROM || 'noreply@elitarte.com',
        to: email,
        subject: 'Recuperação de Senha - Elit\'Art',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #DAA520; margin: 0;">Elit'Art</h1>
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
                © 2025 Elit'Art. Todos os direitos reservados.
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
        from: process.env.SMTP_FROM || 'noreply@elitarte.com',
        to: email,
        subject: 'Bem-vindo à Elit\'Art',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #DAA520; margin: 0;">Elit'Art</h1>
              <p style="color: #F4A460; margin: 5px 0 0 0;">Bem-vindo!</p>
            </div>
            
            <div style="background: #fafaebff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #8B4513;">
              <p style="color: #2D1810; font-size: 16px;">Olá <strong>${name}</strong>,</p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Bem-vindo à Elit'Art! Sua conta foi criada com sucesso.
              </p>
              
              <p style="color: #2D1810; font-size: 14px; line-height: 1.6;">
                Agora você pode acessar a plataforma e explorar todos os nossos eventos e oportunidades.
              </p>
              
              <hr style="border: none; border-top: 1px solid #DAA520; margin: 20px 0;">
              
              <p style="color: #654321; font-size: 11px; text-align: center;">
                © 2025 Elit'Art. Todos os direitos reservados.
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
}
