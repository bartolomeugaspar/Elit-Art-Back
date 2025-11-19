# ⚡ Adicionar Dados Rapidamente

## 🎯 Copy & Paste - Pronto para Usar

### 1️⃣ Adicionar Produto Rapidamente

Copie, cole no Supabase SQL Editor e mude os valores:

```sql
INSERT INTO products (name, description, category, price, discount_price, image_url, stock, sku, is_active)
VALUES (
  'MUDE AQUI - Nome do Produto',
  'MUDE AQUI - Descrição do produto',
  'book',
  29.99,
  NULL,
  'https://elit-arte.vercel.app/icon.jpeg',
  50,
  'SKU-MUDE-001',
  TRUE
);
```

**Campos a Mudar:**
- `'MUDE AQUI - Nome do Produto'` → Nome real
- `'MUDE AQUI - Descrição do produto'` → Descrição real
- `'book'` → Categoria (book, magazine, ticket, merchandise)
- `29.99` → Preço
- `50` → Estoque
- `'SKU-MUDE-001'` → SKU único

---

### 2️⃣ Adicionar Blog Post Rapidamente

```sql
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, category, author_name, status, published_at)
VALUES (
  'MUDE AQUI - Título do Artigo',
  'mude-aqui-titulo-do-artigo',
  'MUDE AQUI - Escreva o conteúdo completo aqui...',
  'MUDE AQUI - Resumo curto do artigo',
  'https://elit-arte.vercel.app/icon.jpeg',
  'article',
  'Seu Nome',
  'published',
  '2025-01-20'
);
```

**Campos a Mudar:**
- `'MUDE AQUI - Título do Artigo'` → Título real
- `'mude-aqui-titulo-do-artigo'` → Slug (sem espaços, com hífens)
- `'MUDE AQUI - Escreva o conteúdo completo aqui...'` → Conteúdo
- `'MUDE AQUI - Resumo curto do artigo'` → Resumo
- `'article'` → Categoria (article, story, poetry, drama, magazine, other)
- `'Seu Nome'` → Nome do autor
- `'2025-01-20'` → Data de publicação

---

### 3️⃣ Adicionar Obra de Arte Rapidamente

```sql
INSERT INTO artworks (title, description, artist_name, type, year, dimensions, medium, image_url, price, is_available, is_featured)
VALUES (
  'MUDE AQUI - Título da Obra',
  'MUDE AQUI - Descrição detalhada da obra',
  'MUDE AQUI - Nome do Artista',
  'painting',
  2025,
  '100x80cm',
  'MUDE AQUI - Técnica usada',
  'https://elit-arte.vercel.app/icon.jpeg',
  5000.00,
  TRUE,
  FALSE
);
```

**Campos a Mudar:**
- `'MUDE AQUI - Título da Obra'` → Título
- `'MUDE AQUI - Descrição detalhada da obra'` → Descrição
- `'MUDE AQUI - Nome do Artista'` → Nome do artista
- `'painting'` → Tipo (painting, sculpture, photography, digital, mixed_media, other)
- `2025` → Ano
- `'100x80cm'` → Dimensões
- `'MUDE AQUI - Técnica usada'` → Técnica (Óleo, Acrílico, etc)
- `5000.00` → Preço

---

### 4️⃣ Adicionar Press Release Rapidamente

```sql
INSERT INTO press_releases (title, content, summary, image_url, publication_date, author, status)
VALUES (
  'MUDE AQUI - Título do Comunicado',
  'MUDE AQUI - Conteúdo completo do comunicado aqui...',
  'MUDE AQUI - Resumo do comunicado',
  'https://elit-arte.vercel.app/icon.jpeg',
  '2025-01-20',
  'Assessoria de Imprensa',
  'published'
);
```

**Campos a Mudar:**
- `'MUDE AQUI - Título do Comunicado'` → Título
- `'MUDE AQUI - Conteúdo completo do comunicado aqui...'` → Conteúdo
- `'MUDE AQUI - Resumo do comunicado'` → Resumo
- `'2025-01-20'` → Data de publicação

---

### 5️⃣ Adicionar Tópico do Fórum Rapidamente

```sql
INSERT INTO forum_topics (title, description, category, author_name, is_pinned, is_closed)
VALUES (
  'MUDE AQUI - Título do Tópico',
  'MUDE AQUI - Descrição do tópico',
  'general',
  'Nome do Autor',
  FALSE,
  FALSE
);
```

**Campos a Mudar:**
- `'MUDE AQUI - Título do Tópico'` → Título
- `'MUDE AQUI - Descrição do tópico'` → Descrição
- `'general'` → Categoria (general, art, events, collaboration, feedback)
- `'Nome do Autor'` → Nome do autor

---

## 📋 Checklist Rápido

Antes de executar, verifique:

- [ ] Mudei todos os campos "MUDE AQUI"?
- [ ] O SKU é único (não existe outro igual)?
- [ ] O slug não tem espaços (usa hífens)?
- [ ] A categoria é válida?
- [ ] A data está no formato YYYY-MM-DD?
- [ ] Copiei a query inteira (BEGIN até END)?

---

## 🚀 Passo a Passo

1. **Abra Supabase Dashboard**
   - https://supabase.com → Seu Projeto

2. **Clique em SQL Editor**
   - Menu lateral esquerdo → SQL Editor

3. **Clique em New Query**
   - Botão no topo direito

4. **Copie uma das queries acima**
   - Escolha o tipo de dado que quer adicionar

5. **Cole no editor**
   - Ctrl+V ou Cmd+V

6. **Mude os valores**
   - Substitua "MUDE AQUI" pelos valores reais

7. **Clique em Run**
   - Botão no canto inferior direito

8. **Pronto!**
   - Dados foram inseridos com sucesso

---

## ✅ Exemplos Completos

### Exemplo 1: Adicionar um Livro

```sql
INSERT INTO products (name, description, category, price, discount_price, image_url, stock, sku, author, isbn, pages, publication_date, is_digital, is_active)
VALUES (
  'Contos de Luanda',
  'Uma coletânea de contos que retratam a vida em Luanda',
  'book',
  45.99,
  39.99,
  'https://elit-arte.vercel.app/icon.jpeg',
  30,
  'BOOK-CONTOS-LUANDA-001',
  'Mário Pinto',
  '978-9876543210',
  256,
  '2024-06-15',
  FALSE,
  TRUE
);
```

### Exemplo 2: Adicionar um Artigo

```sql
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, category, author_name, status, published_at)
VALUES (
  'Escultura Contemporânea em Angola',
  'escultura-contemporanea-angola',
  'A escultura contemporânea angolana está em ascensão. Artistas como João Silva e Maria Santos estão revolucionando o cenário artístico com suas obras inovadoras...',
  'Conheça os principais escultores contemporâneos de Angola',
  'https://elit-arte.vercel.app/icon.jpeg',
  'article',
  'Redação Elit''Art',
  'published',
  '2025-01-22'
);
```

### Exemplo 3: Adicionar uma Obra

```sql
INSERT INTO artworks (title, description, artist_name, type, year, dimensions, medium, image_url, price, is_available, is_featured)
VALUES (
  'Movimento Urbano',
  'Escultura que representa o movimento constante da vida urbana moderna',
  'Sofia Nkosi',
  'sculpture',
  2024,
  '200cm altura',
  'Bronze',
  'https://elit-arte.vercel.app/icon.jpeg',
  12000.00,
  TRUE,
  TRUE
);
```

---

## 🔄 Adicionar Múltiplos Dados de Uma Vez

Você pode adicionar vários registros em uma única query:

```sql
INSERT INTO products (name, description, category, price, stock, sku, is_active)
VALUES 
  ('Produto 1', 'Descrição 1', 'book', 29.99, 50, 'SKU-001', TRUE),
  ('Produto 2', 'Descrição 2', 'magazine', 12.50, 100, 'SKU-002', TRUE),
  ('Produto 3', 'Descrição 3', 'ticket', 25.00, 75, 'SKU-003', TRUE);
```

---

## 💾 Salvar para Depois

Se quiser salvar uma query para usar depois:

1. Clique em **Save** (botão no topo)
2. Dê um nome: "Adicionar Produto"
3. Clique em **Save Query**
4. Próxima vez, clique em **Saved Queries** para reutilizar

---

## 🎓 Próximas Etapas

Após adicionar dados:

1. **Visualize no painel admin**
   - http://localhost:3000/admin

2. **Teste no frontend público**
   - http://localhost:3000

3. **Verifique os dados**
   - Execute: `SELECT * FROM products LIMIT 10;`

4. **Faça mais testes**
   - Adicione mais dados conforme necessário

---

## 📞 Precisa de Ajuda?

- Verifique a documentação: `ADICIONAR_DADOS.md`
- Veja exemplos: `SEED_DATA_INSTRUCTIONS.md`
- Consulte o resumo: `SCRIPTS_SUMMARY.md`
