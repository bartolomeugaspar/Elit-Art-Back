# ✅ Erro Resolvido: image_url Obrigatório

## 🔴 Erro que Você Recebeu

```
ERROR: 23502: null value in column "image_url" of relation "products" violates not-null constraint
```

## ✅ Solução

O campo `image_url` é **obrigatório** na tabela `products`. Você esqueceu de adicioná-lo.

---

## ❌ Query com Erro

```sql
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

**Problema:** Falta `image_url` na lista de campos e no VALUES

---

## ✅ Query Corrigida

```sql
INSERT INTO products (name, description, category, price, stock, sku, image_url, is_active)
VALUES (
  'Livro: Histórias de Angola',
  'Coletânea de histórias tradicionais angolanas',
  'book',
  35.50,
  30,
  'BOOK-HIST-001',
  'https://elit-arte.vercel.app/icon.jpeg',  -- ← ADICIONADO!
  TRUE
);
```

**Solução:** Adicionado `image_url` e fornecido um valor válido

---

## 🚀 Como Executar

1. Abra Supabase Dashboard → SQL Editor
2. Clique em **New Query**
3. Copie o conteúdo de `CORRIGIR_ERRO.sql`
4. Cole no editor
5. Clique em **Run**

---

## 📝 Campos Obrigatórios em Cada Tabela

### PRODUCTS
- ✅ `name` - Nome
- ✅ `description` - Descrição
- ✅ `category` - Categoria
- ✅ `price` - Preço
- ✅ `stock` - Estoque
- ✅ `sku` - SKU único
- ✅ **`image_url` ← IMPORTANTE!** - URL da imagem
- ✅ `is_active` - Ativo?

### BLOG_POSTS
- ✅ `title` - Título
- ✅ `slug` - Slug
- ✅ `content` - Conteúdo
- ✅ `excerpt` - Resumo
- ✅ **`featured_image` ← IMPORTANTE!** - URL da imagem
- ✅ `category` - Categoria
- ✅ `author_name` - Nome do autor

### ARTWORKS
- ✅ `title` - Título
- ✅ `description` - Descrição
- ✅ `artist_name` - Nome do artista
- ✅ `type` - Tipo
- ✅ `year` - Ano
- ✅ **`image_url` ← IMPORTANTE!** - URL da imagem

---

## 💡 Dica: URLs de Imagem

Se não tiver uma imagem real, use:
```
https://elit-arte.vercel.app/icon.jpeg
```

Ou um placeholder:
```
https://via.placeholder.com/400x300?text=Seu+Texto
```

---

## 📚 Documentação Completa

Para mais informações sobre campos obrigatórios, consulte:
- `CAMPOS_OBRIGATORIOS.md` - Lista completa de campos obrigatórios
- `ADICIONAR_DADOS.md` - Guia completo com exemplos
- `QUICK_ADD.md` - Templates prontos para copiar e colar

---

## ✨ Próximas Etapas

1. Execute `CORRIGIR_ERRO.sql` no Supabase
2. Verifique se o produto foi inserido
3. Continue adicionando mais dados
4. Consulte `CAMPOS_OBRIGATORIOS.md` para evitar erros similares
