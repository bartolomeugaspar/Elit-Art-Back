# ⚡ Quick Start - Elit'Arte Backend com Supabase

## 🚀 Em 5 Minutos

### 1. Criar Projeto Supabase
```
1. Acesse supabase.com
2. Clique "New Project"
3. Preencha os dados e crie
4. Copie as credenciais (Settings → API)
```

### 2. Configurar Backend
```bash
# Clone ou entre no diretório
cd Elit-Art-Back

# Configure as variáveis
cp .env.example .env

# Edite .env com suas credenciais Supabase:
# SUPABASE_URL=https://seu-projeto.supabase.co
# SUPABASE_ANON_KEY=sua_chave_anon
# SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

### 3. Criar Tabelas no Supabase
```
1. Abra Supabase Dashboard
2. Vá para SQL Editor
3. Copie e execute os scripts de SUPABASE_SETUP.md
   (ou execute o arquivo inteiro de uma vez)
```

### 4. Instalar e Iniciar
```bash
npm install
npm run dev
```

**Pronto! 🎉 Servidor rodando em http://localhost:5000**

---

## 📡 Testar Endpoints

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Registrar Usuário
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Listar Eventos
```bash
curl http://localhost:5000/api/events
```

---

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `SUPABASE_SETUP.md` | Scripts SQL para criar tabelas |
| `API_DOCUMENTATION.md` | Documentação completa da API |
| `FRONTEND_INTEGRATION.md` | Como integrar com frontend |
| `README.md` | Documentação principal |

---

## 🔧 Troubleshooting

**Erro: "Missing Supabase environment variables"**
- Verifique se `.env` tem `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`

**Erro: "Connection refused"**
- Verifique se as credenciais Supabase estão corretas
- Verifique se as tabelas foram criadas

**Porta 5000 já em uso**
- Mude em `.env`: `PORT=5001`

---

## 📚 Próximos Passos

1. ✅ Backend rodando
2. 📱 Conectar frontend
3. 🔐 Implementar autenticação
4. 🎪 Criar eventos
5. 📧 Testar newsletter

---

**Documentação completa em `README.md` e `API_DOCUMENTATION.md`**
