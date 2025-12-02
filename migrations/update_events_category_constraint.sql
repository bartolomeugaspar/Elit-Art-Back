-- Remover a constraint antiga de categoria
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_category_check;

-- Adicionar nova constraint com todas as categorias
ALTER TABLE events ADD CONSTRAINT events_category_check 
CHECK (category IN ('Workshop', 'Exposição', 'Masterclass', 'Networking', 'Palestra', 'Performance', 'Lançamento', 'Encontro', 'Outro'));

-- Comentário sobre a atualização
COMMENT ON CONSTRAINT events_category_check ON events IS 'Atualizado em 2025-12-02: Adicionadas novas categorias de eventos';
