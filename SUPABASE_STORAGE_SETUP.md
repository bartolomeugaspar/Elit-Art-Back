# Supabase Storage Setup - Upload em Produção

## Problema Resolvido

Anteriormente, o backend falhava em produção (Vercel) com erro:
```
File uploads are not supported in production. Use cloud storage instead.
```

Agora, todos os uploads são feitos para **Supabase Storage**, funcionando em desenvolvimento e produção.

## Solução Implementada

### Backend Changes

1. **Multer Configuration** (`/src/config/multer.ts`)
   - Alterado de `diskStorage` para `memoryStorage`
   - Arquivos são carregados em memória (buffer) ao invés de disco
   - Funciona em ambientes serverless como Vercel

2. **New Service** (`/src/services/SupabaseStorageService.ts`)
   - `uploadImage()` - Upload para Supabase Storage
   - `deleteImage()` - Delete de imagens
   - `checkBucketAccess()` - Verifica se bucket existe

3. **Upload Route** (`/src/routes/upload.ts`)
   - Atualizado para usar `SupabaseStorageService`
   - Retorna URL pública do Supabase

## Setup Passo a Passo

### 1. Criar Bucket no Supabase

1. Acesse https://supabase.com e faça login
2. Vá para seu projeto Elit-Art
3. Clique em **Storage** na sidebar esquerda
4. Clique em **Create a new bucket**
5. Configure:
   - **Name**: `event-images`
   - **Privacy**: `Public` (para imagens serem acessíveis)
6. Clique **Create bucket**

### 2. Configurar RLS (Row Level Security)

Após criar o bucket, configure as políticas:

1. Clique no bucket `event-images`
2. Vá para a aba **Policies**
3. Clique **New Policy** e selecione **For full customization**
4. Configure:
   - **Name**: `Allow public read`
   - **Operation**: `SELECT`
   - **Target role**: `public`
   - **USING expression**: `true`
5. Clique **Review** e depois **Save policy**

6. Clique **New Policy** novamente
7. Configure:
   - **Name**: `Allow authenticated upload`
   - **Operation**: `INSERT`
   - **Target role**: `authenticated`
   - **WITH CHECK expression**: `true`
8. Clique **Review** e depois **Save policy**

### 3. Testar em Desenvolvimento

```bash
cd /home/kali/Documentos/Elit-Art-Back
npm run dev
```

#### Opção 1: Upload de Arquivo

```bash
curl -X POST http://localhost:5000/api/upload/image \
  -F "image=@/caminho/para/imagem.jpg"
```

#### Opção 2: Upload de URL

```bash
curl -X POST http://localhost:5000/api/upload/image \
  -F "imageUrl=https://exemplo.com/imagem.jpg"
```

Resposta esperada (ambos os casos):
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "https://xxxxx.supabase.co/storage/v1/object/public/event-images/uploads/uuid.jpg"
}
```

### 4. Deploy em Produção

O código já está pronto para produção. Apenas certifique-se de:

1. ✅ Bucket `event-images` criado no Supabase
2. ✅ RLS policies configuradas
3. ✅ Variáveis de ambiente no Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Como Funciona

### Upload Flow - Arquivo

```
Frontend (form com arquivo)
    ↓
POST /api/upload/image (multipart/form-data)
    ↓
Multer (memoryStorage) → Buffer
    ↓
SupabaseStorageService.uploadImage()
    ↓
Supabase Storage (event-images bucket)
    ↓
Retorna URL pública
    ↓
Frontend (salva URL no banco)
```

### Upload Flow - URL

```
Frontend (form com URL)
    ↓
POST /api/upload/image (multipart/form-data com imageUrl)
    ↓
SupabaseStorageService.uploadImageFromUrl()
    ↓
Faz download da imagem da URL externa
    ↓
Valida tipo de imagem (JPEG, PNG, WebP, GIF)
    ↓
Supabase Storage (event-images bucket)
    ↓
Retorna URL pública
    ↓
Frontend (salva URL no banco)
```

### URLs Geradas

Exemplo de URL retornada:
```
https://ahmsdxdqlqptppsyeohr.supabase.co/storage/v1/object/public/event-images/uploads/550e8400-e29b-41d4-a716-446655440000.jpg
```

Estrutura:
- `ahmsdxdqlqptppsyeohr.supabase.co` - Seu projeto Supabase
- `storage/v1/object/public` - Endpoint público de storage
- `event-images` - Nome do bucket
- `uploads/` - Pasta dentro do bucket
- `550e8400-e29b-41d4-a716-446655440000.jpg` - UUID + extensão original

## Troubleshooting

### Erro: "Bucket not found"

```
[SupabaseStorageService] Bucket "event-images" not found
```

**Solução**: Crie o bucket no Supabase dashboard conforme instruções acima.

### Erro: "Permission denied"

```
Error: Supabase upload error: Insufficient permissions
```

**Solução**: Configure as RLS policies conforme instruções acima.

### Erro: "Service role key invalid"

Certifique-se de que `SUPABASE_SERVICE_ROLE_KEY` está correto no `.env`.

## Benefícios

✅ Funciona em produção (Vercel)
✅ Sem limite de espaço em disco
✅ URLs permanentes e públicas
✅ Integrado com Supabase (banco de dados)
✅ Suporta múltiplos formatos (JPEG, PNG, WebP, GIF)
✅ Limite de 5MB por arquivo

## Próximas Melhorias

- [ ] Adicionar compressão de imagens
- [ ] Implementar cache de imagens
- [ ] Adicionar watermark automático
- [ ] Criar múltiplas resoluções (thumbnail, medium, full)
- [ ] Integrar com CDN para melhor performance
