import { supabase } from '../src/config/database';
import { sendEmail, emailCredenciaisArtista } from '../src/config/email';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Gera uma senha aleatória segura
 */
function generateTemporaryPassword(length: number = 12): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%&*';
  
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  
  let password = '';
  
  // Garantir pelo menos 1 de cada tipo
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
  password += numberChars[Math.floor(Math.random() * numberChars.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
  // Preencher o restante aleatoriamente
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Embaralhar a senha
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Lista de emails dos usuários que foram criados mas não receberam email
 */
const emailsToResend = [
  'mariagoreth93811@gmail.com',
  'Justinosingorres@gmail.com',
  'veramiguelita@gmail.com',
  'mariannafeitio0@gmail.com',
  'deliano053@gmail.com',
  'albertinajoaquim380@gmail.com',
  'Oyonorodolfo@gmail.com',
  'edmir.w.s.silva@gmail.com',
  'jessedenatanaelcassange@gmail.com',
  'stelviobungo7@gmail.com',
  'maraperesfunhica@gmail.com',
  'djamiladagraca593@gmail.com',
  'priscilabendinhaalmeida@gmail.com',
  'ineskambatenda@gmail.com',
  'kiessebalo@gmail.com',
  'Jcuzanzuca@gmail.com',
  'mairisdejesus.mj@gmail.com',
  'faustinodomingos83@hotmail.com',
  'luisacarolina@gamil.com',
  'damanuelvetebarrosom@gmail.com',
  'ceciliajosecanjamba@gmail.com'
];

/**
 * Reenvia email com credenciais para usuários
 */
async function resendWelcomeEmails() {
  console.log('📧 REENVIO DE EMAILS DE BOAS-VINDAS\n');
  console.log('=' .repeat(60));
  console.log(`\n📋 Reenviando emails para ${emailsToResend.length} usuários...\n`);
  
  let sent = 0;
  let failed = 0;
  
  for (let i = 0; i < emailsToResend.length; i++) {
    const email = emailsToResend[i];
    const index = i + 1;
    
    console.log(`\n[${index}/${emailsToResend.length}] 📧 ${email}`);
    
    try {
      // Buscar dados do usuário
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('name, email')
        .eq('email', email)
        .single();
      
      if (userError || !user) {
        console.log(`  ❌ Usuário não encontrado`);
        failed++;
        continue;
      }
      
      // Gerar nova senha temporária
      const newPassword = generateTemporaryPassword();
      
      console.log(`  🔑 Nova senha temporária gerada`);
      
      // Enviar email
      const emailHTML = emailCredenciaisArtista(user.name, user.email, newPassword);
      
      const result = await sendEmail({
        to: user.email,
        subject: 'Bem-vindo à Elit-Art - Suas Credenciais de Acesso',
        html: emailHTML
      });
      
      if (result.success) {
        console.log(`  ✅ Email enviado com sucesso`);
        console.log(`  📝 IMPORTANTE: Senha temporária: ${newPassword}`);
        sent++;
      } else {
        console.log(`  ❌ Erro ao enviar email: ${result.error}`);
        failed++;
      }
      
      // Pequeno delay para evitar spam
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error: any) {
      console.log(`  ❌ Erro: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('\n📊 RESUMO\n');
  console.log('=' .repeat(60));
  console.log(`\n✅ Emails enviados: ${sent}`);
  console.log(`❌ Falhas: ${failed}`);
  console.log(`📈 Total processado: ${sent + failed}\n`);
  console.log('=' .repeat(60));
  console.log('\n⚠️  ATENÇÃO: Anote as senhas temporárias acima!\n');
}

// Executar o script
resendWelcomeEmails()
  .then(() => {
    console.log('🎉 Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro:', error);
    process.exit(1);
  });
