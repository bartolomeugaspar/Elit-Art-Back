# Resumo dos Scripts SQL

## 📋 Scripts Disponíveis

### 1. **seed_data.sql** - Inserir Dados de Teste
Insere dados de teste em todas as tabelas novas.

**Conteúdo:**
- 8 Produtos (livros, revistas, ingressos, merchandise)
- 6 Blog Posts (artigos, contos, poesia, drama)
- 5 Obras de Arte (pintura, escultura, fotografia, digital, mista)
- 3 Press Releases
- 3 Media Kits
- 5 Tópicos do Fórum
- 3 Respostas do Fórum

**Como usar:**
1. Abra Supabase Dashboard → SQL Editor
2. Copie o conteúdo de `src/migrations/seed_data.sql`
3. Cole e clique em "Run"

---

### 2. **clean_data.sql** - Limpar Dados de Teste
Remove todos os dados de teste inseridos.

**Função:**
- Deleta todos os registros das tabelas novas
- Respeita as dependências de foreign keys
- Exibe um relatório de limpeza

**Como usar:**
1. Abra Supabase Dashboard → SQL Editor
2. Copie o conteúdo de `src/migrations/clean_data.sql`
3. Cole e clique em "Run"

---

### 3. **view_data.sql** - Visualizar Dados
Exibe todos os dados inseridos de forma organizada.

**Função:**
- Mostra produtos por categoria
- Mostra blog posts por data
- Mostra obras de arte por ano
- Mostra press releases por data
- Mostra media kits com tamanho de arquivo
- Mostra tópicos e respostas do fórum
- Exibe estatísticas gerais

**Como usar:**
1. Abra Supabase Dashboard → SQL Editor
2. Copie o conteúdo de `src/migrations/view_data.sql`
3. Cole e clique em "Run"

---

### 4. **FIX_BLOG_FK_CONSTRAINT.sql** - Corrigir Constraint
Remove a restrição de foreign key da tabela blog_posts.

**Função:**
- Remove o constraint `blog_posts_author_id_fkey`
- Permite inserir blog posts com author_id que não existe em users

**Como usar:**
1. Abra Supabase Dashboard → SQL Editor
2. Copie o conteúdo de `FIX_BLOG_FK_CONSTRAINT.sql`
3. Cole e clique em "Run"

---

## 🚀 Fluxo Recomendado

### Primeira Vez (Setup Completo)

```
1. Executar: create_new_features.sql (já foi executado)
   ↓
2. Executar: FIX_BLOG_FK_CONSTRAINT.sql
   ↓
3. Executar: seed_data.sql
   ↓
4. Executar: view_data.sql (para verificar)
   ↓
5. Reiniciar backend: npm run dev
```

### Resetar Dados

```
1. Executar: clean_data.sql
   ↓
2. Executar: seed_data.sql
   ↓
3. Executar: view_data.sql (para verificar)
```

---

## 📊 Dados de Teste Inseridos

### Produtos
| Nome | Categoria | Preço | Estoque |
|------|-----------|-------|---------|
| Arte Moderna em Angola | book | R$ 45.99 | 25 |
| Revista Elit'Art #1 | magazine | R$ 12.50 | 50 |
| Ingresso - Exposição Anual | ticket | R$ 25.00 | 100 |
| Camiseta Elit'Art | merchandise | R$ 35.00 | 75 |

### Blog Posts
| Título | Categoria | Status |
|--------|-----------|--------|
| A Importância da Arte Contemporânea | article | published |
| Contos de Autores Angolanos | story | published |
| Poesia: Expressão da Alma | poetry | published |
| Revista Elit'Art - Edição Especial | magazine | published |
| Drama e Teatro | drama | draft |

### Obras de Arte
| Título | Tipo | Artista | Ano |
|--------|------|---------|-----|
| Reflexão Urbana | painting | Faustino Mulumba | 2023 |
| Escultura Abstrata | sculpture | Josemara Silva | 2024 |
| Paisagem Angolana | photography | Fotógrafo Usúario | 2024 |
| Código Criativo | digital | Artista Digital | 2025 |
| Fusão de Técnicas | mixed_media | Criador Experimental | 2024 |

---

## ⚠️ Notas Importantes

- ✅ Todos os `author_id` são `NULL` para evitar erros de foreign key
- ✅ Os `author_name` são preenchidos com nomes fictícios
- ✅ URLs de imagens apontam para `https://elit-arte.vercel.app/icon.jpeg`
- ✅ Datas estão em 2025 para simular dados recentes
- ✅ SKUs são únicos para cada produto
- ✅ Slugs são únicos para cada blog post

---

## 🔧 Troubleshooting

### Erro: "relation already exists"
```sql
-- Execute clean_data.sql primeiro
-- Depois execute seed_data.sql novamente
```

### Erro: "foreign key constraint"
```sql
-- Execute FIX_BLOG_FK_CONSTRAINT.sql
-- Depois tente novamente
```

### Erro: "duplicate key value"
```sql
-- Modifique os SKUs ou slugs no script
-- Ou execute clean_data.sql e tente novamente
```

---

## 📁 Localização dos Scripts

```
/home/kali/Documentos/Elit-Art-Back/
├── src/migrations/
│   ├── seed_data.sql          ← Inserir dados
│   ├── clean_data.sql         ← Limpar dados
│   └── view_data.sql          ← Visualizar dados
├── FIX_BLOG_FK_CONSTRAINT.sql ← Corrigir constraint
└── SCRIPTS_SUMMARY.md         ← Este arquivo
```

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique se as tabelas foram criadas com `create_new_features.sql`
2. Execute `FIX_BLOG_FK_CONSTRAINT.sql` para remover constraints
3. Tente executar `clean_data.sql` e depois `seed_data.sql`
4. Reinicie o backend com `npm run dev`
