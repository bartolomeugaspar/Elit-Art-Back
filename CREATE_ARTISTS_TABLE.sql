-- Criar tabela de artistas
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  artistic_name VARCHAR(255),
  area VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  image VARCHAR(500),
  role VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);
CREATE INDEX IF NOT EXISTS idx_artists_area ON artists(area);
CREATE INDEX IF NOT EXISTS idx_artists_email ON artists(email);

-- Inserir artistas existentes
INSERT INTO artists (name, artistic_name, area, description, email, phone, role) VALUES
('Adelino Canganjo Vitorino Mateus', NULL, 'Música (Piano)', 'Começou a cantar no coral da igreja, onde sentiu a vocacção pelo piano.', 'deliano053@gmail.com', '949437675', NULL),
('Mariana Tabina Passagem Feitio', NULL, 'Teatro e Cinema', 'A representacção é uma forma de escape e ferramenta de transformacção social.', 'mariannafeitio0@gmail.com', '931194171', NULL),
('Abiú José Duas Horas Gabriel', 'Abiú', 'Desenho e Pintura', 'Arteista comprometido e apaixonado pelo desenho e pintura.', 'abiugabrielduashoras@gmail.com', '937051439', 'Director da área de desenho'),
('Justino Singorres', NULL, 'Literatura', 'Devemos fazer sim as coisas bem, porque todos os nossos actos têm sempre consequências.', 'Justinosingorres@gmail.com', '952719775 / 929 615 517', NULL),
('Lucrécia da Luz Vinte e Cinco', 'LUZ', 'Maquilhagem', 'Na arte da maquilhagem, cada pincelada é um sussurro de beleza que revela a força escondida em cada olhar.', 'daluzlucrecia@gmail.com', '939 023 547', NULL),
('Edmir Willian da Silva e Silva', NULL, 'Marketing, Comunicação e Imagem', 'Com imagens que falam e estratégias que conectam, revelamos ao mundo que os verdadeiros amantes da arte estão no Elit''arte.', 'edmir.w.s.silva@gmail.com', '933 700 135', NULL),
('Albertina José Joaquim', NULL, 'Música e Teatro', 'Como as lágrimas que escapam da alma, a arte transborda sentimentos que não cabem em palavras.', 'albertinajoaquim380@gmail.com', '939 292 461', NULL),
('Jessé de Natanael Cassange Quissanga', 'Papá lhe Chotó', 'Teatro e Cinema', 'Grandeza não é corpulência, mas sim o estado de espírito, a intrepidez vislumbrada no tamanho dos nossos ideais.', 'jessedenatanaelcassange@gmail.com', '925 064 560', NULL),
('Oyono Fernandes', 'TiaZita', 'Teatro e Cinema', 'Atuar é viver várias vidas, é descobrir diferentes personalidades e realidades de forma artística. É lindo!', 'Oyonorodolfo@gmail.com', '941514388', NULL),
('Maria Goreth Gaspar João', NULL, 'Comunicação', 'A área da comunicação é onde o apresentador se conecta com o público, transmite energia, emoção e guia cada momento do evento, fazendo todos sentirem a experiência de forma única.', 'mariagoreth93811@gmail.com', '938116151 / 955910284', NULL),
('Verónica Jucas Miguel', NULL, 'Apresentação e Comunicação', 'O que quer que você faça, faça bem feito', 'veramiguelita@gmail.com', '+244925129006', NULL)
ON CONFLICT (email) DO NOTHING;

-- Verificar dados inseridos
SELECT COUNT(*) as total_artistas FROM artists;
