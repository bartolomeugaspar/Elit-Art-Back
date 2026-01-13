import cron from 'node-cron';
import { sendMonthlyReminders } from './paymentReminderService';

/**
 * Inicializa os cron jobs do sistema
 */
export function initCronJobs() {
  console.log('⏰ Inicializando cron jobs...');

  // Executar DIARIAMENTE do dia 1 ao 15 de cada mês às 09:00
  // Formato: minuto hora dia mês dia-da-semana
  cron.schedule('0 9 1-15 * *', async () => {
    const currentDay = new Date().getDate();
    console.log(`🔔 Executando cron job diário: Lembrete de pagamento (Dia ${currentDay}/15)`);
    try {
      await sendMonthlyReminders();
      console.log('✅ Lembretes enviados com sucesso');
    } catch (error) {
      console.error('❌ Erro no cron job de lembretes:', error);
    }
  }, {
    timezone: "Africa/Luanda"
  });

  console.log('✅ Cron job configurado:');
  console.log('   - Dias 1 a 15 às 09:00: Lembretes diários com contagem regressiva');
  console.log('   - Dia 15: Aviso de suspensão de conta');
  console.log('   - Timezone: Africa/Luanda');
}
