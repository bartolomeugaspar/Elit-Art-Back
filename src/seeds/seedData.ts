import { supabase } from '../config/database'
import { hashPassword } from '../models/User'
import dotenv from 'dotenv'

dotenv.config()

const seedDatabase = async () => {
  try {

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
        email: 'admin@elit-Arte.com',
        password: adminPassword,
        role: 'admin',
        is_email_verified: true,
      })
      .select()
      .single()

    if (adminError) throw new Error(`Admin creation failed: ${adminError.message}`)

    // Create artista users
    const artista1Password = await hashPassword('artista123')
    const { data: artista1, error: artista1Error } = await supabase
      .from('users')
      .insert({
        name: 'Faustino Domingos',
        email: 'faustino@elit-Arte.com',
        password: artista1Password,
        role: 'artista',
        bio: 'Fundador e Diretor Geral do Elit\'Arte',
        is_email_verified: true,
      })
      .select()
      .single()

    if (artista1Error) throw new Error(`artista 1 creation failed: ${artista1Error.message}`)

    const artista2Password = await hashPassword('artista123')
    const { data: artista2, error: artista2Error } = await supabase
      .from('users')
      .insert({
        name: 'Josemara Comongo',
        email: 'josemara@elit-Arte.com',
        password: artista2Password,
        role: 'artista',
        bio: 'Co-fundadora do Elit\'Arte',
        is_email_verified: true,
      })
      .select()
      .single()

    if (artista2Error) throw new Error(`artista 2 creation failed: ${artista2Error.message}`)

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
          description: 'Aprenda técnicas modernas de pintura com nossos Artistas experientes. Todos os níveis são bem-vindos.',
          full_description: 'Neste workshop intensivo, você aprenderá as técnicas mais modernas de pintura com nossos Artistas experientes. Cobriremos desde os fundamentos até técnicas avançadas. Todos os níveis são bem-vindos e o material será fornecido.',
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
          organizer_id: artista1.id,
        },
        {
          title: 'Exposição de Arte Contemporânea',
          description: 'Venha conhecer as obras mais recentes de nossos Artistas  . Haverá coquetel de abertura.',
          full_description: 'Uma exposição exclusiva apresentando as obras mais recentes de nossos Artistastalentosos. Haverá coquetel de abertura com drinks e aperitivos. Entrada gratuita para membros.',
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
          organizer_id: artista2.id,
        },
        {
          title: 'Masterclass com Artista Convidado',
          description: 'Sessão especial com Artista internacional renomado. Inscrição obrigatória.',
          full_description: 'Uma oportunidade única de aprender diretamente com um Artista internacional renomado. Esta masterclass é limitada a 40 pArteicipantes. Inscrição obrigatória com antecedência.',
          category: 'Master',
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
          organizer_id: artista1.id,
        },
        {
          title: 'Noite de Networking Artístico',
          description: 'Encontre outros Artistas  , colecionadores e entusiastas de Arte. Networking informal.',
          full_description: 'Uma noite informal para conectar com outros Artistas  , colecionadores e entusiastas de Arte. Haverá drinks, música ao vivo e muito networking. Perfeito para expandir sua rede profissional.',
          category: 'Network',
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
          description: 'Workshop bem-sucedido com 35 pArteicipantes entusiasmados.',
          full_description: 'Um workshop incrível onde aprendemos técnicas tradicionais de escultura em argila. Todos os materiais foram fornecidos e os pArteicipantes saíram com suas próprias criações.',
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
          organizer_id: artista2.id,
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



    process.exit(0)
  } catch (error) {
    process.exit(1)
  }
}

seedDatabase()
