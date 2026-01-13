import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Erro ao enviar e-mail:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Template de email para envio de credenciais ao artista
 */
export const emailCredenciaisArtista = (nomeCompleto: string, email: string, senhaTemporaria: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background: linear-gradient(135deg, #D2691E 0%, #DAA520 100%);
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .credentials {
          background-color: #f0f0f0;
          padding: 15px;
          margin: 20px 0;
          border-left: 4px solid #D2691E;
        }
        .credentials strong {
          color: #D2691E;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #D2691E 0%, #DAA520 100%);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎨 Bem-vindo à Elit-Art!</h1>
        </div>
        <div class="content">
          <h2>Olá, ${nomeCompleto}!</h2>
          
          <p>Seu perfil de artista foi criado com sucesso na plataforma <strong>Elit-Art</strong>! 🎉</p>
          
          <p>Agora você tem acesso à sua área de artista onde pode gerenciar suas quotas, obras e muito mais.</p>
          
          <div class="credentials">
            <h3>Seus dados de acesso:</h3>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Senha temporária:</strong> ${senhaTemporaria}</p>
          </div>
          
          <div class="warning">
            <p>⚠️ <strong>Importante:</strong></p>
            <ul>
              <li>Esta é uma senha temporária gerada automaticamente</li>
              <li>Por segurança, recomendamos que você altere sua senha após o primeiro login</li>
              <li>Não compartilhe suas credenciais com ninguém</li>
            </ul>
          </div>
          
          <p>Na plataforma você pode:</p>
          <ul>
            <li>📊 Gerenciar suas quotas mensais</li>
            <li>🖼️ Cadastrar suas obras de arte</li>
            <li>👤 Atualizar seu perfil</li>
            <li>🔒 Alterar sua senha</li>
          </ul>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">Acessar Plataforma</a>
          </center>
          
          <p style="margin-top: 30px;">Se tiver alguma dúvida, não hesite em entrar em contato conosco.</p>
          
          <p>Atenciosamente,<br><strong>Equipe Elit-Art</strong></p>
        </div>
        <div class="footer">
          <p>Este é um e-mail automático, por favor não responda.</p>
          <p>&copy; ${new Date().getFullYear()} Elit-Art - Todos os direitos reservados</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Template de email para notificar admins sobre novo pagamento pendente
 */
export const emailNovoPagamentoPendente = (
  adminNome: string,
  artistaNome: string,
  artistaEmail: string,
  valor: number,
  mesReferencia: string,
  metodoPagamento?: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .info-box {
          background-color: #f0f0f0;
          padding: 15px;
          margin: 20px 0;
          border-left: 4px solid #ff9800;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #D2691E 0%, #DAA520 100%);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Novo Pagamento de Quota Pendente</h1>
        </div>
        <div class="content">
          <h2>Olá, ${adminNome}!</h2>
          
          <p>Um novo pagamento de quota foi submetido e aguarda sua análise e aprovação.</p>
          
          <div class="info-box">
            <h3>📋 Detalhes do Pagamento:</h3>
            <p><strong>🎨 Artista:</strong> ${artistaNome}</p>
            <p><strong>📧 Email:</strong> ${artistaEmail}</p>
            <p><strong>💰 Valor:</strong> ${parseFloat(valor.toString()).toFixed(2)} Kz</p>
            <p><strong>📅 Mês Referência:</strong> ${new Date(mesReferencia + '-01').toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' })}</p>
            ${metodoPagamento ? `<p><strong>💳 Método de Pagamento:</strong> ${metodoPagamento}</p>` : ''}
          </div>
          
          <p>⚠️ Por favor, acesse o painel administrativo para revisar o comprovante e aprovar ou rejeitar este pagamento.</p>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/quota-payments" class="button">Acessar Painel Administrativo</a>
          </center>
          
          <p style="margin-top: 30px;">Atenciosamente,<br><strong>Sistema Elit-Art</strong></p>
        </div>
        <div class="footer">
          <p>Este é um e-mail automático, por favor não responda.</p>
          <p>&copy; ${new Date().getFullYear()} Elit-Art - Todos os direitos reservados</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Template de email para notificar artista sobre aprovação do pagamento
 */
export const emailPagamentoAprovado = (
  artistaNome: string,
  valor: number,
  mesReferencia: string,
  dataAprovacao: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .success-box {
          background-color: #e8f5e9;
          padding: 15px;
          margin: 20px 0;
          border-left: 4px solid #4CAF50;
          border-radius: 4px;
        }
        .info-box {
          background-color: #f0f0f0;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Pagamento Aprovado!</h1>
        </div>
        <div class="content">
          <h2>Olá, ${artistaNome}!</h2>
          
          <div class="success-box">
            <p style="margin: 0; font-size: 16px;">🎉 <strong>Ótimas notícias!</strong> Seu pagamento de quota foi aprovado com sucesso!</p>
          </div>
          
          <div class="info-box">
            <h3>📋 Detalhes do Pagamento:</h3>
            <p><strong>💰 Valor Pago:</strong> ${parseFloat(valor.toString()).toFixed(2)} Kz</p>
            <p><strong>📅 Mês Referência:</strong> ${new Date(mesReferencia + '-01').toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' })}</p>
            <p><strong>✓ Data de Aprovação:</strong> ${new Date(dataAprovacao).toLocaleDateString('pt-PT')} às ${new Date(dataAprovacao).toLocaleTimeString('pt-PT')}</p>
          </div>
          
          <p>✨ <strong>Obrigado por manter suas contribuições em dia!</strong></p>
          
          <p>Sua colaboração é fundamental para o sucesso da plataforma Elit-Art.</p>
          
          <p style="margin-top: 30px;">Atenciosamente,<br><strong>Equipe Elit-Art</strong></p>
        </div>
        <div class="footer">
          <p>Este é um e-mail automático, por favor não responda.</p>
          <p>&copy; ${new Date().getFullYear()} Elit-Art - Todos os direitos reservados</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Template de email para notificar artista sobre rejeição do pagamento
 */
export const emailPagamentoRejeitado = (
  artistaNome: string,
  valor: number,
  mesReferencia: string,
  motivoRejeicao: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .warning-box {
          background-color: #ffebee;
          padding: 15px;
          margin: 20px 0;
          border-left: 4px solid #f44336;
          border-radius: 4px;
        }
        .info-box {
          background-color: #f0f0f0;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #D2691E 0%, #DAA520 100%);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Pagamento Não Aprovado</h1>
        </div>
        <div class="content">
          <h2>Olá, ${artistaNome}!</h2>
          
          <p>Informamos que seu pagamento de quota <strong>não foi aprovado</strong> após análise.</p>
          
          <div class="info-box">
            <h3>📋 Detalhes do Pagamento:</h3>
            <p><strong>💰 Valor:</strong> ${parseFloat(valor.toString()).toFixed(2)} Kz</p>
            <p><strong>📅 Mês Referência:</strong> ${new Date(mesReferencia + '-01').toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' })}</p>
          </div>
          
          <div class="warning-box">
            <h3>⚠️ Motivo da Rejeição:</h3>
            <p style="margin: 10px 0 0 0; font-size: 15px;">${motivoRejeicao}</p>
          </div>
          
          <p><strong>📝 Próximos Passos:</strong></p>
          <ul>
            <li>Revise as informações do pagamento</li>
            <li>Corrija os problemas mencionados acima</li>
            <li>Submeta novamente o pagamento através da sua área de artista</li>
          </ul>
          
          <center>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/artist/quota-payments" class="button">Acessar Área de Pagamentos</a>
          </center>
          
          <p style="margin-top: 30px;">Se tiver dúvidas, entre em contato conosco.</p>
          
          <p>Atenciosamente,<br><strong>Equipe Elit-Art</strong></p>
        </div>
        <div class="footer">
          <p>Este é um e-mail automático, por favor não responda.</p>
          <p>&copy; ${new Date().getFullYear()} Elit-Art - Todos os direitos reservados</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
