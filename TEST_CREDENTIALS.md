# 🔐 Credenciais de Teste - Elit'Arte Backend

## ✅ Usuários Criados no Sistema

Todos os usuários foram criados com sucesso no Supabase. Use as credenciais abaixo para testar a API.

### 👨‍💼 Admin
- **Email**: `admin@elit-arte.com`
- **Senha**: `admin123`
- **Role**: `admin`
- **ID**: `d257d4c4-21ca-414d-9ced-d01719cf8f5f`

### 🎭 Artista 1 - Faustino Domingos
- **Email**: `faustino@elit-arte.com`
- **Senha**: `artist123`
- **Role**: `artist`
- **ID**: `55e8dc26-db72-447c-a08a-152000145269`
- **Bio**: Fundador e Diretor Geral do Elit'Arte

### 🎭 Artista 2 - Josemara Comongo
- **Email**: `josemara@elit-arte.com`
- **Senha**: `artist123`
- **Role**: `artist`
- **ID**: `e7906713-7ef2-4291-a8da-5dd4e05dea98`
- **Bio**: Co-fundadora do Elit'Arte

### 👤 Usuário Regular 1 - Maria Silva
- **Email**: `maria@example.com`
- **Senha**: `user123`
- **Role**: `user`
- **ID**: `fe168db4-152d-44c1-96a0-99db34f83e16`

### 👤 Usuário Regular 2 - João Santos
- **Email**: `joao@example.com`
- **Senha**: `user123`
- **Role**: `user`
- **ID**: `5ce07f45-0ae7-4ae2-9e2d-eb806cb30c53`

---

## 🧪 Testando a API

### 1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@elit-arte.com","password":"admin123"}'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "d257d4c4-21ca-414d-9ced-d01719cf8f5f",
    "name": "Admin Elit",
    "email": "admin@elit-arte.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Obter Dados do Usuário Autenticado
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Listar Eventos
```bash
curl -X GET http://localhost:5000/api/events
```

---

## 📊 Dados Criados

### Eventos
- ✅ Workshop de Teatro Contemporâneo (Faustino)
- ✅ Exposição de Arte Angolana (Josemara)
- ✅ Masterclass de Dança Tradicional (Faustino)
- ✅ Networking de Artistas (Admin)
- ✅ Concerto de Música Angolana (Josemara)

### Newsletter
- ✅ 3 inscritos de teste

---

## 🚀 Próximos Passos

1. Use o token JWT retornado no login para autenticar outras requisições
2. Teste os endpoints de eventos, registros e newsletter
3. Consulte `/api-docs` para documentação completa do Swagger

---

## 📝 Notas

- Todos os usuários têm `is_email_verified: true`
- As senhas estão criptografadas com bcryptjs
- Os tokens JWT expiram em 7 dias (configurável em `.env`)
- O CORS está configurado para aceitar requisições do frontend em `http://localhost:3000`

