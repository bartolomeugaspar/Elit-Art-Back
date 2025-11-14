import mongoose from 'mongoose'
import User from '../models/User'
import Event from '../models/Event'
import Newsletter from '../models/Newsletter'
import dotenv from 'dotenv'

dotenv.config()

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elit-art')

    // Clear existing data
    await User.deleteMany({})
    await Event.deleteMany({})
    await Newsletter.deleteMany({})

    // Create admin user
    const admin = await User.create({
      name: 'Admin Elit',
      email: 'admin@elit-arte.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true,
    })

    // Create artist users
    const artist1 = await User.create({
      name: 'Faustino Domingos',
      email: 'faustino@elit-arte.com',
      password: 'artist123',
      role: 'artist',
      bio: 'Fundador e Diretor Geral do Elit\'Arte',
      isEmailVerified: true,
    })

    const artist2 = await User.create({
      name: 'Josemara Comongo',
      email: 'josemara@elit-arte.com',
      password: 'artist123',
      role: 'artist',
      bio: 'Co-fundadora do Elit\'Arte',
      isEmailVerified: true,
    })

    // Create regular users
    const user1 = await User.create({
      name: 'Maria Silva',
      email: 'maria@example.com',
      password: 'user123',
      role: 'user',
      isEmailVerified: true,
    })

    const user2 = await User.create({
      name: 'João Santos',
      email: 'joao@example.com',
      password: 'user123',
      role: 'user',
      isEmailVerified: true,
    })

    // Create events
    const events = await Event.create([
      {
        title: 'Workshop de Teatro Contemporâneo',
        description: 'Aprenda técnicas de teatro contemporâneo com profissionais',
        fullDescription:
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
        isFree: true,
        status: 'upcoming',
        organizer: artist1._id,
      },
      {
        title: 'Exposição de Arte Angolana',
        description: 'Exposição de obras de artistas angolanos contemporâneos',
        fullDescription:
          'Uma exposição que celebra a riqueza da arte angolana contemporânea, com obras de pintura, escultura e instalações.',
        category: 'Exposição',
        date: '2024-12-25',
        time: '10:00',
        location: 'Museu Nacional, Luanda',
        image: 'https://images.unsplash.com/photo-1578926078328-123456789012?w=500',
        capacity: 100,
        attendees: 0,
        price: 5,
        isFree: false,
        status: 'upcoming',
        organizer: artist2._id,
      },
      {
        title: 'Masterclass de Dança Tradicional',
        description: 'Aprenda danças tradicionais angolanas com mestres',
        fullDescription:
          'Uma masterclass onde você aprenderá as danças tradicionais mais importantes da cultura angolana, com história e significado cultural.',
        category: 'Masterclass',
        date: '2024-12-28',
        time: '19:00',
        location: 'Centro Cultural, Luanda',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
        capacity: 50,
        attendees: 0,
        price: 0,
        isFree: true,
        status: 'upcoming',
        organizer: artist1._id,
      },
      {
        title: 'Networking de Artistas',
        description: 'Encontro para artistas compartilharem experiências',
        fullDescription:
          'Um evento de networking onde artistas de diferentes áreas podem se conhecer, compartilhar ideias e criar parcerias.',
        category: 'Networking',
        date: '2024-12-30',
        time: '17:00',
        location: 'Espaço Elit\'Arte, Luanda',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        capacity: 40,
        attendees: 0,
        price: 0,
        isFree: true,
        status: 'upcoming',
        organizer: admin._id,
      },
      {
        title: 'Concerto de Música Angolana',
        description: 'Apresentação de música tradicional e contemporânea',
        fullDescription:
          'Um concerto especial apresentando o melhor da música angolana, desde ritmos tradicionais até produções contemporâneas.',
        category: 'Workshop',
        date: '2024-11-15',
        time: '20:00',
        location: 'Teatro Nacional, Luanda',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
        capacity: 200,
        attendees: 45,
        price: 0,
        isFree: true,
        status: 'completed',
        organizer: artist2._id,
      },
    ])

    // Create newsletter subscribers
    await Newsletter.create([
      {
        email: 'subscriber1@example.com',
        isSubscribed: true,
      },
      {
        email: 'subscriber2@example.com',
        isSubscribed: true,
      },
      {
        email: 'subscriber3@example.com',
        isSubscribed: true,
      },
    ])

    console.log('✅ Database seeded successfully!')
    console.log(`📝 Created ${1} admin user`)
    console.log(`🎭 Created ${2} artist users`)
    console.log(`👥 Created ${2} regular users`)
    console.log(`🎪 Created ${events.length} events`)
    console.log(`📧 Created ${3} newsletter subscribers`)

    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
