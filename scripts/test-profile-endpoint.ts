import { supabase } from '../src/config/database';

/**
 * Script para simular o que o endpoint /artists/profile/:id retorna
 */
async function testProfileEndpoint() {
  console.log('🧪 TESTE DO ENDPOINT DE PERFIL\n');
  console.log('=' .repeat(60));
  
  try {
    const email = 'mariagoreth93811@gmail.com';
    
    // 1. Buscar dados do usuário (como o controller faz)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      console.error('❌ Erro ao buscar usuário:', error);
      return;
    }

    console.log('\n📊 DADOS DA TABELA USERS:\n');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nome: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Telefone: ${user.phone || 'null'}`);
    console.log(`   Profile Image: ${user.profile_image || 'null'}`);
    console.log(`   Role: ${user.role}`);

    // 2. Buscar dados adicionais da tabela artists
    const { data: artistData } = await supabase
      .from('artists')
      .select('artistic_name, area, description')
      .eq('email', user.email)
      .single();

    console.log('\n🎨 DADOS DA TABELA ARTISTS:\n');
    if (artistData) {
      console.log(`   Nome Artístico: ${artistData.artistic_name || 'vazio'}`);
      console.log(`   Área: ${artistData.area || 'vazio'}`);
      console.log(`   Descrição: ${artistData.description ? artistData.description.substring(0, 60) + '...' : 'vazio'}`);
    } else {
      console.log('   Nenhum dado encontrado');
    }

    // 3. Montar resposta como o controller faz
    const response = {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.profile_image || user.image,
        profile_image: user.profile_image || user.image,
        phone: user.phone || '',
        artisticName: artistData?.artistic_name || '',
        area: artistData?.area || '',
        description: artistData?.description || '',
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    };

    console.log('\n' + '=' .repeat(60));
    console.log('📤 RESPOSTA DO ENDPOINT:\n');
    console.log(JSON.stringify(response, null, 2));

    console.log('\n' + '=' .repeat(60));
    console.log('✅ CAMPOS VALIDADOS:\n');
    console.log(`   ✅ Nome: ${response.data.name ? 'OK' : 'FALTANDO'}`);
    console.log(`   ✅ Email: ${response.data.email ? 'OK' : 'FALTANDO'}`);
    console.log(`   ✅ Telefone: ${response.data.phone ? 'OK (' + response.data.phone + ')' : 'VAZIO'}`);
    console.log(`   ✅ Foto: ${response.data.profile_image ? 'OK' : 'FALTANDO'}`);
    console.log(`   ✅ Nome Artístico: ${response.data.artisticName ? 'OK (' + response.data.artisticName + ')' : 'VAZIO (esperado para Maria)'}`);
    console.log(`   ✅ Área: ${response.data.area ? 'OK (' + response.data.area + ')' : 'VAZIO'}`);
    console.log(`   ✅ Descrição: ${response.data.description ? 'OK' : 'VAZIO'}`);

  } catch (error: any) {
    console.error('\n❌ Erro fatal:', error.message);
  }
}

// Run the script
testProfileEndpoint()
  .then(() => {
    console.log('\n✨ Teste concluído!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro:', error);
    process.exit(1);
  });
