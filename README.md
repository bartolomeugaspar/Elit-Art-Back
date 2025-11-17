# 🎭 Elit'Arte Backend API

Backend API para o projeto Elit'Arte - Movimento Arteístico angolano.

## 🚀 Tecnologias

- **Node.js** com Express.js
- **TypeScript** para type safety
- **MongoDB** com Mongoose
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **express-validator** para validação

## 📋 Pré-requisitos

- Node.js 18+
- MongoDB local ou remoto
- npm ou yarn

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/bArteolomeugaspar/Elit-Arte-Back.git

# Entre no diretório
cd Elit-Arte-Back

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

## ⚙️ Configuração

Edite o arquivo `.env` com suas configurações:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/elit-Arte
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

## 🏃 Executar

### Desenvolvimento
```bash
npm run dev
```

### Build para produção
```bash
npm run build
npm stArte
```

## 📚 Estrutura do Projeto

```
src/
├── config/
│   └── database.ts          # Configuração do MongoDB
├── models/
│   ├── User.ts              # Modelo de usuário
│   ├── Event.ts             # Modelo de evento
│   ├── Registration.ts      # Modelo de inscrição
│   ├── Testimonial.ts       # Modelo de depoimento
│   └── Newsletter.ts        # Modelo de newsletter
├── services/
│   ├── AuthService.ts       # Lógica de autenticação
│   ├── EventService.ts      # Lógica de eventos
│   └── NewsletterService.ts # Lógica de newsletter
├── routes/
│   ├── auth.ts              # Rotas de autenticação
│   ├── events.ts            # Rotas de eventos
│   └── newsletter.ts        # Rotas de newsletter
├── middleware/
│   ├── auth.ts              # Middleware de autenticação
│   └── errorHandler.ts      # Middleware de erro
└── index.ts                 # Arquivo principal
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. 

### Fluxo de autenticação:

1. **Registrar**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. **Usar token**: Adicionar header `Authorization: Bearer {token}`

## 📡 Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obter usuário atual
- `PUT /api/auth/profile` - Atualizar perfil

### Eventos
- `GET /api/events` - Listar todos os eventos
- `GET /api/events/:id` - Obter evento por ID
- `GET /api/events/search/:query` - Pesquisar eventos
- `POST /api/events` - Criar evento (admin/Arteist)
- `PUT /api/events/:id` - Atualizar evento
- `DELETE /api/events/:id` - Deletar evento
- `POST /api/events/:id/register` - Inscrever-se em evento
- `DELETE /api/events/registrations/:registrationId` - Cancelar inscrição
- `GET /api/events/:id/registrations` - Listar inscrições do evento
- `GET /api/events/user/my-registrations` - Minhas inscrições
- `POST /api/events/:id/testimonials` - Adicionar depoimento
- `GET /api/events/:id/testimonials` - Listar depoimentos

### Newsletter
- `POST /api/newsletter/subscribe` - Inscrever-se
- `POST /api/newsletter/unsubscribe` - Desinscrever-se
- `GET /api/newsletter/subscribers` - Listar inscritos (admin)
- `GET /api/newsletter/count` - Contar inscritos (admin)

## 🧪 Exemplo de Requisições

### Registrar
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Criar Evento
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "title": "Workshop de Teatro",
    "description": "Workshop de técnicas teatrais",
    "category": "Workshop",
    "date": "2024-12-20",
    "time": "18:00",
    "location": "Luanda",
    "image": "https://example.com/image.jpg",
    "capacity": 50,
    "price": 0,
    "isFree": true
  }'
```

### Inscrever-se em Evento
```bash
curl -X POST http://localhost:5000/api/events/{eventId}/register \
  -H "Authorization: Bearer {token}"
```

## 🔄 Fluxo de Negócio

### Gestão de Eventos
1. Artistas  /Admin criam eventos
2. Usuários visualizam e pesquisam eventos
3. Usuários se inscrevem em eventos
4. Após evento, usuários podem deixar depoimentos
5. Admin aprova depoimentos

### Gestão de Inscrições
1. Usuário se inscreve em evento
2. Vagas disponíveis são decrementadas
3. Usuário pode cancelar inscrição
4. Vagas são restauradas

### Newsletter
1. Usuários se inscrevem na newsletter
2. Admin pode visualizar lista de inscritos
3. Usuários podem desinscrever-se

## 🛡️ Segurança

- Senhas são criptografadas com bcryptjs
- JWT com expiração configurável
- Validação de entrada com express-validator
- CORS configurado
- Autorização baseada em roles

## 📝 Roles de Usuário

- **user**: Usuário comum (pode se inscrever em eventos)
- **Arteist**: Arteista (pode criar eventos)
- **admin**: Administrador (acesso total)

## 🚀 Deploy

### Heroku
```bash
git push heroku main
```

### Railway/Render
Conecte seu repositório GitHub e configure as variáveis de ambiente.

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe Elit'Arte.

---

**© 2024 Elit'Arte - Todos os direitos reservados**
