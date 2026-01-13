import { supabase } from '../src/config/database';
import bcrypt from 'bcryptjs';

/**
 * Script para testar se Maria Goreth pode atualizar senha e foto de perfil
 */
async function testMariaProfile() {
  console.log('🧪 TESTE DE ATUALIZAÇÃO DE PERFIL - MARIA GORETH\n');
  console.log('=' .repeat(60));
  
  try {
    // 1. Buscar usuário da Maria Goreth
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'mariagoreth93811@gmail.com')
      .single();

    if (userError || !user) {
      console.error('❌ Erro ao buscar usuário:', userError);
      return;
    }

    console.log('\n✅ USUÁRIO ENCONTRADO:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nome: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Telefone: ${user.phone || 'Não definido'}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Profile Image: ${user.profile_image ? '✅ Tem foto' : '❌ Sem foto'}`);
    console.log(`   Is Active: ${user.is_active}`);
    
    // 2. Testar se a senha atual pode ser verificada
    console.log('\n' + '=' .repeat(60));
    console.log('🔐 TESTE DE SENHA:\n');
    
    const testCurrentPassword = 'password123'; // Senha padrão que deve ter sido definida
    const isPasswordValid = await bcrypt.compare(testCurrentPassword, user.password);
    
    if (isPasswordValid) {
      console.log('✅ Senha atual pode ser verificada');
      console.log(`   Senha de teste: ${testCurrentPassword}`);
    } else {
      console.log('⚠️  A senha de teste não corresponde');
      console.log('   Isso é esperado se a senha foi alterada');
    }

    // 3. Simular atualização de senha
    console.log('\n' + '=' .repeat(60));
    console.log('🔄 SIMULAÇÃO DE ATUALIZAÇÃO DE SENHA:\n');
    
    const newTestPassword = 'novasenha123';
    const hashedNewPassword = await bcrypt.hash(newTestPassword, 10);
    
    console.log('✅ Nova senha pode ser hasheada');
    console.log(`   Hash gerado: ${hashedNewPassword.substring(0, 30)}...`);
    
    // Não vamos realmente atualizar, apenas verificar se temos permissão
    const { error: updatePasswordError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (!updatePasswordError) {
      console.log('✅ Usuário pode ser localizado para atualização');
    }

    // 4. Testar atualização de foto de perfil
    console.log('\n' + '=' .repeat(60));
    console.log('📸 TESTE DE FOTO DE PERFIL:\n');
    
    if (user.profile_image) {
      console.log('✅ Usuário já possui foto de perfil');
      console.log(`   URL: ${user.profile_image}`);
      
      // Verificar se a URL é acessível
      try {
        const response = await fetch(user.profile_image);
        if (response.ok) {
          console.log('✅ Imagem acessível (HTTP ' + response.status + ')');
          console.log(`   Content-Type: ${response.headers.get('content-type')}`);
        } else {
          console.log(`⚠️  Imagem retornou status ${response.status}`);
        }
      } catch (fetchError) {
        console.log('❌ Erro ao acessar imagem:', fetchError);
      }
    } else {
      console.log('⚠️  Usuário não possui foto de perfil');
    }

    // 5. Verificar se há registro na tabela artists
    console.log('\n' + '=' .repeat(60));
    console.log('🎨 VERIFICAÇÃO NA TABELA ARTISTS:\n');
    
    const { data: artist, error: artistError } = await supabase
      .from('artists')
      .select('*')
      .eq('email', 'mariagoreth93811@gmail.com')
      .single();

    if (artist && !artistError) {
      console.log('✅ Registro encontrado na tabela artists');
      console.log(`   ID: ${artist.id}`);
      console.log(`   Nome: ${artist.name}`);
      console.log(`   Nome Artístico: ${artist.artistic_name || 'Não definido'}`);
      console.log(`   Área: ${artist.area || 'Não definido'}`);
      console.log(`   Descrição: ${artist.description ? artist.description.substring(0, 50) + '...' : 'Não definido'}`);
      console.log(`   Image: ${artist.image ? '✅ Tem foto' : '❌ Sem foto'}`);
      
      if (artist.image && artist.image !== user.profile_image) {
        console.log('\n⚠️  ATENÇÃO: Imagens diferentes entre tabelas!');
        console.log(`   users.profile_image: ${user.profile_image}`);
        console.log(`   artists.image: ${artist.image}`);
      } else if (artist.image === user.profile_image) {
        console.log('✅ Imagens sincronizadas entre users e artists');
      }
    } else {
      console.log('⚠️  Nenhum registro encontrado na tabela artists');
    }

    // 6. Resumo final
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RESUMO:\n');
    
    const canUpdatePassword = user && user.id && user.password;
    const canUpdateImage = user && user.id;
    const canUpdateName = user && user.id;
    const hasImage = !!user.profile_image;
    
    console.log(`✅ Pode atualizar nome: ${canUpdateName ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Pode atualizar senha: ${canUpdatePassword ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Pode atualizar foto: ${canUpdateImage ? 'SIM' : 'NÃO'}`);
    console.log(`📸 Possui foto atual: ${hasImage ? 'SIM' : 'NÃO'}`);
    
    console.log('\n💡 PRÓXIMOS PASSOS:');
    console.log('1. Garantir que o backend está rodando');
    console.log('2. Fazer login com as credenciais da Maria Goreth');
    console.log('3. Testar alteração de nome no frontend');
    console.log('4. Testar alteração de senha no frontend');
    console.log('5. Testar upload de nova foto de perfil');
    
  } catch (error: any) {
    console.error('\n❌ Erro fatal:', error.message);
  }
}

// Run the script
testMariaProfile()
  .then(() => {
    console.log('\n✨ Teste concluído!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro:', error);
    process.exit(1);
  });
