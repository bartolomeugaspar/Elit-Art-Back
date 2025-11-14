# 📸 Guia de Upload de Imagens - Elit'Arte Backend

## Visão Geral

O sistema suporta **dois métodos** para adicionar imagens ao cadastrar eventos:

1. **URL de Imagem** - Usar uma URL externa (Unsplash, Cloudinary, etc)
2. **Upload de Arquivo** - Fazer upload da imagem diretamente

---

## 1️⃣ Método 1: Usar URL de Imagem (Recomendado)

### Passo 1: Obter URL da Imagem

Use qualquer serviço de imagens online:
- **Unsplash**: https://unsplash.com
- **Pexels**: https://www.pexels.com
- **Pixabay**: https://pixabay.com
- **Cloudinary**: https://cloudinary.com

### Passo 2: Criar Evento com URL

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Workshop de Pintura",
    "description": "Aprenda pintura moderna",
    "fullDescription": "Um workshop intensivo de pintura moderna",
    "category": "Workshop",
    "date": "15 de Dezembro, 2024",
    "time": "14:00 - 17:00",
    "location": "Lisboa",
    "image": "https://images.unsplash.com/photo-1561214115-6d2f1b0609fa?w=500",
    "capacity": 30
  }'
```

---

## 2️⃣ Método 2: Upload de Arquivo

### Passo 1: Fazer Upload da Imagem

```bash
curl -X POST http://localhost:5000/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/caminho/para/sua/imagem.jpg"
```

**Resposta:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "http://localhost:5000/uploads/images/abc123def456.jpg",
  "filename": "abc123def456.jpg"
}
```

### Passo 2: Usar a URL Retornada para Criar Evento

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Workshop de Pintura",
    "description": "Aprenda pintura moderna",
    "fullDescription": "Um workshop intensivo de pintura moderna",
    "category": "Workshop",
    "date": "15 de Dezembro, 2024",
    "time": "14:00 - 17:00",
    "location": "Lisboa",
    "image": "http://localhost:5000/uploads/images/abc123def456.jpg",
    "capacity": 30
  }'
```

---

## 📋 Requisitos do Upload

### Tipos de Arquivo Aceitos
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ✅ GIF (.gif)

### Tamanho Máximo
- **5 MB** por arquivo

### Validações
- Arquivo obrigatório
- Apenas imagens permitidas
- Nomes de arquivo são gerados automaticamente (UUID)

---

## 🔐 Autenticação

Ambos os endpoints requerem autenticação:

```bash
# 1. Fazer login
TOKEN=$(curl -s http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@elit-arte.com","password":"admin123"}' | jq -r '.token')

# 2. Usar token nos requests
curl -X POST http://localhost:5000/api/upload/image \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@imagem.jpg"
```

---

## 📝 Exemplo Completo (Frontend)

### JavaScript/TypeScript

```typescript
// 1. Upload de imagem
async function uploadImage(file: File, token: string) {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch('http://localhost:5000/api/upload/image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })

  const data = await response.json()
  return data.imageUrl
}

// 2. Criar evento com imagem
async function createEvent(eventData: any, token: string) {
  const response = await fetch('http://localhost:5000/api/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  })

  return await response.json()
}

// 3. Uso
const file = document.getElementById('imageInput').files[0]
const imageUrl = await uploadImage(file, token)

const event = await createEvent({
  title: 'Meu Evento',
  description: 'Descrição',
  image: imageUrl,
  // ... outros campos
}, token)
```

---

## 🗂️ Estrutura de Diretórios

```
projeto/
├── uploads/
│   └── images/
│       ├── abc123def456.jpg
│       ├── xyz789uvw012.png
│       └── ...
├── src/
│   ├── config/
│   │   └── multer.ts
│   ├── services/
│   │   └── UploadService.ts
│   ├── routes/
│   │   └── upload.ts
│   └── ...
└── ...
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# .env
API_URL=http://localhost:5000
PORT=5000
```

### Limite de Tamanho

Para alterar o limite de tamanho, edite `src/config/multer.ts`:

```typescript
limits: {
  fileSize: 10 * 1024 * 1024, // 10MB
}
```

---

## 🚀 Dicas

1. **Use URLs externas** para melhor performance
2. **Comprima imagens** antes de fazer upload
3. **Use formatos modernos** como WebP quando possível
4. **Teste com Postman** ou **Insomnia** antes de integrar no frontend

---

## ❌ Erros Comuns

| Erro | Solução |
|------|---------|
| `No image file provided` | Verifique se está usando `-F "image=@arquivo"` |
| `Only image files are allowed` | Use apenas JPEG, PNG, WebP ou GIF |
| `File too large` | Reduza o tamanho da imagem (máx 5MB) |
| `401 Unauthorized` | Verifique se o token está correto |

---

## 📚 Referências

- [Multer Documentation](https://github.com/expressjs/multer)
- [Express Static Files](https://expressjs.com/en/starter/static-files.html)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

