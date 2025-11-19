# 🚀 Como Adicionar Novos Dados

## Método 1: Via Supabase Dashboard (Mais Fácil)

### Passo 1: Abrir Supabase
1. Acesse https://supabase.com
2. Clique no seu projeto **Elit-Art**
3. Clique em **SQL Editor** (menu lateral esquerdo)

### Passo 2: Criar Nova Query
1. Clique em **New Query**
2. Copie e cole um dos exemplos abaixo
3. Clique em **Run**

---

## 📦 Adicionar Novo Produto

```sql
INSERT INTO products (name, description, category, price, discount_price, image_url, stock, sku, author, isbn, pages, publication_date, is_digital, is_active)
VALUES (
  'Nome do Produto',
  'Descrição do produto aqui',
  'book',  -- ou: magazine, ticket, merchandise
  29.99,   -- preço
  24.99,   -- preço com desconto (opcional)
  'https://exemplo.com/imagem.jpg',
  50,      -- quantidade em estoque
  'SKU-UNICO-001',
  'Nome do Autor',  -- opcional
  '978-1234567890',  -- ISBN (opcional)
  250,     -- número de páginas (opcional)
  '2025-01-20',  -- data de publicação (opcional)
  FALSE,   -- é digital?
  TRUE     -- está ativo?
);
```

**Exemplo Prático:**
```sql
INSERT INTO products (name, description, category, price, stock, sku, image_url, is_active)
VALUES (
  'Livro: Histórias de Angola',
  'Coletânea de histórias tradicionais angolanas',
  'book',
  35.50,
  30,
  'BOOK-HIST-001',
  'https://elit-arte.vercel.app/icon.jpeg',
  TRUE
);
```

---

## 📝 Adicionar Novo Blog Post

```sql
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, category, author_name, status, published_at)
VALUES (
  'Título do Artigo',
  'titulo-do-artigo',  -- sem espaços, com hífens
  'Conteúdo completo do artigo aqui...',
  'Resumo curto do artigo',
  'https://exemplo.com/imagem.jpg',
  'article',  -- ou: story, poetry, drama, magazine, other
  'Nome do Autor',
  'published',  -- ou: draft, archived
  '2025-01-20'
);
```

**Exemplo Prático:**
```sql
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, category, author_name, status, published_at)
VALUES (
  'Dança Tradicional Angolana',
  'danca-tradicional-angolana',
  'A dança é uma forma de expressão cultural muito importante em Angola. Existem várias danças tradicionais que representam diferentes regiões...',
  'Conheça as principais danças tradicionais de Angola',
  'https://elit-arte.vercel.app/icon.jpeg',
  'article',
  'Redação Elit''Art',
  'published',
  '2025-01-20'
);
```

---

## 🎨 Adicionar Nova Obra de Arte

```sql
INSERT INTO artworks (title, description, artist_name, type, year, dimensions, medium, image_url, price, is_available, is_featured)
VALUES (
  'Título da Obra',
  'Descrição detalhada da obra',
  'Nome do Artista',
  'painting',  -- ou: sculpture, photography, digital, mixed_media, other
  2025,
  '100x80cm',
  'Técnica usada',
  'https://exemplo.com/imagem.jpg',
  5000.00,
  TRUE,  -- está disponível?
  FALSE  -- é destaque?
);
```

**Exemplo Prático:**
```sql
INSERT INTO artworks (title, description, artist_name, type, year, dimensions, medium, image_url, price, is_available, is_featured)
VALUES (
  'Cores de Luanda',
  'Pintura que retrata as cores vibrantes das ruas de Luanda ao entardecer',
  'João Neves',
  'painting',
  2025,
  '120x90cm',
  'Óleo sobre tela',
  'https://elit-arte.vercel.app/icon.jpeg',
  7500.00,
  TRUE,
  TRUE
);
```

---

## 📰 Adicionar Press Release

```sql
INSERT INTO press_releases (title, content, summary, image_url, publication_date, author, status)
VALUES (
  'Título do Comunicado',
  'Conteúdo completo do comunicado...',
  'Resumo do comunicado',
  'https://exemplo.com/imagem.jpg',
  '2025-01-20',
  'Nome do Autor',
  'published'  -- ou: draft, archived
);
```

**Exemplo Prático:**
```sql
INSERT INTO press_releases (title, content, summary, image_url, publication_date, author, status)
VALUES (
  'Elit''Art Abre Filial em Benguela',
  'Com grande alegria, anunciamos a abertura de nossa filial em Benguela. Esta expansão marca um novo capítulo na história da Elit''Art...',
  'Nova filial da Elit''Art em Benguela já está operacional',
  'https://elit-arte.vercel.app/icon.jpeg',
  '2025-01-20',
  'Assessoria de Imprensa',
  'published'
);
```

---

## 💬 Adicionar Tópico do Fórum

```sql
INSERT INTO forum_topics (title, description, category, author_name, is_pinned, is_closed)
VALUES (
  'Título do Tópico',
  'Descrição do tópico',
  'general',  -- ou: art, events, collaboration, feedback
  'Nome do Autor',
  FALSE,  -- fixar no topo?
  FALSE   -- está fechado?
);
```

**Exemplo Prático:**
```sql
INSERT INTO forum_topics (title, description, category, author_name, is_pinned, is_closed)
VALUES (
  'Dúvidas sobre Inscrição em Eventos',
  'Espaço para tirar dúvidas sobre como se inscrever nos eventos da Elit''Art',
  'events',
  'Administrador',
  FALSE,
  FALSE
);
```

---

## 📦 Adicionar Media Kit

```sql
INSERT INTO media_kits (title, description, file_url, file_type, file_size, downloads)
VALUES (
  'Título do Kit',
  'Descrição do arquivo',
  'https://exemplo.com/arquivo.pdf',
  'pdf',  -- ou: zip, doc
  1048576,  -- tamanho em bytes (1MB = 1048576)
  0
);
```

**Exemplo Prático:**
```sql
INSERT INTO media_kits (title, description, file_url, file_type, file_size, downloads)
VALUES (
  'Fotos de Eventos 2024',
  'Galeria com fotos dos principais eventos de 2024',
  'https://elit-arte.vercel.app/events-2024.zip',
  'zip',
  52428800,  -- 50MB
  0
);
```

---

## Método 2: Via API (Para Integração com Frontend)

### Adicionar Produto via API

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Produto",
    "description": "Descrição",
    "category": "book",
    "price": 29.99,
    "stock": 50,
    "sku": "SKU-001",
    "image_url": "https://exemplo.com/imagem.jpg"
  }'
```

### Adicionar Blog Post via API

```bash
curl -X POST http://localhost:5000/api/blog \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Novo Artigo",
    "slug": "novo-artigo",
    "content": "Conteúdo aqui...",
    "excerpt": "Resumo",
    "featured_image": "https://exemplo.com/imagem.jpg",
    "category": "article",
    "author_id": "uuid-do-autor",
    "author_name": "Nome do Autor"
  }'
```

---

## 🎯 Dicas Importantes

### ✅ Categorias Válidas

**Produtos:**
- `book` - Livro
- `magazine` - Revista
- `ticket` - Ingresso
- `merchandise` - Merchandise

**Blog Posts:**
- `article` - Artigo
- `story` - Conto
- `poetry` - Poesia
- `drama` - Drama
- `magazine` - Revista
- `other` - Outro

**Obras de Arte:**
- `painting` - Pintura
- `sculpture` - Escultura
- `photography` - Fotografia
- `digital` - Digital
- `mixed_media` - Técnica Mista
- `other` - Outro

**Fórum:**
- `general` - Geral
- `art` - Arte
- `events` - Eventos
- `collaboration` - Colaboração
- `feedback` - Feedback

### ✅ Status Válidos

**Blog Posts e Press Releases:**
- `draft` - Rascunho
- `published` - Publicado
- `archived` - Arquivado

**Registros:**
- `registered` - Registrado
- `attended` - Confirmado
- `cancelled` - Cancelado

### ✅ Dicas de Slug

O slug é a versão URL-friendly do título:
- Remova espaços e substitua por hífens
- Use apenas letras minúsculas
- Remova acentos

**Exemplos:**
- "Dança Tradicional" → `danca-tradicional`
- "Arte Contemporânea" → `arte-contemporanea`
- "Técnicas de Pintura" → `tecnicas-de-pintura`

### ✅ Dicas de SKU

SKU deve ser único para cada produto:
- Use prefixo da categoria: `BOOK-`, `MAG-`, `TICKET-`, `MERCH-`
- Adicione número sequencial: `BOOK-001`, `BOOK-002`
- Exemplo completo: `BOOK-HISTORIA-001`

---

## 🔍 Verificar Dados Inseridos

Após inserir, execute esta query para verificar:

```sql
-- Ver últimos produtos inseridos
SELECT name, category, price, stock FROM products ORDER BY created_at DESC LIMIT 5;

-- Ver últimos blog posts
SELECT title, category, status FROM blog_posts ORDER BY created_at DESC LIMIT 5;

-- Ver últimas obras de arte
SELECT title, artist_name, type FROM artworks ORDER BY created_at DESC LIMIT 5;
```

---

## ❌ Erros Comuns

### Erro: "duplicate key value violates unique constraint"
**Causa:** SKU ou slug já existe
**Solução:** Use um SKU ou slug diferente

### Erro: "invalid input syntax for type uuid"
**Causa:** author_id não é um UUID válido
**Solução:** Use `NULL` ou um UUID válido

### Erro: "value too long for type character varying"
**Causa:** Texto muito longo para o campo
**Solução:** Reduza o tamanho do texto

### Erro: "check constraint violation"
**Causa:** Valor de categoria inválido
**Solução:** Use uma das categorias válidas listadas acima

---

## 📚 Próximos Passos

1. **Adicionar dados via Supabase Dashboard** (mais fácil)
2. **Testar via API** (para integração)
3. **Visualizar no painel administrativo** (http://localhost:3000/admin)
4. **Testar no frontend público** (http://localhost:3000)

---

## 💡 Dúvidas?

Se encontrar problemas:
1. Verifique se o Supabase está conectado
2. Verifique se as tabelas foram criadas
3. Verifique se o backend está rodando
4. Consulte os logs do backend para mais detalhes
