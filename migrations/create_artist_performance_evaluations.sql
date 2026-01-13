-- Migration: Create artist_performance_evaluations table
-- Description: Sistema de avaliação de desempenho artístico e comportamental trimestral
-- Date: 2026-01-13

-- Create artist_performance_evaluations table
CREATE TABLE IF NOT EXISTS artist_performance_evaluations (
    id SERIAL PRIMARY KEY,
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    
    -- Período de avaliação
    year INTEGER NOT NULL,
    quarter INTEGER NOT NULL CHECK (quarter >= 1 AND quarter <= 3),
    -- Quarter 1: Janeiro a Abril
    -- Quarter 2: Maio a Agosto  
    -- Quarter 3: Setembro a Dezembro
    
    -- Critérios de avaliação (0 a 20)
    presenca_reunioes_presenciais DECIMAL(4,2) DEFAULT 0 CHECK (presenca_reunioes_presenciais >= 0 AND presenca_reunioes_presenciais <= 20),
    presenca_reunioes_online DECIMAL(4,2) DEFAULT 0 CHECK (presenca_reunioes_online >= 0 AND presenca_reunioes_online <= 20),
    presenca_espetaculos DECIMAL(4,2) DEFAULT 0 CHECK (presenca_espetaculos >= 0 AND presenca_espetaculos <= 20),
    cumprimento_tarefas DECIMAL(4,2) DEFAULT 0 CHECK (cumprimento_tarefas >= 0 AND cumprimento_tarefas <= 20),
    producao_artistica DECIMAL(4,2) DEFAULT 0 CHECK (producao_artistica >= 0 AND producao_artistica <= 20),
    comportamento_disciplina DECIMAL(4,2) DEFAULT 0 CHECK (comportamento_disciplina >= 0 AND comportamento_disciplina <= 20),
    regularizacao_quota DECIMAL(4,2) DEFAULT 0 CHECK (regularizacao_quota >= 0 AND regularizacao_quota <= 20),
    
    -- Média calculada automaticamente
    media_final DECIMAL(5,2) GENERATED ALWAYS AS (
        (presenca_reunioes_presenciais + presenca_reunioes_online + presenca_espetaculos + 
         cumprimento_tarefas + producao_artistica + comportamento_disciplina + regularizacao_quota) / 7
    ) STORED,
    
    -- Observações adicionais
    observacoes TEXT,
    
    -- Informações de auditoria
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint única: um artista só pode ter uma avaliação por trimestre/ano
    UNIQUE(artist_id, year, quarter)
);

-- Criar índices para melhorar performance
CREATE INDEX idx_artist_performance_artist ON artist_performance_evaluations(artist_id);
CREATE INDEX idx_artist_performance_year_quarter ON artist_performance_evaluations(year, quarter);
CREATE INDEX idx_artist_performance_created_at ON artist_performance_evaluations(created_at);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_artist_performance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_artist_performance_updated_at
    BEFORE UPDATE ON artist_performance_evaluations
    FOR EACH ROW
    EXECUTE FUNCTION update_artist_performance_updated_at();

-- Comentários nas colunas para documentação
COMMENT ON TABLE artist_performance_evaluations IS 'Avaliações trimestrais de desempenho artístico e comportamental dos membros';
COMMENT ON COLUMN artist_performance_evaluations.quarter IS 'Trimestre: 1 (Jan-Abr), 2 (Mai-Ago), 3 (Set-Dez)';
COMMENT ON COLUMN artist_performance_evaluations.presenca_reunioes_presenciais IS 'Nota de presença nas reuniões presenciais (0-20)';
COMMENT ON COLUMN artist_performance_evaluations.presenca_reunioes_online IS 'Nota de presença nas reuniões online (0-20)';
COMMENT ON COLUMN artist_performance_evaluations.presenca_espetaculos IS 'Nota de presença nos espetáculos (0-20)';
COMMENT ON COLUMN artist_performance_evaluations.cumprimento_tarefas IS 'Nota de cumprimento das tarefas (0-20)';
COMMENT ON COLUMN artist_performance_evaluations.producao_artistica IS 'Nota da produção artística ou colaboração (0-20)';
COMMENT ON COLUMN artist_performance_evaluations.comportamento_disciplina IS 'Nota de comportamento ou disciplina (0-20)';
COMMENT ON COLUMN artist_performance_evaluations.regularizacao_quota IS 'Nota de regularização da quota (0-20)';
COMMENT ON COLUMN artist_performance_evaluations.media_final IS 'Média final calculada automaticamente (soma / 7)';
