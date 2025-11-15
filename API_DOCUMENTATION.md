# 📚 Documentação da API Elit'Arte

## Base URL
```
http://localhost:5000/api
```

## 🔐 Autenticação

Todos os endpoints protegidos requerem um token JWT no header:
```
Authorization: Bearer {token}
```

---

## 👤 Autenticação (Auth)

### 1. Registrar Novo Usuário
**POST** `/auth/register`

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login
**POST** `/auth/login`

**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Obter Usuário Atual
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user",
    "profileImage": null,
    "bio": null,
    "isEmailVerified": true,
    "isActive": true
  }
}
```

---

### 4. Atualizar Perfil
**PUT** `/auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "João Silva Updated",
  "bio": "Arteista apaixonado por teatro"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "João Silva Updated",
    "email": "joao@example.com",
    "bio": "Arteista apaixonado por teatro"
  }
}
```

---

## 🎪 Eventos (Events)

### 1. Listar Todos os Eventos
**GET** `/events`

**Query Parameters:**
- `category` (opcional): Workshop, Exposição, Masterclass, Networking
- `status` (opcional): upcoming, ongoing, completed, cancelled

**Example:**
```
GET /events?category=Workshop&status=upcoming
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "events": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Workshop de Teatro",
      "description": "Aprenda técnicas de teatro",
      "category": "Workshop",
      "date": "2024-12-20",
      "time": "18:00",
      "location": "Luanda",
      "image": "https://example.com/image.jpg",
      "capacity": 30,
      "attendees": 15,
      "availableSpots": 15,
      "price": 0,
      "isFree": true,
      "status": "upcoming"
    }
  ]
}
```

---

### 2. Obter Evento por ID
**GET** `/events/:id`

**Response (200):**
```json
{
  "success": true,
  "event": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Workshop de Teatro",
    "description": "Aprenda técnicas de teatro",
    "fullDescription": "Um workshop intensivo...",
    "category": "Workshop",
    "date": "2024-12-20",
    "time": "18:00",
    "location": "Luanda",
    "image": "https://example.com/image.jpg",
    "images": ["https://example.com/image1.jpg"],
    "capacity": 30,
    "attendees": 15,
    "availableSpots": 15,
    "price": 0,
    "isFree": true,
    "status": "upcoming",
    "organizer": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "Faustino Domingos",
      "email": "faustino@elit-Artee.com"
    }
  }
}
```

---

### 3. Pesquisar Eventos
**GET** `/events/search/:query`

**Example:**
```
GET /events/search/teatro
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "events": [...]
}
```

---

### 4. Criar Evento
**POST** `/events`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Workshop de Teatro",
  "description": "Aprenda técnicas de teatro",
  "fullDescription": "Um workshop intensivo de 4 horas...",
  "category": "Workshop",
  "date": "2024-12-20",
  "time": "18:00",
  "location": "Luanda",
  "image": "https://example.com/image.jpg",
  "capacity": 30,
  "price": 0,
  "isFree": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Workshop de Teatro",
    ...
  }
}
```

---

### 5. Atualizar Evento
**PUT** `/events/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "title": "Workshop de Teatro Avançado",
  "capacity": 50
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Event updated successfully",
  "event": {...}
}
```

---

### 6. Deletar Evento
**DELETE** `/events/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

### 7. Inscrever-se em Evento
**POST** `/events/:id/register`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registered successfully",
  "registration": {
    "_id": "507f1f77bcf86cd799439013",
    "user": "507f1f77bcf86cd799439011",
    "event": "507f1f77bcf86cd799439012",
    "status": "registered",
    "registrationDate": "2024-12-01T10:00:00Z",
    "paymentStatus": "completed"
  }
}
```

---

### 8. Cancelar Inscrição
**DELETE** `/events/registrations/:registrationId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

---

### 9. Listar Inscrições do Evento
**GET** `/events/:id/registrations`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "count": 15,
  "registrations": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "João Silva",
        "email": "joao@example.com"
      },
      "event": "507f1f77bcf86cd799439012",
      "status": "registered",
      "registrationDate": "2024-12-01T10:00:00Z"
    }
  ]
}
```

---

### 10. Minhas Inscrições
**GET** `/events/user/my-registrations`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "registrations": [...]
}
```

---

### 11. Adicionar Depoimento
**POST** `/events/:id/testimonials`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "rating": 5,
  "comment": "Evento excelente, muito aprendi!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Testimonial added successfully",
  "testimonial": {
    "_id": "507f1f77bcf86cd799439014",
    "author": "507f1f77bcf86cd799439011",
    "event": "507f1f77bcf86cd799439012",
    "rating": 5,
    "comment": "Evento excelente, muito aprendi!",
    "isApproved": false
  }
}
```

---

### 12. Listar Depoimentos do Evento
**GET** `/events/:id/testimonials`

**Response (200):**
```json
{
  "success": true,
  "count": 8,
  "testimonials": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "João Silva",
        "profileImage": null
      },
      "event": "507f1f77bcf86cd799439012",
      "rating": 5,
      "comment": "Evento excelente!",
      "isApproved": true
    }
  ]
}
```

---

## 📧 Newsletter

### 1. Inscrever-se na Newsletter
**POST** `/newsletter/subscribe`

**Request:**
```json
{
  "email": "subscriber@example.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Subscribed successfully",
  "subscriber": {
    "_id": "507f1f77bcf86cd799439015",
    "email": "subscriber@example.com",
    "isSubscribed": true,
    "subscribedAt": "2024-12-01T10:00:00Z"
  }
}
```

---

### 2. Desinscrever-se da Newsletter
**POST** `/newsletter/unsubscribe`

**Request:**
```json
{
  "email": "subscriber@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Unsubscribed successfully"
}
```

---

### 3. Listar Inscritos (Admin)
**GET** `/newsletter/subscribers`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "success": true,
  "count": 150,
  "subscribers": [...]
}
```

---

### 4. Contar Inscritos (Admin)
**GET** `/newsletter/count`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "success": true,
  "count": 150
}
```

---

## ⚠️ Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token inválido ou ausente |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro do servidor |

---

## 🔑 Roles de Usuário

- **user**: Usuário comum
- **Arteist**: Arteista (pode criar eventos)
- **admin**: Administrador (acesso total)

---

## 📝 Validações

### Email
- Deve ser um email válido
- Deve ser único no sistema

### Senha
- Mínimo 6 caracteres
- Será criptografada antes de salvar

### Evento
- Título: obrigatório, máximo 200 caracteres
- Descrição: obrigatório, máximo 500 caracteres
- Categoria: Workshop, Exposição, Masterclass ou Networking
- Capacidade: mínimo 1

### Depoimento
- Rating: 1-5
- Comentário: obrigatório, máximo 1000 caracteres

---

## 🧪 Exemplos com cURL

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

### Listar Eventos
```bash
curl -X GET http://localhost:5000/api/events
```

### Inscrever-se em Evento
```bash
curl -X POST http://localhost:5000/api/events/507f1f77bcf86cd799439012/register \
  -H "Authorization: Bearer {token}"
```

---

**Última atualização:** Dezembro 2024
