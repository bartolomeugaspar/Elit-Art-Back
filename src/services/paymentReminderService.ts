import { sendEmail } from '../config/email';
import { supabase } from '../config/database';

/**
 * Verifica quais artistas ainda não pagaram a quota do mês atual
 */
async function getArtistsWithoutPayment() {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();
    
    // Calcular o mês anterior (quota que deve ser paga até dia 15 do mês atual)
    let quotaMonth = currentMonth - 1;
    let quotaYear = currentYear;
    
    // Se estamos em janeiro, a quota é de dezembro do ano anterior
    if (quotaMonth === 0) {
      quotaMonth = 12;
      quotaYear = currentYear - 1;
    }

    // Formatar como YYYY-MM
    const mesReferencia = `${quotaYear}-${String(quotaMonth).padStart(2, '0')}`;

    // Buscar todos os usuários com role 'artist' que estão ativos
    const { data: artists, error: artistsError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('role', 'artist')
      .eq('ativo', true);

    if (artistsError) throw artistsError;

    if (!artists || artists.length === 0) {
      console.log('Nenhum artista ativo encontrado');
      return [];
    }

    // Para cada artista, verificar se já pagou a quota do mês de referência
    const artistsWithoutPayment = [];

    for (const artist of artists) {
      const { data: payments, error: paymentsError } = await supabase
        .from('artist_quota_payments')
        .select('id, status, mes_referencia')
        .eq('artist_id', artist.id)
        .eq('mes_referencia', mesReferencia)
        .in('status', ['pendente', 'aprovado']);

      // Se não tem nenhum pagamento (pendente ou aprovado) para o mês de referência
      if (!paymentsError && (!payments || payments.length === 0)) {
        artistsWithoutPayment.push({
          id: artist.id,
          email: artist.email,
          name: artist.name || artist.email
        });
      }
    }

    return artistsWithoutPayment;
  } catch (error) {
    console.error('Erro ao buscar artistas sem pagamento:', error);
    throw error;
  }
}

/**
 * Envia lembrete de pagamento para um artista com contagem regressiva
 */
async function sendPaymentReminder(artist: { id: string; email: string; name: string }) {
  try {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.toLocaleString('pt-PT', { month: 'long' });
    const currentYear = now.getFullYear();
    const daysRemaining = 15 - currentDay;
    
    let emailHtml = '';
    let subject = '';
    
    // Dia 15 ou depois - Aviso de suspensão
    if (currentDay >= 15) {
      subject = `🚨 URGENTE: Sua conta será suspensa - Elit-Art`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .danger { background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .info-box { background: white; border-left: 4px solid #D2691E; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 PRAZO ESGOTADO</h1>
            </div>
            <div class="content">
              <p>Olá, <strong>${artist.name}</strong>!</p>
              
              <div class="danger">
                <h2 style="margin-top: 0; color: #dc2626;">⚠️ ATENÇÃO: SUA CONTA SERÁ SUSPENSA</h2>
                <p style="font-size: 16px; margin: 15px 0;">
                  O prazo para pagamento da quota de <strong>${currentMonth} de ${currentYear}</strong> expirou no dia <strong>15 de ${currentMonth}</strong>.
                </p>
                <p style="font-size: 16px; margin: 15px 0;">
                  <strong>Sua conta será suspensa pelo administrador até a regularização do pagamento.</strong>
                </p>
              </div>
              
              <div class="info-box">
                <h3>🔒 Consequências da Suspensão:</h3>
                <ul>
                  <li>Acesso à plataforma bloqueado</li>
                  <li>Impossibilidade de participar em atividades</li>
                  <li>Perda de benefícios de artista ativo</li>
                </ul>
              </div>
              
              <div class="info-box">
                <h3>✅ Como Regularizar:</h3>
                <ol>
                  <li>Acesse a plataforma <strong>AGORA</strong></li>
                  <li>Vá para "Pagamentos de Quota"</li>
                  <li>Faça a transferência bancária</li>
                  <li>Envie o comprovante imediatamente</li>
                </ol>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/artist/quota-payments" class="button">
                  🚨 REGULARIZAR PAGAMENTO AGORA
                </a>
              </div>
              
              <p style="color: #dc2626; font-weight: bold; text-align: center; margin-top: 30px;">
                Aja imediatamente para evitar a suspensão!
              </p>
              
              <div class="footer">
                <p><strong>Equipe Elit-Art</strong> 🎨</p>
                <p><em>Arte com Excelência</em></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    } 
    // Dia 14 - Último dia
    else if (currentDay === 14) {
      subject = `⚠️ ÚLTIMO DIA: Quota de ${currentMonth} - Elit-Art`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .urgent { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .info-box { background: white; border-left: 4px solid #D2691E; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .countdown { font-size: 72px; color: #f59e0b; font-weight: bold; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ ÚLTIMO DIA!</h1>
            </div>
            <div class="content">
              <p>Olá, <strong>${artist.name}</strong>!</p>
              
              <div class="countdown">1 DIA</div>
              
              <div class="urgent">
                <h2 style="margin-top: 0; color: #f59e0b;">⏰ AMANHÃ É O ÚLTIMO DIA!</h2>
                <p style="font-size: 16px;">
                  A quota de <strong>${currentMonth} de ${currentYear}</strong> vence <strong>AMANHÃ (dia 15)</strong>.
                </p>
                <p style="font-size: 16px; color: #dc2626; font-weight: bold;">
                  Após esta data, sua conta será suspensa pelo administrador!
                </p>
              </div>
              
              <div class="info-box">
                <h3>🚨 Ação Imediata Necessária:</h3>
                <p>Faça o pagamento <strong>HOJE</strong> para evitar a suspensão da sua conta!</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/artist/quota-payments" class="button">
                  💳 PAGAR AGORA
                </a>
              </div>
              
              <div class="footer">
                <p><strong>Equipe Elit-Art</strong> 🎨</p>
                <p><em>Arte com Excelência</em></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    }
    // Dias 1 a 13 - Contagem regressiva
    else {
      subject = `🔔 ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'} para o prazo - Quota de ${currentMonth}`;
      
      let urgencyColor = '#D2691E';
      let urgencyBg = '#eff6ff';
      if (daysRemaining <= 3) {
        urgencyColor = '#dc2626';
        urgencyBg = '#fee2e2';
      } else if (daysRemaining <= 7) {
        urgencyColor = '#f59e0b';
        urgencyBg = '#fef3c7';
      }
      
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D2691E 0%, #DAA520 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: ${urgencyColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .info-box { background: white; border-left: 4px solid #D2691E; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .warning { background: ${urgencyBg}; border-left: 4px solid ${urgencyColor}; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .countdown { font-size: 72px; color: ${urgencyColor}; font-weight: bold; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Lembrete de Pagamento de Quota</h1>
            </div>
            <div class="content">
              <p>Olá, <strong>${artist.name}</strong>!</p>
              
              <div class="countdown">${daysRemaining} ${daysRemaining === 1 ? 'DIA' : 'DIAS'}</div>
              
              <div class="warning">
                <p style="font-size: 18px; margin: 0; text-align: center;">
                  <strong>Faltam ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'} para o prazo de pagamento!</strong>
                </p>
                <p style="text-align: center; margin-top: 10px;">
                  Quota de <strong>${currentMonth} de ${currentYear}</strong>
                </p>
                <p style="text-align: center; font-size: 16px; margin-top: 15px; color: ${urgencyColor};">
                  ⏰ Prazo: <strong>15 de ${currentMonth}</strong>
                </p>
              </div>
              
              ${daysRemaining <= 7 ? `
              <div class="info-box" style="border-left-color: #dc2626; background: #fee2e2;">
                <p style="margin: 0; color: #dc2626; font-weight: bold;">
                  ⚠️ ATENÇÃO: Após o dia 15, sua conta será suspensa pelo administrador!
                </p>
              </div>
              ` : ''}
              
              <div class="info-box">
                <h3>📋 Como fazer o pagamento:</h3>
                <ol>
                  <li>Acesse a plataforma Elit-Art</li>
                  <li>Vá para a página de "Pagamentos de Quota"</li>
                  <li>Clique em "Fazer Pagamento"</li>
                  <li>As coordenadas bancárias aparecerão automaticamente</li>
                  <li>Após a transferência, envie o comprovante</li>
                </ol>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/artist/quota-payments" class="button">
                  💳 Fazer Pagamento Agora
                </a>
              </div>
              
              <div class="info-box">
                <p><strong>💡 Dica:</strong> Após enviar o comprovante, você receberá notificações por email sobre o status da aprovação.</p>
              </div>
              
              <p>Se você já efetuou o pagamento, por favor ignore esta mensagem.</p>
              
              <div class="footer">
                <p><strong>Equipe Elit-Art</strong> 🎨</p>
                <p><em>Arte com Excelência</em></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    await sendEmail({
      to: artist.email,
      subject: subject,
      html: emailHtml
    });

    console.log(`✅ Lembrete enviado para: ${artist.email} (${daysRemaining} dias restantes)`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao enviar lembrete para ${artist.email}:`, error);
    return false;
  }
}

/**
 * Envia lembretes para todos os artistas que não pagaram
 */
export async function sendMonthlyReminders() {
  try {
    console.log('🔄 Iniciando envio de lembretes mensais...');
    
    const artistsWithoutPayment = await getArtistsWithoutPayment();
    
    if (artistsWithoutPayment.length === 0) {
      console.log('✅ Todos os artistas já pagaram este mês!');
      return { success: true, sent: 0 };
    }

    console.log(`📧 Enviando lembretes para ${artistsWithoutPayment.length} artistas...`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const artist of artistsWithoutPayment) {
      const sent = await sendPaymentReminder(artist);
      if (sent) {
        successCount++;
      } else {
        errorCount++;
      }
      
      // Delay para não sobrecarregar o servidor de email
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`✅ Lembretes enviados: ${successCount}`);
    console.log(`❌ Erros: ${errorCount}`);

    return { success: true, sent: successCount, errors: errorCount };
  } catch (error) {
    console.error('❌ Erro ao enviar lembretes mensais:', error);
    throw error;
  }
}

/**
 * Envia lembrete para um artista específico
 */
export async function sendReminderToArtist(artistId: string) {
  try {
    const { data: artist, error } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('id', artistId)
      .eq('role', 'artist')
      .single();

    if (error) throw error;

    return await sendPaymentReminder({
      id: artist.id,
      email: artist.email,
      name: artist.name || artist.email
    });
  } catch (error) {
    console.error('Erro ao enviar lembrete para artista:', error);
    throw error;
  }
}

/**
 * Retorna lista de artistas que não pagaram
 */
export { getArtistsWithoutPayment };
