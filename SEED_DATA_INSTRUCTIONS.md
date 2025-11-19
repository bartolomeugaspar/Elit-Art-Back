# Instruções para Inserir Dados de Teste

## Visão Geral
O script `seed_data.sql` insere dados de teste em todas as tabelas novas da Elit'Art para facilitar o desenvolvimento e testes.

## Dados Inseridos

### 1. **Produtos** (8 registros)
- 2 Livros (Arte Moderna em Angola, Poesia Contemporânea Angolana)
- 1 E-book (Guia de Artes Visuais)
- 2 Revistas (Revista Elit'Art #1 e #2)
- 2 Ingressos (Exposição Anual, Workshop)
- 1 Merchandise (Camiseta Elit'Art)

### 2. **Blog Posts** (6 artigos)
- 2 Artigos publicados
- 1 Conto publicado
- 1 Poesia publicada
- 1 Revista publicada
- 1 Drama em rascunho

### 3. **Obras de Arte** (5 obras)
- 1 Pintura (Reflexão Urbana)
- 1 Escultura (Escultura Abstrata)
- 1 Fotografia (Paisagem Angolana)
- 1 Arte Digital (Código Criativo)
- 1 Técnica Mista (Fusão de Técnicas)

### 4. **Press Releases** (3 comunicados)
- 2 Publicados
- 1 Em rascunho

### 5. **Media Kits** (3 arquivos)
- Kit de Imprensa 2025
- Guia de Marca
- Catálogo de Artistas

### 6. **Tópicos do Fórum** (5 tópicos)
- 2 Tópicos fixados (Bem-vindo, Próximos Eventos)
- 3 Tópicos normais (Técnicas, Colaboração, Feedback)

### 7. **Respostas do Fórum** (3 respostas)
- Respostas para tópicos de Bem-vindo e Técnicas

## Como Executar

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse https://supabase.com → Seu Projeto
2. Clique em **SQL Editor** no menu lateral
3. Clique em **New Query**
4. Copie e cole o conteúdo do arquivo `src/migrations/seed_data.sql`
5. Clique em **Run** para executar

### Opção 2: Via Linha de Comando (Se tiver psql instalado)

```bash
# Conectar ao banco de dados Supabase
psql "postgresql://[user]:[password]@[host]:[port]/[database]" < src/migrations/seed_data.sql
```

## Verificar Dados Inseridos

Após executar o script, você pode verificar os dados com estas queries:

```sql
-- Verificar produtos
SELECT COUNT(*) as total_produtos FROM products;

-- Verificar blog posts
SELECT COUNT(*) as total_posts FROM blog_posts;

-- Verificar obras de arte
SELECT COUNT(*) as total_artworks FROM artworks;

-- Verificar press releases
SELECT COUNT(*) as total_releases FROM press_releases;

-- Verificar tópicos do fórum
SELECT COUNT(*) as total_topics FROM forum_topics;
```

## Limpar Dados (Se Necessário)

Se precisar remover todos os dados de teste:

```sql
-- Deletar dados em ordem (respeitar foreign keys)
DELETE FROM forum_replies;
DELETE FROM forum_topics;
DELETE FROM blog_comments;
DELETE FROM blog_posts;
DELETE FROM artworks;
DELETE FROM press_releases;
DELETE FROM media_kits;
DELETE FROM orders;
DELETE FROM products;
```

## Notas Importantes

- ✅ O script usa `author_id = NULL` para evitar erros de foreign key
- ✅ Todos os `author_name` são preenchidos com nomes fictícios
- ✅ As URLs de imagens apontam para `https://elit-arte.vercel.app/icon.jpeg`
- ✅ Os dados são realistas e representam casos de uso reais
- ✅ Datas estão configuradas para 2025 para simular dados recentes

## Próximos Passos

Após inserir os dados:

1. Reinicie o backend: `npm run dev`
2. Teste os endpoints da API
3. Verifique os dados no painel administrativo
4. Faça testes de CRUD (Create, Read, Update, Delete)

## Troubleshooting

### Erro: "relation already exists"
- Isso significa que os dados já foram inseridos
- Execute o script de limpeza acima e tente novamente

### Erro: "foreign key constraint"
- Certifique-se de que as tabelas `users` e `artists` existem
- Se necessário, execute primeiro `SUPABASE_SETUP.md`

### Erro: "duplicate key value"
- Alguns SKUs ou slugs podem estar duplicados
- Modifique os valores no script antes de executar novamente
