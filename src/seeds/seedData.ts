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
          title: 'Workshop de Teatro Contemporâneo',
          description: 'Aprenda técnicas de teatro contemporâneo com profissionais',
          full_description:
            'Um workshop intensivo de 4 horas onde você aprenderá as técnicas mais modernas de teatro contemporâneo. Perfeito para iniciantes e intermediários.',
          category: 'Workshop',
          date: '2024-12-20',
          time: '18:00',
          location: 'Luanda, Angola',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          images: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
          ],
          capacity: 30,
          attendees: 0,
          price: 0,
          is_free: true,
          status: 'upcoming',
          organizer_id: artist1.id,
        },
        {
          title: 'Exposição de Arte Angolana',
          description: 'Exposição de obras de artistas angolanos contemporâneos',
          full_description:
            'Uma exposição que celebra a riqueza da arte angolana contemporânea, com obras de pintura, escultura e instalações.',
          category: 'Exposição',
          date: '2024-12-25',
          time: '10:00',
          location: 'Museu Nacional, Luanda',
          image: 'https://images.unsplash.com/photo-1578926078328-123456789012?w=500',
          capacity: 100,
          attendees: 0,
          price: 5,
          is_free: false,
          status: 'upcoming',
          organizer_id: artist2.id,
        },
        {
          title: 'Masterclass de Dança Tradicional',
          description: 'Aprenda danças tradicionais angolanas com mestres',
          full_description:
            'Uma masterclass onde você aprenderá as danças tradicionais mais importantes da cultura angolana, com história e significado cultural.',
          category: 'Masterclass',
          date: '2024-12-28',
          time: '19:00',
          location: 'Centro Cultural, Luanda',
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
          capacity: 50,
          attendees: 0,
          price: 0,
          is_free: true,
          status: 'upcoming',
          organizer_id: artist1.id,
        },
        {
          title: 'Networking de Artistas',
          description: 'Encontro para artistas compartilharem experiências',
          full_description:
            'Um evento de networking onde artistas de diferentes áreas podem se conhecer, compartilhar ideias e criar parcerias.',
          category: 'Networking',
          date: '2024-12-30',
          time: '17:00',
          location: 'Espaço Elit\'Arte, Luanda',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
          capacity: 40,
          attendees: 0,
          price: 0,
          is_free: true,
          status: 'upcoming',
          organizer_id: admin.id,
        },
        {
          title: 'Concerto de Música Angolana',
          description: 'Apresentação de música tradicional e contemporânea',
          full_description:
            'Um concerto especial apresentando o melhor da música angolana, desde ritmos tradicionais até produções contemporâneas.',
          category: 'Workshop',
          date: '2024-11-15',
          time: '20:00',
          location: 'Teatro Nacional, Luanda',
          image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
          capacity: 200,
          attendees: 45,
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
