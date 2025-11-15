# 🗄️ Setup Supabase - Elit'Arte Backend

## 1️⃣ Criar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha os dados:
   - **Project Name**: elit-Artee
   - **Database Password**: Escolha uma senha forte
   - **Region**: Escolha a mais próxima (ex: Europe - Dublin)
4. Clique em "Create new project"

## 2️⃣ Obter Credenciais

Após criar o projeto:

1. Vá para **Settings** → **API**
2. Copie:
   - `SUPABASE_URL` (Project URL)
   - `SUPABASE_ANON_KEY` (anon public)
   - `SUPABASE_SERVICE_ROLE_KEY` (service_role secret)

3. Atualize o arquivo `.env`:
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

## 3️⃣ Criar Tabelas

Vá para **SQL Editor** no Supabase e execute os seguintes scripts:

### Tabela: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_image VARCHAR(255),
  bio TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'Arteist', 'admin')),
  is_email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Tabela: events
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description VARCHAR(500) NOT NULL,
  full_description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Workshop', 'Exposição', 'Masterclass', 'Networking')),
  date VARCHAR(20) NOT NULL,
  time VARCHAR(10) NOT NULL,
  location VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  attendees INTEGER DEFAULT 0,
  available_spots INTEGER DEFAULT 0,
  price DECIMAL(10, 2) DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_date ON events(date);
```

### Tabela: registrations (Inscrições em Eventos)
```sql
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_method VARCHAR(50),
  notes VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);

CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_status ON registrations(status);
```

### Tabela: event_favorites (Eventos Favoritos)
```sql
CREATE TABLE event_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);

CREATE INDEX idx_event_favorites_user ON event_favorites(user_id);
CREATE INDEX idx_event_favorites_event ON event_favorites(event_id);
```

### Tabela: event_ratings (Avaliações Rápidas)
```sql
CREATE TABLE event_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);

CREATE INDEX idx_event_ratings_event ON event_ratings(event_id);
CREATE INDEX idx_event_ratings_user ON event_ratings(user_id);
```

### Tabela: newsletter
```sql
CREATE TABLE newsletter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  is_subscribed BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_newsletter_email ON newsletter(email);
CREATE INDEX idx_newsletter_subscribed ON newsletter(is_subscribed);
```

## 4️⃣ Configurar Row Level Security (RLS)

### Habilitar RLS para todas as tabelas

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
```

### Políticas de Acesso

#### Users - Leitura pública (sem senha)
```sql
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Public can read user profiles" ON users
  FOR SELECT USING (true);
```

#### Events - Leitura pública
```sql
CREATE POLICY "Anyone can read events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Arteists can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own events" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own events" ON events
  FOR DELETE USING (auth.uid() = organizer_id);
```

#### Registrations
```sql
CREATE POLICY "Users can read own registrations" ON registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Organizers can read event registrations" ON registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = registrations.event_id 
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can register for events" ON registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel own registrations" ON registrations
  FOR DELETE USING (auth.uid() = user_id);
```

#### Event Favorites (Favoritos)
```sql
CREATE POLICY "Users can read own favorites" ON event_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON event_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own favorites" ON event_favorites
  FOR DELETE USING (auth.uid() = user_id);
```

#### Event Ratings (Avaliações)
```sql
CREATE POLICY "Anyone can read event ratings" ON event_ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can create ratings" ON event_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" ON event_ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings" ON event_ratings
  FOR DELETE USING (auth.uid() = user_id);
```

#### Newsletter
```sql
CREATE POLICY "Anyone can subscribe" ON newsletter
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can unsubscribe" ON newsletter
  FOR UPDATE USING (true);
```

## 5️⃣ Atualizar Código

Agora o backend está pronto para usar Supabase!

### Instalar dependências
```bash
npm install
```

### Configurar .env
```bash
cp .env.example .env
# Editar com suas credenciais Supabase
```

### Iniciar servidor
```bash
npm run dev
```

## 6️⃣ Dados de Teste (Opcional)

Você pode inserir dados manualmente no Supabase ou criar um script de seed.

### Inserir usuário de teste
```sql
INSERT INTO users (name, email, password, role, is_email_verified) VALUES
('Admin Elit', 'admin@elit-Artee.com', '$2a$10$...', 'admin', true),
('Faustino', 'faustino@elit-Artee.com', '$2a$10$...', 'Arteist', true);
```

## 🔐 Segurança

- ✅ RLS habilitado em todas as tabelas
- ✅ Senhas criptografadas com bcryptjs
- ✅ JWT para autenticação
- ✅ Índices para performance
- ✅ Foreign keys para integridade

## 📊 Estrutura de Dados

### Tabelas Principais

```
users (Usuários)
├── id (UUID)
├── name
├── email (único)
├── password (criptografada)
├── phone, profile_image, bio
├── role (user, Arteist, admin)
├── is_email_verified, is_active
└── timestamps

events (Eventos)
├── id (UUID)
├── title, description, full_description
├── category (Workshop, Exposição, Masterclass, Networking)
├── date, time, location
├── image, images[]
├── capacity, attendees, available_spots
├── price, is_free
├── status (upcoming, ongoing, completed, cancelled)
├── organizer_id (FK users)
└── timestamps

registrations (Inscrições em Eventos)
├── id (UUID)
├── user_id (FK users)
├── event_id (FK events)
├── status (registered, attended, cancelled)
├── registration_date
├── payment_status (pending, completed, failed)
├── payment_method, notes
└── timestamps

event_favorites (Eventos Favoritos)
├── id (UUID)
├── user_id (FK users)
├── event_id (FK events)
└── created_at

event_ratings (Avaliações Rápidas)
├── id (UUID)
├── user_id (FK users)
├── event_id (FK events)
├── rating (1-5)
└── timestamps

newsletter (Newsletter)
├── id (UUID)
├── email (único)
├── is_subscribed
├── subscribed_at, unsubscribed_at
└── timestamps
```

### Relacionamentos

```
users ──────┬──→ events (organizer_id)
            ├──→ registrations (user_id)
            ├──→ event_favorites (user_id)
            └──→ event_ratings (user_id)

events ─────┬──→ registrations (event_id)
            ├──→ event_favorites (event_id)
            └──→ event_ratings (event_id)
```

## 🚀 Próximos Passos

1. Instalar dependências: `npm install`
2. Configurar `.env` com credenciais Supabase
3. Iniciar servidor: `npm run dev`
4. Testar endpoints com Postman/Insomnia

---

**Pronto para usar Supabase! 🎉**
