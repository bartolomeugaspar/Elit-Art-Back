import { supabase } from '../src/config/database';
import { hashPassword } from '../src/models/User';
import { sendEmail, emailCredenciaisArtista } from '../src/config/email';
import dotenv from 'dotenv';

dotenv.config();

interface Artist {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  area: string;
}

interface ConversionResult {
  total: number;
  converted: number;
  skipped: number;
  failed: number;
  details: {
    converted: string[];
    skipped: string[];
    failed: Array<{ email: string; error: string }>;
  };
}

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
 * Verifica se já existe um usuário com o email fornecido
 */
async function userExists(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();
  
  return !!data && !error;
}

/**
 * Cria um usuário a partir de um artista
 */
async function createUserFromArtist(artist: Artist, temporaryPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await hashPassword(temporaryPassword);
    
    const { error } = await supabase
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
    
    if (error) {
      console.error(`❌ Erro ao criar usuário para ${artist.email}:`, error.message);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error(`❌ Erro ao criar usuário para ${artist.email}:`, error.message);
    return false;
  }
}

/**
 * Envia email com credenciais para o artista
 */
async function sendCredentialsEmail(artist: Artist, temporaryPassword: string): Promise<boolean> {
  try {
    const emailHTML = emailCredenciaisArtista(artist.name, artist.email, temporaryPassword);
    
    const result = await sendEmail({
      to: artist.email,
      subject: 'Bem-vindo à Elit-Art - Suas Credenciais de Acesso',
      html: emailHTML
    });
    
    if (result.success) {
      console.log(`  ✅ Email enviado para ${artist.email}`);
      return true;
    } else {
      console.error(`  ❌ Erro ao enviar email para ${artist.email}:`, result.error);
      return false;
    }
  } catch (error: any) {
    console.error(`  ❌ Erro ao enviar email para ${artist.email}:`, error.message);
    return false;
  }
}

/**
 * Script principal para converter artistas em usuários
 */
async function convertArtistsToUsers() {
  console.log('🎨 CONVERSÃO DE ARTISTAS PARA USUÁRIOS\n');
  console.log('=' .repeat(60));
  console.log('\n📋 Iniciando processo de conversão...\n');
  
  const result: ConversionResult = {
    total: 0,
    converted: 0,
    skipped: 0,
    failed: 0,
    details: {
      converted: [],
      skipped: [],
      failed: []
    }
  };
  
  try {
    // 1. Buscar todos os artistas
    console.log('🔍 Buscando artistas na base de dados...\n');
    
    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .select('id, name, email, phone, image, area')
      .order('created_at', { ascending: true });
    
    if (artistsError) {
      console.error('❌ Erro ao buscar artistas:', artistsError);
      return;
    }
    
    if (!artists || artists.length === 0) {
      console.log('⚠️  Nenhum artista encontrado na base de dados.\n');
      return;
    }
    
    result.total = artists.length;
    console.log(`✅ Encontrados ${artists.length} artistas.\n`);
    console.log('=' .repeat(60));
    console.log('\n🔄 Processando artistas...\n');
    
    // 2. Processar cada artista
    for (let i = 0; i < artists.length; i++) {
      const artist = artists[i] as Artist;
      const index = i + 1;
      
      console.log(`\n[${index}/${artists.length}] 👤 ${artist.name} (${artist.email})`);
      
      // Verificar se já existe usuário
      const exists = await userExists(artist.email);
      
      if (exists) {
        console.log(`  ⏭️  Usuário já existe - pulando`);
        result.skipped++;
        result.details.skipped.push(artist.email);
        continue;
      }
      
      // Gerar senha temporária
      const temporaryPassword = generateTemporaryPassword();
      console.log(`  🔑 Senha temporária gerada`);
      
      // Criar usuário
      const userCreated = await createUserFromArtist(artist, temporaryPassword);
      
      if (!userCreated) {
        console.log(`  ❌ Falha ao criar usuário`);
        result.failed++;
        result.details.failed.push({
          email: artist.email,
          error: 'Erro ao criar usuário no banco de dados'
        });
        continue;
      }
      
      console.log(`  ✅ Usuário criado com sucesso`);
      
      // Enviar email com credenciais
      const emailSent = await sendCredentialsEmail(artist, temporaryPassword);
      
      if (emailSent) {
        result.converted++;
        result.details.converted.push(artist.email);
        console.log(`  ✅ Conversão completa!`);
      } else {
        // Mesmo se o email falhar, contamos como convertido pois o usuário foi criado
        result.converted++;
        result.details.converted.push(artist.email);
        console.log(`  ⚠️  Usuário criado, mas email falhou`);
      }
      
      // Pequeno delay para evitar sobrecarga
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 3. Exibir resumo final
    console.log('\n' + '=' .repeat(60));
    console.log('\n📊 RESUMO DA CONVERSÃO\n');
    console.log('=' .repeat(60));
    console.log(`\n📈 Total de artistas processados: ${result.total}`);
    console.log(`✅ Convertidos com sucesso: ${result.converted}`);
    console.log(`⏭️  Pulados (já eram usuários): ${result.skipped}`);
    console.log(`❌ Falhas: ${result.failed}`);
    
    if (result.details.converted.length > 0) {
      console.log('\n✅ Artistas convertidos:');
      result.details.converted.forEach(email => {
        console.log(`   - ${email}`);
      });
    }
    
    if (result.details.skipped.length > 0) {
      console.log('\n⏭️  Artistas pulados (já eram usuários):');
      result.details.skipped.forEach(email => {
        console.log(`   - ${email}`);
      });
    }
    
    if (result.details.failed.length > 0) {
      console.log('\n❌ Falhas:');
      result.details.failed.forEach(item => {
        console.log(`   - ${item.email}: ${item.error}`);
      });
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('\n✨ Processo concluído!\n');
    
  } catch (error: any) {
    console.error('\n❌ Erro fatal durante a conversão:', error.message);
    console.error(error);
  }
}

// Executar o script
convertArtistsToUsers()
  .then(() => {
    console.log('🎉 Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro ao executar script:', error);
    process.exit(1);
  });
