-- Limpar todos os eventos existentes
DELETE FROM events;

-- Adicionar eventos com preço e coordenadas bancárias
INSERT INTO events (
  title, 
  description, 
  full_description, 
  category, 
  date, 
  time, 
  location, 
  image, 
  images, 
  capacity, 
  attendees, 
  available_spots, 
  price, 
  is_free, 
  bank_details, 
  status, 
  organizer_id,
  created_at,
  updated_at
) VALUES
-- Workshop de Pintura Moderna
(
  'Workshop de Pintura Moderna',
  'Aprenda técnicas modernas de pintura com nossos Artistas experientes. Todos os níveis são bem-vindos.',
  'Neste workshop intensivo, você aprenderá as técnicas mais modernas de pintura com nossos Artistas experientes. Cobriremos desde os fundamentos até técnicas avançadas. Todos os níveis são bem-vindos e o material será fornecido.',
  'Workshop',
  '15 de Dezembro, 2024',
  '14h',
  'Estúdio Elit''Arte',
  'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=500&h=300&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=500&h=300&fit=crop', 'https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=500&h=300&fit=crop'],
  30,
  24,
  6,
  5000,
  false,
  '{"account_holder": "Elit Arte Estúdio", "bank_name": "BAI", "account_number": "0001234567890", "iban": "AO06000100037131174310147"}'::jsonb,
  'upcoming',
  (SELECT id FROM users WHERE email = 'faustino@elit-Arte.com' LIMIT 1),
  NOW(),
  NOW()
),

-- Exposição de Arte Contemporânea
(
  'Exposição de Arte Contemporânea',
  'Venha conhecer as obras mais recentes de nossos Artistas. Haverá coquetel de abertura.',
  'Uma exposição exclusiva apresentando as obras mais recentes de nossos Artistas talentosos. Haverá coquetel de abertura com drinks e aperitivos. Entrada gratuita para membros.',
  'Exposição',
  '20 de Dezembro, 2024',
  '18:00',
  'Galeria Central',
  'https://images.unsplash.com/photo-1578926078328-123456789012?w=500&h=300&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1578926078328-123456789012?w=500&h=300&fit=crop', 'https://images.unsplash.com/photo-1578926078328-123456789012?w=500&h=300&fit=crop'],
  200,
  150,
  50,
  2500,
  false,
  '{"account_holder": "Galeria Central Luanda", "bank_name": "BPC", "account_number": "0009876543210", "iban": "AO06000200037131174310148"}'::jsonb,
  'upcoming',
  (SELECT id FROM users WHERE email = 'josemara@elit-Arte.com' LIMIT 1),
  NOW(),
  NOW()
),

-- Masterclass com Arteista Convidado
(
  'Masterclass com Arteista Convidado',
  'Sessão especial com Arteista internacional renomado. Inscrição obrigatória.',
  'Uma oportunidade única de aprender diretamente com um Arteista internacional renomado. Esta masterclass é limitada a 40 participantes. Inscrição obrigatória com antecedência.',
  'Masterclass',
  '28 de Dezembro, 2024',
  '15:00',
  'Estúdio Elit''Arte',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop'],
  40,
  40,
  0,
  10000,
  false,
  '{"account_holder": "Elit Arte Masterclass", "bank_name": "BAI", "account_number": "0005555555555", "iban": "AO06000100037131174310149"}'::jsonb,
  'upcoming',
  (SELECT id FROM users WHERE email = 'faustino@elit-Arte.com' LIMIT 1),
  NOW(),
  NOW()
),

-- Noite de Networking Artístico
(
  'Noite de Networking Artístico',
  'Encontre outros Artistas, colecionadores e entusiastas de Arte. Networking informal.',
  'Uma noite informal para conectar com outros Artistas, colecionadores e entusiastas de Arte. Haverá drinks, música ao vivo e muito networking. Perfeito para expandir sua rede profissional.',
  'Networking',
  '10 de Janeiro, 2025',
  '19:00',
  'Espaço Criativo',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop'],
  100,
  0,
  100,
  3000,
  false,
  '{"account_holder": "Espaço Criativo", "bank_name": "Banco Angolano de Investimentos", "account_number": "0007777777777", "iban": "AO06000100037131174310150"}'::jsonb,
  'upcoming',
  (SELECT id FROM users WHERE email = 'admin@elit-Arte.com' LIMIT 1),
  NOW(),
  NOW()
),

-- Workshop de Escultura em Argila (Passado)
(
  'Workshop de Escultura em Argila',
  'Workshop bem-sucedido com 35 participantes entusiasmados.',
  'Um workshop incrível onde aprendemos técnicas tradicionais de escultura em argila. Todos os materiais foram fornecidos e os participantes saíram com suas próprias criações.',
  'Workshop',
  '10 de Novembro, 2024',
  '14:00',
  'Estúdio Elit''Arte',
  'https://images.unsplash.com/photo-1578926078328-123456789012?w=500&h=300&fit=crop',
  ARRAY['https://images.unsplash.com/photo-1578926078328-123456789012?w=500&h=300&fit=crop'],
  35,
  35,
  0,
  4500,
  false,
  '{"account_holder": "Elit Arte Estúdio", "bank_name": "BAI", "account_number": "0001234567890", "iban": "AO06000100037131174310147"}'::jsonb,
  'completed',
  (SELECT id FROM users WHERE email = 'josemara@elit-Arte.com' LIMIT 1),
  NOW(),
  NOW()
);

-- Verificar dados inseridos
SELECT id, title, price, is_free, bank_details, status FROM events ORDER BY date DESC;
