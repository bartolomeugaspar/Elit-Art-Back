import { supabase } from '../src/config/database';
import { hashPassword } from '../src/models/User';
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
  
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
  password += numberChars[Math.floor(Math.random() * numberChars.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Artistas que falharam na conversão anterior
 */
const failedArtists = [
  'Justinosingorres@gmail.com',
  'mariagoreth93811@gmail.com'
];

/**
 * Tenta novamente converter os artistas que falharam
 */
async function retryFailedConversions() {
  console.log('🔄 RETENTAR CONVERSÕES FALHADAS\n');
  console.log('=' .repeat(60));
  console.log(`\n📋 Processando ${failedArtists.length} artistas que falharam anteriormente...\n`);
  
  let converted = 0;
  let failed = 0;
  
  for (let i = 0; i < failedArtists.length; i++) {
    const email = failedArtists[i];
    const index = i + 1;
    
    console.log(`\n[${index}/${failedArtists.length}] 📧 ${email}`);
    
    try {
      // Buscar dados do artista
      const { data: artist, error: artistError } = await supabase
        .from('artists')
        .select('id, name, email, phone, image, area')
        .eq('email', email)
        .single();
      
      if (artistError || !artist) {
        console.log(`  ❌ Artista não encontrado na tabela artists`);
        failed++;
        continue;
      }
      
      console.log(`  👤 ${artist.name}`);
      console.log(`  📱 Phone: ${artist.phone}`);
      
      // Verificar se já existe usuário
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (existingUser) {
        console.log(`  ⚠️  Usuário já existe - pulando criação`);
        console.log(`  📧 Tentando reenviar email...`);
        
        const newPassword = generateTemporaryPassword();
        const emailHTML = emailCredenciaisArtista(artist.name, artist.email, newPassword);
        
        const result = await sendEmail({
          to: artist.email,
          subject: 'Bem-vindo à Elit-Art - Suas Credenciais de Acesso',
          html: emailHTML
        });
        
        if (result.success) {
          console.log(`  ✅ Email enviado com sucesso`);
          console.log(`  📝 Senha temporária: ${newPassword}`);
          converted++;
        } else {
          console.log(`  ❌ Erro ao enviar email: ${result.error}`);
          failed++;
        }
        continue;
      }
      
      // Criar usuário
      const temporaryPassword = generateTemporaryPassword();
      console.log(`  🔑 Senha temporária gerada`);
      
      const hashedPassword = await hashPassword(temporaryPassword);
      
      const { error: createError } = await supabase
        .from('users')
        .insert({
          name: artist.name,
          email: artist.email,
          password: hashedPassword,
          phone: artist.phone || null,
          profile_image: artist.image || null,
          role: 'artista',
          is_email_verified: false,
          is_active: true,
        });
      
      if (createError) {
        console.log(`  ❌ Erro ao criar usuário: ${createError.message}`);
        failed++;
        continue;
      }
      
      console.log(`  ✅ Usuário criado com sucesso`);
      
      // Enviar email
      const emailHTML = emailCredenciaisArtista(artist.name, artist.email, temporaryPassword);
      
      const result = await sendEmail({
        to: artist.email,
        subject: 'Bem-vindo à Elit-Art - Suas Credenciais de Acesso',
        html: emailHTML
      });
      
      if (result.success) {
        console.log(`  ✅ Email enviado com sucesso`);
        console.log(`  📝 Senha temporária: ${temporaryPassword}`);
        converted++;
      } else {
        console.log(`  ⚠️  Usuário criado, mas email falhou: ${result.error}`);
        console.log(`  📝 Senha temporária: ${temporaryPassword}`);
        converted++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error: any) {
      console.log(`  ❌ Erro: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('\n📊 RESUMO\n');
  console.log('=' .repeat(60));
  console.log(`\n✅ Convertidos: ${converted}`);
  console.log(`❌ Falhas: ${failed}`);
  console.log(`📈 Total processado: ${converted + failed}\n`);
  console.log('=' .repeat(60));
  console.log('\n✨ Processo concluído!\n');
}

// Executar o script
retryFailedConversions()
  .then(() => {
    console.log('🎉 Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro:', error);
    process.exit(1);
  });
