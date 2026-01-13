import dotenv from 'dotenv';
import { supabase } from '../src/config/database';
import { sendEmail, emailAvisoPagamentoCota } from '../src/config/email';

dotenv.config();

interface SendReminderOptions {
  mes_referencia?: string;
  valor_cota?: number;
  data_limite?: string;
}

/**
 * Script para enviar aviso de pagamento de cota para todos os artistas
 * Uso: ts-node scripts/send-quota-reminder.ts
 */
async function sendQuotaReminderToAllArtists(options?: SendReminderOptions) {
  try {
    console.log('🚀 Iniciando envio de avisos de pagamento de cota...\n');

    // Configurações padrão
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    
    const mes_referencia = options?.mes_referencia || `${currentYear}-${currentMonth}`;
    const valor_cota = options?.valor_cota || 5000; // Valor padrão em Kz
    const data_limite = options?.data_limite;

    console.log('📋 Configurações:');
    console.log(`   Mês de Referência: ${mes_referencia}`);
    console.log(`   Valor da Cota: ${valor_cota.toFixed(2)} Kz`);
    if (data_limite) {
      console.log(`   Data Limite: ${data_limite}`);
    }
    console.log('');

    // Buscar todos os artistas
    console.log('🔍 Buscando artistas...');
    const { data: artists, error: artistsError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('role', 'artist');

    if (artistsError) {
      console.error('❌ Erro ao buscar artistas:', artistsError);
      process.exit(1);
    }

    if (!artists || artists.length === 0) {
      console.log('⚠️  Nenhum artista encontrado.');
      process.exit(0);
    }

    console.log(`✅ ${artists.length} artistas encontrados.\n`);

    // Verificar quais artistas já pagaram este mês
    console.log('🔍 Verificando pagamentos existentes...');
    const { data: paidPayments, error: paymentsError } = await supabase
      .from('artist_quota_payments')
      .select('artist_id, status')
      .eq('mes_referencia', mes_referencia)
      .in('status', ['aprovado', 'pendente']);

    if (paymentsError) {
      console.error('⚠️  Erro ao buscar pagamentos (continuando mesmo assim):', paymentsError);
    }

    const paidArtistIds = new Set(paidPayments?.map(p => p.artist_id) || []);
    console.log(`✅ ${paidArtistIds.size} artistas já pagaram ou têm pagamento pendente.\n`);

    // Filtrar apenas artistas que ainda não pagaram
    const artistsToPay = artists.filter(artist => !paidArtistIds.has(artist.id));

    if (artistsToPay.length === 0) {
      console.log('🎉 Todos os artistas já efetuaram o pagamento deste mês!');
      console.log(`   Total de artistas: ${artists.length}`);
      console.log(`   Já pagaram: ${paidArtistIds.size}`);
      process.exit(0);
    }

    console.log(`📧 Enviando emails para ${artistsToPay.length} artistas...\n`);

    // Enviar email para cada artista que ainda não pagou
    const emailResults = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ artist: string; email: string; error: string }>
    };

    for (let i = 0; i < artistsToPay.length; i++) {
      const artist = artistsToPay[i];
      const progress = `[${i + 1}/${artistsToPay.length}]`;
      
      try {
        console.log(`${progress} Enviando para: ${artist.name || artist.email} (${artist.email})...`);
        
        const result = await sendEmail({
          to: artist.email,
          subject: `💳 Aviso: Pagamento de Quota - ${new Date(mes_referencia + '-01').toLocaleDateString('pt-PT', { year: 'numeric', month: 'long' })}`,
          html: emailAvisoPagamentoCota(
            artist.name || artist.email,
            mes_referencia,
            valor_cota,
            data_limite
          )
        });

        if (result.success) {
          emailResults.success++;
          console.log(`   ✅ Email enviado com sucesso!`);
        } else {
          emailResults.failed++;
          emailResults.errors.push({
            artist: artist.name || 'Sem nome',
            email: artist.email,
            error: result.error || 'Erro desconhecido'
          });
          console.log(`   ❌ Falha ao enviar: ${result.error}`);
        }

        // Pequeno delay entre envios para não sobrecarregar o servidor SMTP
        if (i < artistsToPay.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (emailError: any) {
        emailResults.failed++;
        emailResults.errors.push({
          artist: artist.name || 'Sem nome',
          email: artist.email,
          error: emailError.message
        });
        console.log(`   ❌ Erro ao enviar: ${emailError.message}`);
      }
    }

    // Resumo final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DO ENVIO');
    console.log('='.repeat(60));
    console.log(`Total de artistas: ${artists.length}`);
    console.log(`Já pagaram/pendente: ${paidArtistIds.size}`);
    console.log(`Emails enviados: ${emailResults.success} ✅`);
    console.log(`Falhas: ${emailResults.failed} ❌`);
    console.log('='.repeat(60));

    if (emailResults.errors.length > 0) {
      console.log('\n❌ Erros encontrados:');
      emailResults.errors.forEach((err, idx) => {
        console.log(`   ${idx + 1}. ${err.artist} (${err.email})`);
        console.log(`      Erro: ${err.error}`);
      });
    }

    console.log('\n✅ Script finalizado com sucesso!');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erro fatal ao executar script:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Executar o script
const args = process.argv.slice(2);
const options: SendReminderOptions = {};

// Processar argumentos da linha de comando
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--mes' && args[i + 1]) {
    options.mes_referencia = args[i + 1];
    i++;
  } else if (args[i] === '--valor' && args[i + 1]) {
    options.valor_cota = parseFloat(args[i + 1]);
    i++;
  } else if (args[i] === '--limite' && args[i + 1]) {
    options.data_limite = args[i + 1];
    i++;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
📧 Script de Envio de Aviso de Pagamento de Cota

Uso:
  npm run send-quota-reminder [opções]
  ou
  ts-node scripts/send-quota-reminder.ts [opções]

Opções:
  --mes <YYYY-MM>        Mês de referência (padrão: mês atual)
  --valor <número>       Valor da cota em Kz (padrão: 5000)
  --limite <YYYY-MM-DD>  Data limite para pagamento (opcional)
  --help, -h             Mostra esta mensagem

Exemplos:
  npm run send-quota-reminder
  npm run send-quota-reminder -- --mes 2026-01 --valor 6000
  npm run send-quota-reminder -- --mes 2026-02 --valor 5000 --limite 2026-02-28
    `);
    process.exit(0);
  }
}

sendQuotaReminderToAllArtists(options);
