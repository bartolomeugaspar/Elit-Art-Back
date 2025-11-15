import { supabase } from '../config/database'
import dotenv from 'dotenv'

dotenv.config()

const seedEvents = async () => {
  try {
    console.log('🌱 Starting events seed...')

    // Get existing users
    const { data: admin } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@elit-arte.com')
      .single()

    const { data: artist1 } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'faustino@elit-arte.com')
      .single()

    const { data: artist2 } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'josemara@elit-arte.com')
      .single()

    if (!admin || !artist1 || !artist2) {
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
          description: 'Aprenda técnicas modernas de pintura com nossos artistas experientes. Todos os níveis são bem-vindos.',
          full_description: 'Neste workshop intensivo, você aprenderá as técnicas mais modernas de pintura com nossos artistas experientes. Cobriremos desde os fundamentos até técnicas avançadas. Todos os níveis são bem-vindos e o material será fornecido.',
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
          price: 0,
          is_free: true,
          status: 'upcoming',
          organizer_id: artist1.id,
        },
        {
          title: 'Exposição de Arte Contemporânea',
          description: 'Venha conhecer as obras mais recentes de nossos artistas. Haverá coquetel de abertura.',
          full_description: 'Uma exposição exclusiva apresentando as obras mais recentes de nossos artistas talentosos. Haverá coquetel de abertura com drinks e aperitivos. Entrada gratuita para membros.',
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
          price: 0,
          is_free: true,
          status: 'upcoming',
          organizer_id: artist2.id,
        },
        {
          title: 'Masterclass com Artista Convidado',
          description: 'Sessão especial com artista internacional renomado. Inscrição obrigatória.',
          full_description: 'Uma oportunidade única de aprender diretamente com um artista internacional renomado. Esta masterclass é limitada a 40 participantes. Inscrição obrigatória com antecedência.',
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
          price: 0,
          is_free: true,
          status: 'upcoming',
          organizer_id: artist1.id,
        },
        {
          title: 'Noite de Networking Artístico',
          description: 'Encontre outros artistas, colecionadores e entusiastas de arte. Networking informal.',
          full_description: 'Uma noite informal para conectar com outros artistas, colecionadores e entusiastas de arte. Haverá drinks, música ao vivo e muito networking. Perfeito para expandir sua rede profissional.',
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
          price: 0,
          is_free: true,
          status: 'upcoming',
          organizer_id: admin.id,
        },
        {
          title: 'Workshop de Escultura em Argila',
          description: 'Workshop bem-sucedido com 35 participantes entusiasmados.',
          full_description: 'Um workshop incrível onde aprendemos técnicas tradicionais de escultura em argila. Todos os materiais foram fornecidos e os participantes saíram com suas próprias criações.',
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
          price: 0,
          is_free: true,
          status: 'completed',
          organizer_id: artist2.id,
        },
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
