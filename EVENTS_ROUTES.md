# Rotas de Eventos - Elit'Arte API

## Resumo das Rotas

### 1. Listar Todos os Eventos
- **Método:** GET
- **Rota:** `/api/events`
- **Autenticação:** Não requerida
- **Parâmetros de Query:**
  - `category` (opcional): 'Workshop', 'Exposição', 'Masterclass', 'Networking'
  - `status` (opcional): 'upcoming', 'ongoing', 'completed', 'cancelled'
- **Resposta:** Lista de eventos

### 2. Obter Evento por ID
- **Método:** GET
- **Rota:** `/api/events/{id}`
- **Autenticação:** Não requerida
- **Parâmetros:**
  - `id` (path): UUID do evento
- **Resposta:** Detalhes do evento

### 3. Buscar Eventos
- **Método:** GET
- **Rota:** `/api/events/search/{query}`
- **Autenticação:** Não requerida
- **Parâmetros:**
  - `query` (path): Termo de busca
- **Resposta:** Lista de eventos encontrados

### 4. Criar Novo Evento
- **Método:** POST
- **Rota:** `/api/events`
- **Autenticação:** Requerida (Bearer Token)
- **Permissões:** Admin ou Arteist
- **Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "fullDescription": "string (opcional)",
    "category": "Workshop|Exposição|Masterclass|Networking",
    "date": "string",
    "time": "string",
    "location": "string",
    "image": "string (URL)",
    "capacity": "integer",
    "price": "number (opcional)",
    "isFree": "boolean (opcional)"
  }
  ```
- **Resposta:** Evento criado

### 5. Atualizar Evento
- **Método:** PUT
- **Rota:** `/api/events/{id}`
- **Autenticação:** Requerida
- **Permissões:** Organizador do evento ou Admin
- **Parâmetros:**
  - `id` (path): UUID do evento
- **Body:** Campos a atualizar (todos opcionais)
- **Resposta:** Evento atualizado

### 6. Deletar Evento
- **Método:** DELETE
- **Rota:** `/api/events/{id}`
- **Autenticação:** Requerida
- **Permissões:** Organizador do evento ou Admin
- **Parâmetros:**
  - `id` (path): UUID do evento
- **Resposta:** Mensagem de sucesso

### 7. Registrar em Evento
- **Método:** POST
- **Rota:** `/api/events/{id}/register`
- **Autenticação:** Requerida
- **Parâmetros:**
  - `id` (path): UUID do evento
- **Resposta:** Registro criado

### 8. Cancelar Registro
- **Método:** DELETE
- **Rota:** `/api/events/registrations/{registrationId}`
- **Autenticação:** Requerida
- **Parâmetros:**
  - `registrationId` (path): UUID do registro
- **Resposta:** Mensagem de sucesso

### 9. Obter Registros do Evento
- **Método:** GET
- **Rota:** `/api/events/{id}/registrations`
- **Autenticação:** Requerida
- **Permissões:** Organizador do evento ou Admin
- **Parâmetros:**
  - `id` (path): UUID do evento
- **Resposta:** Lista de registros

### 10. Obter Meus Registros
- **Método:** GET
- **Rota:** `/api/events/user/my-registrations`
- **Autenticação:** Requerida
- **Resposta:** Lista de meus registros

### 11. Adicionar Depoimento
- **Método:** POST
- **Rota:** `/api/events/{id}/testimonials`
- **Autenticação:** Requerida
- **Parâmetros:**
  - `id` (path): UUID do evento
- **Body:**
  ```json
  {
    "rating": "integer (1-5)",
    "comment": "string"
  }
  ```
- **Resposta:** Depoimento criado

### 12. Obter Depoimentos do Evento
- **Método:** GET
- **Rota:** `/api/events/{id}/testimonials`
- **Autenticação:** Não requerida
- **Parâmetros:**
  - `id` (path): UUID do evento
- **Resposta:** Lista de depoimentos

## Códigos de Status HTTP

- **200:** Sucesso (GET, PUT, DELETE)
- **201:** Criado com sucesso (POST)
- **400:** Dados inválidos
- **401:** Não autenticado
- **403:** Sem permissão
- **404:** Recurso não encontrado

## Autenticação

Para rotas que requerem autenticação, envie o token JWT no header:
```
Authorization: Bearer <seu_token_jwt>
```

## Exemplo de Uso

### Listar eventos
```bash
curl http://localhost:5000/api/events
```

### Criar evento
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Workshop de Arte",
    "description": "Um workshop incrível",
    "category": "Workshop",
    "date": "2025-12-15",
    "time": "14:00",
    "location": "Luanda",
    "image": "https://example.com/image.jpg",
    "capacity": 50
  }'
```

### Registrar em evento
```bash
curl -X POST http://localhost:5000/api/events/{id}/register \
  -H "Authorization: Bearer <token>"
```
