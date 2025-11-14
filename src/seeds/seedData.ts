import { supabase } from '../config/database'
import { hashPassword } from '../models/User'
import dotenv from 'dotenv'

dotenv.config()

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...')

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await supabase.from('newsletter').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    // await supabase.from('registrations').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    // await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    // await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Create admin user
    const adminPassword = await hashPassword('admin123')
    const { data: admin, error: adminError } = await supabase
      .from('users')
      .insert({
        name: 'Admin Elit',
        email: 'admin@elit-arte.com',
        password: adminPassword,
        role: 'admin',
        is_email_verified: true,
      })
      .select()
      .single()

    if (adminError) throw new Error(`Admin creation failed: ${adminError.message}`)

    // Create artist users
    const artist1Password = await hashPassword('artist123')
    const { data: artist1, error: artist1Error } = await supabase
      .from('users')
      .insert({
        name: 'Faustino Domingos',
        email: 'faustino@elit-arte.com',
        password: artist1Password,
        role: 'artist',
        bio: 'Fundador e Diretor Geral do Elit\'Arte',
        is_email_verified: true,
      })
      .select()
      .single()

    if (artist1Error) throw new Error(`Artist 1 creation failed: ${artist1Error.message}`)

    const artist2Password = await hashPassword('artist123')
    const { data: artist2, error: artist2Error } = await supabase
      .from('users')
      .insert({
        name: 'Josemara Comongo',
        email: 'josemara@elit-arte.com',
        password: artist2Password,
        role: 'artist',
        bio: 'Co-fundadora do Elit\'Arte',
        is_email_verified: true,
      })
      .select()
      .single()

    if (artist2Error) throw new Error(`Artist 2 creation failed: ${artist2Error.message}`)

    // Create regular users
    const user1Password = await hashPassword('user123')
    const { data: user1, error: user1Error } = await supabase
      .from('users')
      .insert({
        name: 'Maria Silva',
        email: 'maria@example.com',
        password: user1Password,
        role: 'user',
        is_email_verified: true,
      })
      .select()
      .single()

    if (user1Error) throw new Error(`User 1 creation failed: ${user1Error.message}`)

    const user2Password = await hashPassword('user123')
    const { data: user2, error: user2Error } = await supabase
      .from('users')
      .insert({
        name: 'João Santos',
        email: 'joao@example.com',
        password: user2Password,
        role: 'user',
        is_email_verified: true,
      })
      .select()
      .single()

    if (user2Error) throw new Error(`User 2 creation failed: ${user2Error.message}`)

    // Create events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .insert([
        {
          title: 'Workshop de Pintura Moderna',
          description: 'Aprenda técnicas modernas de pintura com nossos artistas experientes. Todos os níveis são bem-vindos.',
          full_description: 'Neste workshop intensivo, você aprenderá as técnicas mais modernas de pintura com nossos artistas experientes. Cobriremos desde os fundamentos até técnicas avançadas. Todos os níveis são bem-vindos e o material será fornecido.',
          category: 'Workshop',
          date: '15 de Dezembro, 2024',
          time: '14:00 - 17:00',
          location: 'Estúdio Elit\'Arte, Lisboa',
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
          time: '18:00 - 22:00',
          location: 'Galeria Central, Porto',
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
          time: '15:00 - 18:00',
          location: 'Estúdio Elit\'Arte, Lisboa',
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
          time: '19:00 - 23:00',
          location: 'Espaço Criativo, Lisboa',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
            'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
          ],
          capacity: 100,
          attendees: 80,
          available_spots: 20,
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
          time: '14:00 - 17:00',
          location: 'Estúdio Elit\'Arte, Lisboa',
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

    // Create newsletter subscribers
    const { data: newsletter, error: newsletterError } = await supabase
      .from('newsletter')
      .insert([
        {
          email: 'subscriber1@example.com',
          is_subscribed: true,
        },
        {
          email: 'subscriber2@example.com',
          is_subscribed: true,
        },
        {
          email: 'subscriber3@example.com',
          is_subscribed: true,
        },
      ])
      .select()

    if (newsletterError) throw new Error(`Newsletter creation failed: ${newsletterError.message}`)

    console.log('✅ Database seeded successfully!')
    console.log(`📝 Created 1 admin user`)
    console.log(`🎭 Created 2 artist users`)
    console.log(`👥 Created 2 regular users`)
    console.log(`🎪 Created ${events?.length || 0} events`)
    console.log(`📧 Created ${newsletter?.length || 0} newsletter subscribers`)

    console.log('\n📋 Test Credentials:')
    console.log('Admin: admin@elit-arte.com / admin123')
    console.log('Artist 1: faustino@elit-arte.com / artist123')
    console.log('Artist 2: josemara@elit-arte.com / artist123')
    console.log('User 1: maria@example.com / user123')
    console.log('User 2: joao@example.com / user123')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
