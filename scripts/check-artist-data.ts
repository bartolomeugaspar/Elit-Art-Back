import { supabase } from '../src/config/database';

/**
 * Script to check which artists have data that might exceed column constraints
 */
async function checkArtistData() {
  console.log('🔍 VERIFICAÇÃO DE DADOS DOS ARTISTAS\n');
  console.log('=' .repeat(60));
  
  try {
    const { data: artists, error } = await supabase
      .from('artists')
      .select('id, name, email, phone')
      .order('name');
    
    if (error) {
      console.error('❌ Erro ao buscar artistas:', error);
      return;
    }
    
    if (!artists || artists.length === 0) {
      console.log('⚠️  Nenhum artista encontrado.\n');
      return;
    }
    
    console.log(`\n✅ Encontrados ${artists.length} artistas\n`);
    console.log('=' .repeat(60));
    console.log('\n📊 Análise de Campos:\n');
    
    const issues: Array<{ name: string; email: string; issue: string; value: string }> = [];
    
    artists.forEach((artist) => {
      // Check name length
      if (artist.name && artist.name.length > 100) {
        issues.push({
          name: artist.name,
          email: artist.email,
          issue: `Nome muito longo (${artist.name.length} caracteres)`,
          value: artist.name
        });
      }
      
      // Check phone length (varchar(20) constraint)
      if (artist.phone && artist.phone.length > 20) {
        issues.push({
          name: artist.name,
          email: artist.email,
          issue: `Telefone muito longo (${artist.phone.length} caracteres, max: 20)`,
          value: artist.phone
        });
      }
      
      // Check email length
      if (artist.email && artist.email.length > 255) {
        issues.push({
          name: artist.name,
          email: artist.email,
          issue: `Email muito longo (${artist.email.length} caracteres)`,
          value: artist.email
        });
      }
    });
    
    if (issues.length === 0) {
      console.log('✅ Nenhum problema encontrado! Todos os dados estão dentro dos limites.\n');
    } else {
      console.log(`⚠️  Encontrados ${issues.length} possíveis problemas:\n`);
      
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.name} (${issue.email})`);
        console.log(`   ${issue.issue}`);
        console.log(`   Valor: "${issue.value}"`);
        console.log('');
      });
      
      console.log('\n💡 SOLUÇÕES:\n');
      console.log('1. Para telefones > 20 caracteres:');
      console.log('   Execute o script SQL: scripts/fix-phone-column.sql no Supabase');
      console.log('   Isso aumentará o limite de VARCHAR(20) para VARCHAR(30)\n');
      console.log('2. Para outros campos:');
      console.log('   Verifique e ajuste os limites no banco de dados conforme necessário\n');
    }
    
    console.log('=' .repeat(60));
    
    // Show artists that failed in the conversion
    const failedEmails = [
      'Justinosingorres@gmail.com',
      'mariagoreth93811@gmail.com'
    ];
    
    const failedArtists = artists.filter(a => 
      failedEmails.includes(a.email)
    );
    
    if (failedArtists.length > 0) {
      console.log('\n❌ ARTISTAS QUE FALHARAM NA CONVERSÃO:\n');
      
      failedArtists.forEach((artist) => {
        console.log(`📧 ${artist.name} (${artist.email})`);
        console.log(`   Nome: ${artist.name.length} caracteres`);
        console.log(`   Phone: ${artist.phone ? `"${artist.phone}" (${artist.phone.length} caracteres)` : 'null'}`);
        console.log('');
      });
    }
    
  } catch (error: any) {
    console.error('\n❌ Erro fatal:', error.message);
  }
}

// Run the script
checkArtistData()
  .then(() => {
    console.log('\n✨ Verificação concluída!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro:', error);
    process.exit(1);
  });
