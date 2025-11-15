# 📚 Guia Swagger - Elit'Arte API

## 🚀 Acessar Swagger UI

Após iniciar o servidor com `npm run dev`, acesse:

```
http://localhost:5000/api-docs
```

## 🎯 O que é Swagger?

Swagger (OpenAPI) é uma ferramenta que:
- ✅ Documenta automaticamente sua API
- ✅ Permite testar endpoints diretamente
- ✅ Gera especificações padronizadas
- ✅ Facilita integração com frontend

## 📖 Documentação Disponível

### 🔐 Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `GET /auth/me` - Obter usuário atual
- `PUT /auth/profile` - Atualizar perfil

### 🎪 Eventos
- `GET /events` - Listar eventos
- `GET /events/{id}` - Detalhes do evento
- `GET /events/search/{query}` - Pesquisar
- `POST /events` - Criar evento
- `PUT /events/{id}` - Atualizar evento
- `DELETE /events/{id}` - Deletar evento
- `POST /events/{id}/register` - Inscrever-se
- `DELETE /events/registrations/{id}` - Cancelar inscrição
- `GET /events/{id}/registrations` - Listar inscrições
- `GET /events/user/my-registrations` - Minhas inscrições
- `POST /events/{id}/testimonials` - Adicionar depoimento
- `GET /events/{id}/testimonials` - Listar depoimentos

### 📧 Newsletter
- `POST /newsletter/subscribe` - Inscrever-se
- `POST /newsletter/unsubscribe` - Desinscrever-se
- `GET /newsletter/subscribers` - Listar (admin)
- `GET /newsletter/count` - Contar (admin)

## 🧪 Como Testar Endpoints

### 1. Registrar Usuário
1. Abra Swagger UI
2. Clique em **Autenticação** → **POST /auth/register**
3. Clique em **Try it out**
4. Preencha os dados:
   ```json
   {
     "name": "João Silva",
     "email": "joao@example.com",
     "password": "senha123"
   }
   ```
5. Clique em **Execute**
6. Copie o `token` da resposta

### 2. Fazer Login
1. Clique em **POST /auth/login**
2. Clique em **Try it out**
3. Preencha:
   ```json
   {
     "email": "joao@example.com",
     "password": "senha123"
   }
   ```
4. Clique em **Execute**
5. Copie o `token`

### 3. Usar Token em Endpoints Protegidos
1. Clique no botão **Authorize** (cadeado no topo)
2. Cole o token no campo:
   ```
   Bearer seu_token_aqui
   ```
3. Clique em **Authorize**
4. Agora todos os endpoints protegidos funcionarão

### 4. Testar Endpoint Protegido
1. Clique em **GET /auth/me**
2. Clique em **Try it out**
3. Clique em **Execute**
4. Você verá seus dados de usuário

## 📝 Estrutura de Resposta

### Sucesso (200/201)
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... }
}
```

### Erro (400/401/403/404)
```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Detalhes técnicos"
}
```

## 🔑 Autenticação com Bearer Token

Todos os endpoints protegidos requerem:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

No Swagger, use o botão **Authorize** para adicionar o token automaticamente.

## 📊 Schemas Disponíveis

### User
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "user|Arteist|admin",
  "profileImage": "string",
  "bio": "string",
  "isEmailVerified": "boolean",
  "isActive": "boolean"
}
```

### Event
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "category": "Workshop|Exposição|Masterclass|Networking",
  "date": "string",
  "time": "string",
  "location": "string",
  "image": "string",
  "capacity": "integer",
  "attendees": "integer",
  "availableSpots": "integer",
  "price": "number",
  "isFree": "boolean",
  "status": "upcoming|ongoing|completed|cancelled"
}
```

### Registration
```json
{
  "id": "uuid",
  "userId": "uuid",
  "eventId": "uuid",
  "status": "registered|attended|cancelled",
  "paymentStatus": "pending|completed|failed"
}
```

### Testimonial
```json
{
  "id": "uuid",
  "authorId": "uuid",
  "eventId": "uuid",
  "rating": "1-5",
  "comment": "string",
  "isApproved": "boolean"
}
```

## 🔍 Filtros e Parâmetros

### Listar Eventos com Filtros
```
GET /events?category=Workshop&status=upcoming
```

### Pesquisar Eventos
```
GET /events/search/teatro
```

## 💡 Dicas

1. **Salve o Token**: Copie o token após login para reutilizar
2. **Use Authorize**: Clique no botão Authorize para adicionar token automaticamente
3. **Teste Localmente**: Primeiro teste em `localhost:5000`
4. **Verifique Respostas**: Leia as respostas para entender a estrutura
5. **Consulte Schemas**: Veja os schemas para entender os tipos de dados

## 🚀 Deploy

Quando fazer deploy, o Swagger estará disponível em:
```
https://seu-dominio.com/api-docs
```

## 📚 Arquivos Swagger

```
src/
├── config/
│   └── swagger.ts              # Configuração principal
├── swagger/
│   ├── auth.swagger.ts         # Documentação Auth
│   ├── events.swagger.ts       # Documentação Events
│   └── newsletter.swagger.ts   # Documentação Newsletter
```

## 🔗 Links Úteis

- [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Swagger Editor](https://editor.swagger.io/)

---

**Pronto para explorar a API! 🎉**
