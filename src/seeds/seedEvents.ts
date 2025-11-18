import { supabase } from '../config/database'
import dotenv from 'dotenv'

dotenv.config()

const seedEvents = async () => {
  try {
    console.log('🌱 StArteing events seed...')

    // Get existing users
    const { data: admin } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@elit-Arte.com')
      .single()

    const { data: Arteist1 } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'faustino@elit-Arte.com')
      .single()

    const { data: Arteist2 } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'josemara@elit-Arte.com')
      .single()

    if (!admin || !Arteist1 || !Arteist2) {
      throw new Error('Required users not found. Please run seed:users first.')
    }

    // Delete existing events
    console.log('🗑️  Deleting existing events...')
    await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Create events
    console.log('📝 Creating events...')
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .insert([
        {
          title: 'Workshop de Pintura Moderna',
          description: 'Aprenda técnicas modernas de pintura com nossos Artistas experientes. Todos os níveis são bem-vindos.',
          full_description: 'Neste workshop intensivo, você aprenderá as técnicas mais modernas de pintura com nossos Artistas experientes. Cobriremos desde os fundamentos até técnicas avançadas. Todos os níveis são bem-vindos e o material será fornecido.',
          category: 'Workshop',
          date: '15 de Dezembro, 2024',
          time: '14h',
          location: 'Estúdio Elit\'Arte',
          image: 'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=500&h=300&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=500&h=300&fit=crop',
          ],
          capacity: 30,
          attendees: 24,
          available_spots: 6,
          price: 5000,
          is_free: false,
          bank_details: {
            account_holder: 'Elit Arte Estúdio',
            bank_name: 'BAI',
            account_number: '0001234567890',
            iban: 'AO06000100037131174310147'
          },
          status: 'upcoming',
          organizer_id: Arteist1.id,
        },
        {
          title: 'Exposição de Arte Contemporânea',
          description: 'Venha conhecer as obras mais recentes de nossos Artistas  . Haverá coquetel de abertura.',
          full_description: 'Uma exposição exclusiva apresentando as obras mais recentes de nossos Artistastalentosos. Haverá coquetel de abertura com drinks e aperitivos. Entrada gratuita para membros.',
          category: 'Exposição',
          date: '20 de Dezembro, 2024',
          time: '18:00',
          location: 'Galeria Central',
          image: 'https://images.unsplash.com/photo-1578926078328-123456789012?w=500&h=300&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1578926078328-123456789012?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1578926078328-123456789012?w=500&h=300&fit=crop',
          ],
          capacity: 200,
          attendees: 150,
          available_spots: 50,
          price: 2500,
          is_free: false,
          bank_details: {
            account_holder: 'Galeria Central Luanda',
            bank_name: 'BPC',
            account_number: '0009876543210',
            iban: 'AO06000200037131174310148'
          },
          status: 'upcoming',
          organizer_id: Arteist2.id,
        },
        {
          title: 'Masterclass com Artista Convidado',
          description: 'Sessão especial com Artista internacional renomado. Inscrição obrigatória.',
          full_description: 'Uma oportunidade única de aprender diretamente com um Artista internacional renomado. Esta masterclass é limitada a 40 pArteicipantes. Inscrição obrigatória com antecedência.',
          category: 'Masterclass',
          date: '28 de Dezembro, 2024',
          time: '15:00',
          location: 'Estúdio Elit\'Arte',
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop',
          ],
          capacity: 40,
          attendees: 40,
          available_spots: 0,
          price: 10000,
          is_free: false,
          bank_details: {
            account_holder: 'Elit Arte Masterclass',
            bank_name: 'BAI',
            account_number: '0005555555555',
            iban: 'AO06000100037131174310149'
          },
          status: 'upcoming',
          organizer_id: Arteist1.id,
        },
        {
          title: 'Noite de Networking Artístico',
          description: 'Encontre outros Artistas  , colecionadores e entusiastas de Arte. Networking informal.',
          full_description: 'Uma noite informal para conectar com outros Artistas  , colecionadores e entusiastas de Arte. Haverá drinks, música ao vivo e muito networking. Perfeito para expandir sua rede profissional.',
          category: 'Networking',
          date: '10 de Janeiro, 2025',
          time: '19:00',
          location: 'Espaço Criativo',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
          ],
          capacity: 100,
          attendees: 0,
          available_spots: 100,
          price: 3000,
          is_free: false,
          bank_details: {
            account_holder: 'Espaço Criativo',
            bank_name: 'Banco Angolano de Investimentos',
            account_number: '0007777777777',
            iban: 'AO06000100037131174310150'
          },
          status: 'upcoming',
          organizer_id: admin.id,
        },
        {
          title: 'Workshop de Escultura em Argila',
          description: 'Workshop bem-sucedido com 35 pArteicipantes entusiasmados.',
          full_description: 'Um workshop incrível onde aprendemos técnicas tradicionais de escultura em argila. Todos os materiais foram fornecidos e os pArteicipantes saíram com suas próprias criações.',
          category: 'Workshop',
          date: '10 de Novembro, 2024',
          time: '14:00',
          location: 'Estúdio Elit\'Arte',
          image: 'https://images.unsplash.com/photo-1578926078328-123456789012?w=500&h=300&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1578926078328-123456789012?w=500&h=300&fit=crop',
          ],
          capacity: 35,
          attendees: 35,
          available_spots: 0,
          price: 4500,
          is_free: false,
          bank_details: {
            account_holder: 'Elit Arte Estúdio',
            bank_name: 'BAI',
            account_number: '0001234567890',
            iban: 'AO06000100037131174310147'
          },
          status: 'completed',
          organizer_id: Arteist2.id,
        }
      ])
      .select()

    if (eventsError) throw new Error(`Events creation failed: ${eventsError.message}`)

    console.log('✅ Events seeded successfully!')
    console.log(`🎪 Created ${events?.length || 0} events`)
    console.log('\n📋 Events Created:')
    events?.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} (${event.category})`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding events:', error)
    process.exit(1)
  }
}

seedEvents()
