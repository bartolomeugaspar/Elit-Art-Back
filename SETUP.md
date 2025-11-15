# 🚀 Guia Rápido de Setup - Elit'Arte Backend

## 1️⃣ Instalação de Dependências

```bash
npm install
```

## 2️⃣ Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
- `MONGODB_URI`: URL do MongoDB
- `JWT_SECRET`: Chave secreta para JWT
- `FRONTEND_URL`: URL do frontend

## 3️⃣ Iniciar o Servidor

### Desenvolvimento
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

### Build para Produção
```bash
npm run build
npm stArte
```

## 4️⃣ Popular Banco de Dados (Opcional)

Para criar dados de exemplo:
```bash
npm run seed
```

Isso criará:
- 1 usuário admin
- 2 usuários Arteistas
- 2 usuários comuns
- 5 eventos de exemplo
- 3 inscritos na newsletter

**Credenciais de teste:**
- Admin: `admin@elit-Artee.com` / `admin123`
- Arteista: `faustino@elit-Artee.com` / `Arteist123`
- Usuário: `maria@example.com` / `user123`

## 5️⃣ Testar a API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Registrar Novo Usuário
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Seu Nome",
    "email": "seu@email.com",
    "password": "senha123"
  }'
```

### Fazer Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "password": "senha123"
  }'
```

## 📚 Documentação Completa

Veja `API_DOCUMENTATION.md` para documentação detalhada de todos os endpoints.

## 🔧 Troubleshooting

### MongoDB não conecta
- Verifique se MongoDB está rodando
- Confirme a URL em `.env`
- Para MongoDB local: `mongodb://localhost:27017/elit-Arte`

### Porta 5000 já em uso
- Mude a porta em `.env`: `PORT=5001`

### Erro de módulos
- Delete `node_modules` e `package-lock.json`
- Execute `npm install` novamente

## 📁 Estrutura Importante

```
src/
├── models/          # Schemas do MongoDB
├── services/        # Lógica de negócio
├── routes/          # Endpoints da API
├── middleware/      # Autenticação e erros
└── config/          # Configurações
```

## ✅ Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] MongoDB conectado
- [ ] JWT_SECRET alterado
- [ ] FRONTEND_URL correto
- [ ] npm run build sem erros
- [ ] Testes passando

---

**Pronto para começar! 🎉**
