-- ===== FIX FORUM RLS POLICIES =====
-- Este script garante que todos possam ler e escrever nos tópicos e respostas do fórum

-- Desabilitar RLS existente (se houver)
ALTER TABLE forum_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Anyone can read topics" ON forum_topics;
DROP POLICY IF EXISTS "Anyone can create topics" ON forum_topics;
DROP POLICY IF EXISTS "Anyone can read replies" ON forum_replies;
DROP POLICY IF EXISTS "Anyone can create replies" ON forum_replies;

-- Habilitar RLS
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Criar políticas permissivas para forum_topics
CREATE POLICY "Anyone can read topics"
  ON forum_topics FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create topics"
  ON forum_topics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authors can update their topics"
  ON forum_topics FOR UPDATE
  USING (true);

CREATE POLICY "Authors can delete their topics"
  ON forum_topics FOR DELETE
  USING (true);

-- Criar políticas permissivas para forum_replies
CREATE POLICY "Anyone can read replies"
  ON forum_replies FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create replies"
  ON forum_replies FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authors can update their replies"
  ON forum_replies FOR UPDATE
  USING (true);

CREATE POLICY "Authors can delete their replies"
  ON forum_replies FOR DELETE
  USING (true);

-- Verificar as políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('forum_topics', 'forum_replies')
ORDER BY tablename, policyname;
