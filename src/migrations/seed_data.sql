-- Seed Data for Elit'Art Database
-- Insert test data into all new feature tables
-- Date: 2025-11-19

-- ===== INSERT PRODUCTS =====
INSERT INTO products (name, description, category, price, discount_price, image_url, stock, sku, author, isbn, pages, publication_date, is_digital, is_active)
VALUES
  ('Arte Moderna em Angola', 'Livro sobre a história da arte moderna angolana', 'book', 45.99, 39.99, 'https://elit-arte.vercel.app/icon.jpeg', 25, 'BOOK-001', 'João Silva', '978-1234567890', 320, '2023-01-15', FALSE, TRUE),
  ('Revista Elit''Art #1', 'Primeira edição da revista trimestral Elit''Art', 'magazine', 12.50, 10.00, 'https://elit-arte.vercel.app/icon.jpeg', 50, 'MAG-001', NULL, NULL, NULL, '2025-01-01', FALSE, TRUE),
  ('Ingresso - Exposição Anual', 'Ingresso para a exposição anual de arte', 'ticket', 25.00, NULL, 'https://elit-arte.vercel.app/icon.jpeg', 100, 'TICKET-001', NULL, NULL, NULL, NULL, FALSE, TRUE),
  ('Camiseta Elit''Art Edição Limitada', 'Camiseta com logo da Elit''Art - edição limitada', 'merchandise', 35.00, 28.00, 'https://elit-arte.vercel.app/icon.jpeg', 75, 'MERCH-001', NULL, NULL, NULL, NULL, FALSE, TRUE),
  ('Poesia Contemporânea Angolana', 'Coletânea de poesias de autores angolanos contemporâneos', 'book', 29.99, 24.99, 'https://elit-arte.vercel.app/icon.jpeg', 40, 'BOOK-002', 'Maria Santos', '978-0987654321', 256, '2024-06-20', FALSE, TRUE),
  ('E-book: Guia de Artes Visuais', 'Guia digital sobre técnicas de artes visuais', 'book', 15.99, NULL, 'https://elit-arte.vercel.app/icon.jpeg', 999, 'EBOOK-001', 'Carlos Mendes', NULL, 180, '2025-01-10', TRUE, TRUE),
  ('Revista Elit''Art #2', 'Segunda edição da revista trimestral Elit''Art', 'magazine', 12.50, 10.00, 'https://elit-arte.vercel.app/icon.jpeg', 45, 'MAG-002', NULL, NULL, NULL, '2025-04-01', FALSE, TRUE),
  ('Workshop - Pintura Acrílica', 'Ingresso para workshop de pintura acrílica', 'ticket', 50.00, 40.00, 'https://elit-arte.vercel.app/icon.jpeg', 30, 'TICKET-002', NULL, NULL, NULL, NULL, FALSE, TRUE);

-- ===== INSERT BLOG POSTS =====
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, category, author_id, author_name, status, published_at)
VALUES
  ('A Importância da Arte Contemporânea', 'importancia-arte-contemporanea', 'A arte contemporânea desempenha um papel crucial na sociedade moderna, servindo como espelho das questões sociais e políticas do nosso tempo...', 'Descubra por que a arte contemporânea é essencial para entender o mundo atual.', 'https://elit-arte.vercel.app/icon.jpeg', 'article', NULL, 'Redação Elit''Art', 'published', '2025-01-15'),
  ('Contos de Autores Angolanos', 'contos-autores-angolanos', 'Uma seleção de contos curtos de autores angolanos que exploram temas de identidade, cultura e tradição...', 'Leia histórias inspiradoras de escritores angolanos.', 'https://elit-arte.vercel.app/icon.jpeg', 'story', NULL, 'Redação Elit''Art', 'published', '2025-01-20'),
  ('Poesia: Expressão da Alma', 'poesia-expressao-alma', 'A poesia é uma forma de arte que permite expressar sentimentos e emoções de maneira profunda e significativa...', 'Explore a beleza e profundidade da poesia.', 'https://elit-arte.vercel.app/icon.jpeg', 'poetry', NULL, 'Redação Elit''Art', 'published', '2025-02-01'),
  ('Revista Elit''Art - Edição Especial', 'revista-elit-art-especial', 'Conheça os destaques da nossa edição especial com entrevistas exclusivas e análises profundas...', 'A edição mais completa da revista Elit''Art.', 'https://elit-arte.vercel.app/icon.jpeg', 'magazine', NULL, 'Redação Elit''Art', 'published', '2025-02-10'),
  ('Drama e Teatro: Expressão Artística', 'drama-teatro-expressao', 'O teatro é uma forma de arte que combina atuação, cenografia e música para criar experiências inesquecíveis...', 'Descubra a magia do teatro e do drama.', 'https://elit-arte.vercel.app/icon.jpeg', 'drama', NULL, 'Redação Elit''Art', 'draft', NULL),
  ('Tendências de Arte Digital em 2025', 'tendencias-arte-digital-2025', 'A arte digital continua evoluindo com novas tecnologias e ferramentas que permitem aos artistas criar obras inovadoras...', 'Conheça as principais tendências de arte digital.', 'https://elit-arte.vercel.app/icon.jpeg', 'article', NULL, 'Redação Elit''Art', 'draft', NULL);

-- ===== INSERT ARTWORKS =====
INSERT INTO artworks (title, description, artist_id, artist_name, type, year, dimensions, medium, image_url, price, is_available, is_featured)
VALUES
  ('Reflexão Urbana', 'Pintura que retrata a vida urbana moderna com cores vibrantes', NULL, 'Faustino Mulumba', 'painting', 2023, '100x80cm', 'Acrílico sobre tela', 'https://elit-arte.vercel.app/icon.jpeg', 5000.00, TRUE, TRUE),
  ('Escultura Abstrata', 'Escultura em madeira que explora formas geométricas abstratas', NULL, 'Josemara Silva', 'sculpture', 2024, '150cm altura', 'Madeira de mogno', 'https://elit-arte.vercel.app/icon.jpeg', 8000.00, TRUE, TRUE),
  ('Paisagem Angolana', 'Fotografia que captura a beleza natural de Angola', NULL, 'Fotógrafo Usúario', 'photography', 2024, '60x90cm', 'Impressão em papel fotográfico', 'https://elit-arte.vercel.app/icon.jpeg', 1500.00, TRUE, FALSE),
  ('Código Criativo', 'Arte digital que combina programação e criatividade visual', NULL, 'Artista Digital', 'digital', 2025, 'Formato digital', 'Técnica digital', 'https://elit-arte.vercel.app/icon.jpeg', 2000.00, TRUE, FALSE),
  ('Fusão de Técnicas', 'Obra mista que combina pintura, colagem e elementos tridimensionais', NULL, 'Criador Experimental', 'mixed_media', 2024, '120x120cm', 'Técnica mista', 'https://elit-arte.vercel.app/icon.jpeg', 3500.00, TRUE, FALSE);

-- ===== INSERT PRESS RELEASES =====
INSERT INTO press_releases (title, content, summary, image_url, publication_date, author, status)
VALUES
  ('Elit''Art Lança Nova Plataforma Digital', 'A Elit''Art tem o prazer de anunciar o lançamento de sua nova plataforma digital, que oferece acesso a uma vasta coleção de obras de arte e conteúdo exclusivo...', 'Novo portal digital da Elit''Art já está disponível para o público.', 'https://elit-arte.vercel.app/icon.jpeg', '2025-01-10', 'Assessoria de Imprensa', 'published'),
  ('Exposição Anual 2025 Confirmada', 'A exposição anual de arte de 2025 será realizada em março, apresentando obras de artistas emergentes e consagrados...', 'Datas e detalhes da exposição anual já foram divulgados.', 'https://elit-arte.vercel.app/icon.jpeg', '2025-01-15', 'Assessoria de Imprensa', 'published'),
  ('Parceria com Instituições Culturais', 'Elit''Art anuncia parceria estratégica com instituições culturais internacionais para promover a arte angolana...', 'Novas parcerias internacionais fortalecem presença da Elit''Art.', 'https://elit-arte.vercel.app/icon.jpeg', '2025-02-01', 'Assessoria de Imprensa', 'draft');

-- ===== INSERT MEDIA KITS =====
INSERT INTO media_kits (title, description, file_url, file_type, file_size, downloads)
VALUES
  ('Kit de Imprensa - Elit''Art 2025', 'Pacote completo com logos, fotos e informações sobre a Elit''Art', 'https://elit-arte.vercel.app/media-kit-2025.zip', 'zip', 15728640, 12),
  ('Guia de Marca - Elit''Art', 'Documentação completa sobre as diretrizes de uso da marca Elit''Art', 'https://elit-arte.vercel.app/brand-guide.pdf', 'pdf', 5242880, 8),
  ('Catálogo de Artistas', 'Documento com informações e fotos de todos os artistas parceiros', 'https://elit-arte.vercel.app/artists-catalog.doc', 'doc', 8388608, 5);

-- ===== INSERT FORUM TOPICS =====
INSERT INTO forum_topics (title, description, category, author_id, author_name, is_pinned, is_closed)
VALUES
  ('Bem-vindo à Comunidade Elit''Art!', 'Este é o espaço para discussões sobre arte, eventos e colaborações. Sinta-se livre para compartilhar suas ideias!', 'general', NULL, 'Administrador', TRUE, FALSE),
  ('Técnicas de Pintura Acrílica', 'Compartilhem suas experiências e dicas sobre pintura acrílica. Qual é a sua técnica favorita?', 'art', NULL, 'Membro da Comunidade', FALSE, FALSE),
  ('Próximos Eventos da Elit''Art', 'Fique atualizado sobre os próximos eventos, exposições e workshops organizados pela Elit''Art.', 'events', NULL, 'Administrador', TRUE, FALSE),
  ('Oportunidades de Colaboração', 'Procurando parceiros para projetos artísticos? Este é o lugar certo para encontrar colaboradores!', 'collaboration', NULL, 'Membro da Comunidade', FALSE, FALSE),
  ('Feedback e Sugestões', 'Sua opinião é importante! Compartilhe sugestões para melhorar a plataforma Elit''Art.', 'feedback', NULL, 'Membro da Comunidade', FALSE, FALSE);

-- ===== INSERT FORUM REPLIES =====
INSERT INTO forum_replies (topic_id, author_id, author_name, content, likes)
SELECT 
  (SELECT id FROM forum_topics WHERE title = 'Bem-vindo à Comunidade Elit''Art!' LIMIT 1),
  NULL,
  'João Silva',
  'Que legal! Estou muito animado em fazer parte dessa comunidade de arte.',
  5
UNION ALL
SELECT 
  (SELECT id FROM forum_topics WHERE title = 'Técnicas de Pintura Acrílica' LIMIT 1),
  NULL,
  'Maria Santos',
  'Eu gosto muito de usar a técnica de glazing com tinta acrílica. Fica com um acabamento muito legal!',
  8
UNION ALL
SELECT 
  (SELECT id FROM forum_topics WHERE title = 'Técnicas de Pintura Acrílica' LIMIT 1),
  NULL,
  'Carlos Mendes',
  'A técnica de dry brush é minha favorita para criar texturas interessantes.',
  3;

-- ===== SUMMARY =====
-- Inserted:
-- - 8 products (books, magazines, tickets, merchandise)
-- - 6 blog posts (articles, stories, poetry, drama, magazine)
-- - 5 artworks (paintings, sculpture, photography, digital, mixed media)
-- - 3 press releases
-- - 3 media kits
-- - 5 forum topics
-- - 3 forum replies
