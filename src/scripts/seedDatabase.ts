import { supabase } from '../config/database'

/**
 * Seed Database Script
 * Inserts test data into all new feature tables
 * Run with: npx ts-node src/scripts/seedDatabase.ts
 */

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n')

    // ===== SEED PRODUCTS =====
    console.log('📦 Seeding products...')
    const products = [
      {
        name: 'Arte Moderna em Angola',
        description: 'Livro sobre a história da arte moderna angolana',
        category: 'book',
        price: 45.99,
        discount_price: 39.99,
        image_url: 'https://elit-arte.vercel.app/icon.jpeg',
        stock: 25,
        sku: 'BOOK-001',
        author: 'João Silva',
        isbn: '978-1234567890',
        pages: 320,
        publication_date: '2023-01-15',
        is_digital: false,
        is_active: true,
      },
      {
        name: 'Revista Elit\'Art #1',
        description: 'Primeira edição da revista trimestral Elit\'Art',
        category: 'magazine',
        price: 12.5,
        discount_price: 10.0,
        image_url: 'https://elit-arte.vercel.app/icon.jpeg',
        stock: 50,
        sku: 'MAG-001',
        is_digital: false,
        is_active: true,
      },
      {
        name: 'Ingresso - Exposição Anual',
        description: 'Ingresso para a exposição anual de arte',
        category: 'ticket',
        price: 25.0,
        image_url: 'https://elit-arte.vercel.app/icon.jpeg',
        stock: 100,
        sku: 'TICKET-001',
        is_digital: false,
        is_active: true,
      },
      {
        name: 'Camiseta Elit\'Art Edição Limitada',
        description: 'Camiseta com logo da Elit\'Art - edição limitada',
        category: 'merchandise',
        price: 35.0,
        discount_price: 28.0,
        image_url: 'https://elit-arte.vercel.app/icon.jpeg',
        stock: 75,
        sku: 'MERCH-001',
        is_digital: false,
        is_active: true,
      },
    ]

    const { error: productsError } = await supabase.from('products').insert(products)
    if (productsError) throw productsError
    console.log(`✅ Inserted ${products.length} products\n`)

    // ===== SEED BLOG POSTS =====
    console.log('📝 Seeding blog posts...')
    const blogPosts = [
      {
        title: 'A Importância da Arte Contemporânea',
        slug: 'importancia-arte-contemporanea',
        content: 'A arte contemporânea desempenha um papel crucial na sociedade moderna...',
        excerpt: 'Descubra por que a arte contemporânea é essencial para entender o mundo atual.',
        featured_image: 'https://elit-arte.vercel.app/icon.jpeg',
        category: 'article',
        author_name: 'Redação Elit\'Art',
        status: 'published',
        published_at: '2025-01-15',
      },
      {
        title: 'Contos de Autores Angolanos',
        slug: 'contos-autores-angolanos',
        content: 'Uma seleção de contos curtos de autores angolanos...',
        excerpt: 'Leia histórias inspiradoras de escritores angolanos.',
        featured_image: 'https://elit-arte.vercel.app/icon.jpeg',
        category: 'story',
        author_name: 'Redação Elit\'Art',
        status: 'published',
        published_at: '2025-01-20',
      },
      {
        title: 'Poesia: Expressão da Alma',
        slug: 'poesia-expressao-alma',
        content: 'A poesia é uma forma de arte que permite expressar sentimentos...',
        excerpt: 'Explore a beleza e profundidade da poesia.',
        featured_image: 'https://elit-arte.vercel.app/icon.jpeg',
        category: 'poetry',
        author_name: 'Redação Elit\'Art',
        status: 'published',
        published_at: '2025-02-01',
      },
    ]

    const { error: blogError } = await supabase.from('blog_posts').insert(blogPosts)
    if (blogError) throw blogError
    console.log(`✅ Inserted ${blogPosts.length} blog posts\n`)

    // ===== SEED ARTWORKS =====
    console.log('🎨 Seeding artworks...')
    const artworks = [
      {
        title: 'Reflexão Urbana',
        description: 'Pintura que retrata a vida urbana moderna com cores vibrantes',
        artist_name: 'Faustino Mulumba',
        type: 'painting',
        year: 2023,
        dimensions: '100x80cm',
        medium: 'Acrílico sobre tela',
        image_url: 'https://elit-arte.vercel.app/icon.jpeg',
        price: 5000.0,
        is_available: true,
        is_featured: true,
      },
      {
        title: 'Escultura Abstrata',
        description: 'Escultura em madeira que explora formas geométricas abstratas',
        artist_name: 'Josemara Silva',
        type: 'sculpture',
        year: 2024,
        dimensions: '150cm altura',
        medium: 'Madeira de mogno',
        image_url: 'https://elit-arte.vercel.app/icon.jpeg',
        price: 8000.0,
        is_available: true,
        is_featured: true,
      },
      {
        title: 'Paisagem Angolana',
        description: 'Fotografia que captura a beleza natural de Angola',
        artist_name: 'Fotógrafo Usúario',
        type: 'photography',
        year: 2024,
        dimensions: '60x90cm',
        medium: 'Impressão em papel fotográfico',
        image_url: 'https://elit-arte.vercel.app/icon.jpeg',
        price: 1500.0,
        is_available: true,
        is_featured: false,
      },
    ]

    const { error: artworksError } = await supabase.from('artworks').insert(artworks)
    if (artworksError) throw artworksError
    console.log(`✅ Inserted ${artworks.length} artworks\n`)

    // ===== SEED PRESS RELEASES =====
    console.log('📰 Seeding press releases...')
    const pressReleases = [
      {
        title: 'Elit\'Art Lança Nova Plataforma Digital',
        content: 'A Elit\'Art tem o prazer de anunciar o lançamento de sua nova plataforma digital...',
        summary: 'Novo portal digital da Elit\'Art já está disponível para o público.',
        image_url: 'https://elit-arte.vercel.app/icon.jpeg',
        publication_date: '2025-01-10',
        author: 'Assessoria de Imprensa',
        status: 'published',
      },
      {
        title: 'Exposição Anual 2025 Confirmada',
        content: 'A exposição anual de arte de 2025 será realizada em março...',
        summary: 'Datas e detalhes da exposição anual já foram divulgados.',
        image_url: 'https://elit-arte.vercel.app/icon.jpeg',
        publication_date: '2025-01-15',
        author: 'Assessoria de Imprensa',
        status: 'published',
      },
    ]

    const { error: pressError } = await supabase.from('press_releases').insert(pressReleases)
    if (pressError) throw pressError
    console.log(`✅ Inserted ${pressReleases.length} press releases\n`)

    // ===== SEED MEDIA KITS =====
    console.log('📦 Seeding media kits...')
    const mediaKits = [
      {
        title: 'Kit de Imprensa - Elit\'Art 2025',
        description: 'Pacote completo com logos, fotos e informações sobre a Elit\'Art',
        file_url: 'https://elit-arte.vercel.app/media-kit-2025.zip',
        file_type: 'zip',
        file_size: 15728640,
        downloads: 12,
      },
      {
        title: 'Guia de Marca - Elit\'Art',
        description: 'Documentação completa sobre as diretrizes de uso da marca Elit\'Art',
        file_url: 'https://elit-arte.vercel.app/brand-guide.pdf',
        file_type: 'pdf',
        file_size: 5242880,
        downloads: 8,
      },
    ]

    const { error: mediaError } = await supabase.from('media_kits').insert(mediaKits)
    if (mediaError) throw mediaError
    console.log(`✅ Inserted ${mediaKits.length} media kits\n`)

    // ===== SEED FORUM TOPICS =====
    console.log('💬 Seeding forum topics...')
    const forumTopics = [
      {
        title: 'Bem-vindo à Comunidade Elit\'Art!',
        description: 'Este é o espaço para discussões sobre arte, eventos e colaborações.',
        category: 'general',
        author_name: 'Administrador',
        is_pinned: true,
        is_closed: false,
      },
      {
        title: 'Técnicas de Pintura Acrílica',
        description: 'Compartilhem suas experiências e dicas sobre pintura acrílica.',
        category: 'art',
        author_name: 'Membro da Comunidade',
        is_pinned: false,
        is_closed: false,
      },
      {
        title: 'Próximos Eventos da Elit\'Art',
        description: 'Fique atualizado sobre os próximos eventos, exposições e workshops.',
        category: 'events',
        author_name: 'Administrador',
        is_pinned: true,
        is_closed: false,
      },
    ]

    const { error: forumError } = await supabase.from('forum_topics').insert(forumTopics)
    if (forumError) throw forumError
    console.log(`✅ Inserted ${forumTopics.length} forum topics\n`)

    // ===== SUMMARY =====
    console.log('✨ Database seeding completed successfully!\n')
    console.log('📊 Summary:')
    console.log(`   - ${products.length} products`)
    console.log(`   - ${blogPosts.length} blog posts`)
    console.log(`   - ${artworks.length} artworks`)
    console.log(`   - ${pressReleases.length} press releases`)
    console.log(`   - ${mediaKits.length} media kits`)
    console.log(`   - ${forumTopics.length} forum topics`)
    console.log('\n✅ All data inserted successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
