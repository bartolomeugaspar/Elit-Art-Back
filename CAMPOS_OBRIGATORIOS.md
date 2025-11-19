# ⚠️ Campos Obrigatórios - Evite Erros

## Erro: "null value in column violates not-null constraint"

Este erro significa que você esqueceu de preencher um campo obrigatório.

---

## 📦 Campos Obrigatórios por Tabela

### PRODUCTS (Loja Digital)

**Obrigatórios:**
- `name` - Nome do produto
- `description` - Descrição
- `category` - Categoria (book, magazine, ticket, merchandise)
- `price` - Preço
- `stock` - Quantidade em estoque
- `sku` - Identificador único
- **`image_url` ← MUITO IMPORTANTE!** - URL da imagem

**Opcionais:**
- `discount_price` - Preço com desconto
- `author` - Autor (para livros)
- `isbn` - ISBN (para livros)
- `pages` - Número de páginas
- `publication_date` - Data de publicação
- `digital_url` - URL do arquivo digital
- `is_digital` - É digital?
- `is_active` - Está ativo?

**Query Correta:**
```sql
INSERT INTO products (name, description, category, price, stock, sku, image_url, is_active)
VALUES (
  'Nome do Produto',
  'Descrição',
  'book',
  29.99,
  50,
  'SKU-UNICO-001',
  'https://elit-arte.vercel.app/icon.jpeg',  -- ← NÃO ESQUEÇA!
  TRUE
);
```

---

### BLOG_POSTS (Blog)

**Obrigatórios:**
- `title` - Título do artigo
- `slug` - URL slug (sem espaços, com hífens)
- `content` - Conteúdo completo
- `excerpt` - Resumo
- **`featured_image` ← MUITO IMPORTANTE!** - URL da imagem
- `category` - Categoria (article, story, poetry, drama, magazine, other)
- `author_name` - Nome do autor

**Opcionais:**
- `author_id` - ID do autor (pode ser NULL)
- `status` - Status (draft, published, archived) - padrão: draft
- `published_at` - Data de publicação
- `views` - Número de visualizações
- `likes` - Número de curtidas

**Query Correta:**
```sql
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, category, author_name, status, published_at)
VALUES (
  'Título do Artigo',
  'titulo-do-artigo',
  'Conteúdo completo aqui...',
  'Resumo curto',
  'https://elit-arte.vercel.app/icon.jpeg',  -- ← NÃO ESQUEÇA!
  'article',
  'Nome do Autor',
  'published',
  '2025-01-20'
);
```

---

### ARTWORKS (Galeria)

**Obrigatórios:**
- `title` - Título da obra
- `description` - Descrição
- `artist_name` - Nome do artista
- `type` - Tipo (painting, sculpture, photography, digital, mixed_media, other)
- `year` - Ano
- **`image_url` ← MUITO IMPORTANTE!** - URL da imagem

**Opcionais:**
- `artist_id` - ID do artista (pode ser NULL)
- `dimensions` - Dimensões
- `medium` - Técnica/Material
- `gallery_images` - Galeria de imagens (JSON)
- `price` - Preço
- `is_available` - Está disponível?
- `is_featured` - É destaque?

**Query Correta:**
```sql
INSERT INTO artworks (title, description, artist_name, type, year, image_url, is_available)
VALUES (
  'Título da Obra',
  'Descrição',
  'Nome do Artista',
  'painting',
  2025,
  'https://elit-arte.vercel.app/icon.jpeg',  -- ← NÃO ESQUEÇA!
  TRUE
);
```

---

### PRESS_RELEASES (Imprensa)

**Obrigatórios:**
- `title` - Título
- `content` - Conteúdo
- `summary` - Resumo
- `publication_date` - Data de publicação
- `author` - Autor

**Opcionais:**
- `image_url` - URL da imagem
- `status` - Status (draft, published, archived) - padrão: draft

**Query Correta:**
```sql
INSERT INTO press_releases (title, content, summary, publication_date, author, status)
VALUES (
  'Título do Comunicado',
  'Conteúdo completo...',
  'Resumo',
  '2025-01-20',
  'Assessoria de Imprensa',
  'published'
);
```

---

### MEDIA_KITS (Kit de Imprensa)

**Obrigatórios:**
- `title` - Título
- `description` - Descrição
- `file_url` - URL do arquivo
- `file_type` - Tipo (pdf, zip, doc)
- `file_size` - Tamanho em bytes

**Opcionais:**
- `downloads` - Número de downloads

**Query Correta:**
```sql
INSERT INTO media_kits (title, description, file_url, file_type, file_size)
VALUES (
  'Título do Kit',
  'Descrição',
  'https://exemplo.com/arquivo.pdf',
  'pdf',
  1048576  -- 1MB em bytes
);
```

---

### FORUM_TOPICS (Fórum)

**Obrigatórios:**
- `title` - Título
- `description` - Descrição
- `category` - Categoria (general, art, events, collaboration, feedback)
- `author_name` - Nome do autor

**Opcionais:**
- `author_id` - ID do autor (pode ser NULL)
- `replies_count` - Número de respostas
- `views` - Número de visualizações
- `is_pinned` - Está fixado?
- `is_closed` - Está fechado?

**Query Correta:**
```sql
INSERT INTO forum_topics (title, description, category, author_name)
VALUES (
  'Título do Tópico',
  'Descrição',
  'general',
  'Nome do Autor'
);
```

---

## 🔍 Como Identificar o Campo Faltante

Quando receber o erro:
```
ERROR: 23502: null value in column "image_url" violates not-null constraint
```

Significa que o campo `image_url` é obrigatório e você não preencheu.

**Solução:**
1. Procure pelo nome do campo no erro
2. Adicione o campo na sua query
3. Forneça um valor válido

---

## 📋 Checklist Antes de Executar

- [ ] Todos os campos obrigatórios estão preenchidos?
- [ ] Os valores estão no tipo correto (string, number, date)?
- [ ] As URLs de imagem são válidas?
- [ ] Os slugs não têm espaços?
- [ ] As categorias são válidas?
- [ ] Os SKUs são únicos?

---

## 🖼️ URLs de Imagem Válidas

Use uma destas URLs como placeholder:

```
https://elit-arte.vercel.app/icon.jpeg
https://via.placeholder.com/400x300?text=Produto
https://via.placeholder.com/400x300?text=Artigo
https://via.placeholder.com/400x300?text=Obra+de+Arte
```

Ou forneça uma URL real de uma imagem.

---

## 💡 Exemplo Completo Correto

```sql
-- ✅ CORRETO - Todos os campos obrigatórios preenchidos
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

-- ❌ ERRADO - Falta image_url
INSERT INTO products (name, description, category, price, stock, sku, is_active)
VALUES (
  'Livro: Histórias de Angola',
  'Coletânea de histórias tradicionais angolanas',
  'book',
  35.50,
  30,
  'BOOK-HIST-001',
  TRUE
);
```

---

## 🚀 Próximos Passos

1. Identifique qual campo está faltando
2. Adicione o campo na sua query
3. Forneça um valor válido
4. Execute novamente

Se o erro persistir, verifique a documentação de cada tabela acima.
