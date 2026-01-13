import { supabase } from '../src/config/database';
import dotenv from 'dotenv';

dotenv.config();

async function checkArtists() {
  try {
    console.log('🔍 Verificando usuários na base de dados...\n');
    
    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('⚠️  Nenhum usuário encontrado na base de dados');
      return;
    }
    
    console.log(`📊 Total de usuários: ${users.length}\n`);
    
    // Group by role
    const byRole: Record<string, any[]> = {};
    users.forEach(user => {
      const role = user.role || 'undefined';
      if (!byRole[role]) byRole[role] = [];
      byRole[role].push(user);
    });
    
    // Display statistics
    console.log('📈 Estatísticas por role:');
    Object.keys(byRole).forEach(role => {
      console.log(`  ${role}: ${byRole[role].length}`);
    });
    console.log('');
    
    // Show artists
    if (byRole['artista']) {
      console.log('🎨 Usuários com role "artista":');
      byRole['artista'].forEach(user => {
        console.log(`  - ${user.name} (${user.email}) [ID: ${user.id}]`);
      });
      console.log('');
    } else {
      console.log('⚠️  Nenhum usuário encontrado com role "artista"');
      console.log('');
    }
    
    // Show all users
    console.log('👥 Todos os usuários:');
    console.table(users.map(u => ({
      Nome: u.name,
      Email: u.email,
      Role: u.role,
      ID: u.id.substring(0, 8) + '...'
    })));
    
    // Check artists table
    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .select('id, name, email')
      .order('created_at', { ascending: false });
    
    if (artistsError) {
      console.error('\n❌ Erro ao buscar artistas:', artistsError);
    } else if (artists && artists.length > 0) {
      console.log(`\n🎨 Total de registros na tabela artists: ${artists.length}`);
      console.table(artists.map(a => ({
        Nome: a.name,
        Email: a.email,
        ID: a.id.substring(0, 8) + '...'
      })));
    } else {
      console.log('\n⚠️  Nenhum registro encontrado na tabela artists');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

checkArtists();
