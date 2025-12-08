-- Insert team leaders (administrative members) with show_in_public = false
-- These members should appear in the admin section but not in "Artistas do Movimento"

-- First, run the migration to add the column if not done yet
-- ALTER TABLE artists ADD COLUMN IF NOT EXISTS show_in_public BOOLEAN DEFAULT true;

-- Insert Faustino Domingos (already exists as leader in TeamSection)
INSERT INTO artists (
  name, 
  artistic_name, 
  area, 
  description, 
  email, 
  phone, 
  role,
  show_in_public
) 
VALUES (
  'Faustino Domingos',
  'Guido Alves',
  'Literatura e Cinema',
  'Coordenador do Elit''Arte, director da área do cinema e fundador. Formacção Artística em teatro (15+ anos) e cinema. "Gosto tanto de escrever quanto gosto de comer, é uma necessidade vital para a minha alma."',
  'faustinodomingos83@hotmail.com',
  '927935543',
  'Coordenador',
  false
)
ON CONFLICT (email) DO UPDATE SET
  artistic_name = EXCLUDED.artistic_name,
  area = EXCLUDED.area,
  description = EXCLUDED.description,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  show_in_public = false;

-- Insert Josemara Comongo
INSERT INTO artists (
  name, 
  artistic_name, 
  area, 
  description, 
  email, 
  phone, 
  role,
  show_in_public
) 
VALUES (
  'Josemara Comongo',
  'Maíris de Jesus',
  'Literatura',
  'Porta-voz, directora da área da literatura e fundadora. Vencedora do Concurso Literário ''Quem me dera ser onda'' 2019. "Sou a literatura que dança nas páginas da nossa história angolana."',
  'mairisdejesus.mj@gmail.com',
  '936346918',
  'Porta-voz',
  false
)
ON CONFLICT (email) DO UPDATE SET
  artistic_name = EXCLUDED.artistic_name,
  area = EXCLUDED.area,
  description = EXCLUDED.description,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  show_in_public = false;

-- Insert Luísa Gonçalves
INSERT INTO artists (
  name, 
  artistic_name, 
  area, 
  description, 
  email, 
  phone, 
  role,
  show_in_public
) 
VALUES (
  'Luísa Gonçalves',
  'Mulher Rei',
  'Teatro e Cinema',
  'Tesoureira e fundadora. Actriz de teatro e cinema, estudante de pedagogia no Magistério Marista. "Representar, para mim, é Vida, e a ''Vida só é vida quando é vivida com vida''."',
  'luisacarolina@gamil.com',
  '930729860',
  'Tesoureira',
  false
)
ON CONFLICT (email) DO UPDATE SET
  artistic_name = EXCLUDED.artistic_name,
  area = EXCLUDED.area,
  description = EXCLUDED.description,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  show_in_public = false;
