-- Script de exemplo para inserir avaliações de desempenho de teste
-- ATENÇÃO: Este script é apenas para testes. Ajuste os IDs conforme sua base de dados.

-- Exemplo 1: Artista com excelente desempenho no I Trimestre 2026
INSERT INTO artist_performance_evaluations (
    artist_id,
    year,
    quarter,
    presenca_reunioes_presenciais,
    presenca_reunioes_online,
    presenca_espetaculos,
    cumprimento_tarefas,
    producao_artistica,
    comportamento_disciplina,
    regularizacao_quota,
    observacoes,
    created_by
) VALUES (
    1, -- Substitua pelo ID real do artista
    2026,
    1,
    18.5,
    19.0,
    20.0,
    17.5,
    19.0,
    18.0,
    20.0,
    'Excelente desempenho geral. Muito participativo e comprometido com as atividades do Elit''Arte.',
    1 -- Substitua pelo ID do admin que está criando
);

-- Exemplo 2: Artista com bom desempenho
INSERT INTO artist_performance_evaluations (
    artist_id,
    year,
    quarter,
    presenca_reunioes_presenciais,
    presenca_reunioes_online,
    presenca_espetaculos,
    cumprimento_tarefas,
    producao_artistica,
    comportamento_disciplina,
    regularizacao_quota,
    observacoes,
    created_by
) VALUES (
    2, -- Substitua pelo ID real do artista
    2026,
    1,
    15.0,
    14.0,
    16.0,
    15.5,
    16.0,
    17.0,
    14.0,
    'Bom desempenho. Poderia melhorar a presença nas reuniões online.',
    1
);

-- Exemplo 3: Artista com desempenho satisfatório
INSERT INTO artist_performance_evaluations (
    artist_id,
    year,
    quarter,
    presenca_reunioes_presenciais,
    presenca_reunioes_online,
    presenca_espetaculos,
    cumprimento_tarefas,
    producao_artistica,
    comportamento_disciplina,
    regularizacao_quota,
    observacoes,
    created_by
) VALUES (
    3, -- Substitua pelo ID real do artista
    2026,
    1,
    12.0,
    11.0,
    13.0,
    12.5,
    14.0,
    13.0,
    10.0,
    'Desempenho satisfatório. Recomenda-se maior empenho na regularização das quotas.',
    1
);

-- Exemplo 4: Artista com desempenho que necessita melhoria
INSERT INTO artist_performance_evaluations (
    artist_id,
    year,
    quarter,
    presenca_reunioes_presenciais,
    presenca_reunioes_online,
    presenca_espetaculos,
    cumprimento_tarefas,
    producao_artistica,
    comportamento_disciplina,
    regularizacao_quota,
    observacoes,
    created_by
) VALUES (
    4, -- Substitua pelo ID real do artista
    2026,
    1,
    8.0,
    7.0,
    9.0,
    10.0,
    11.0,
    9.0,
    6.0,
    'Desempenho abaixo do esperado. Necessita maior compromisso com as atividades e regularização das quotas.',
    1
);

-- Consulta para verificar as avaliações criadas
SELECT 
    ape.id,
    a.name as artista,
    ape.year,
    ape.quarter,
    ape.presenca_reunioes_presenciais,
    ape.presenca_reunioes_online,
    ape.presenca_espetaculos,
    ape.cumprimento_tarefas,
    ape.producao_artistica,
    ape.comportamento_disciplina,
    ape.regularizacao_quota,
    ape.media_final,
    ape.observacoes,
    ape.created_at
FROM artist_performance_evaluations ape
LEFT JOIN artists a ON a.id = ape.artist_id
WHERE ape.year = 2026 AND ape.quarter = 1
ORDER BY ape.media_final DESC;

-- Consulta para estatísticas do trimestre
SELECT 
    COUNT(*) as total_avaliacoes,
    ROUND(AVG(media_final), 2) as media_geral,
    ROUND(MAX(media_final), 2) as melhor_media,
    ROUND(MIN(media_final), 2) as pior_media
FROM artist_performance_evaluations
WHERE year = 2026 AND quarter = 1;

-- Consulta para ver artistas que precisam de atenção (média < 12)
SELECT 
    a.name as artista,
    a.email,
    ape.media_final,
    ape.observacoes
FROM artist_performance_evaluations ape
JOIN artists a ON a.id = ape.artist_id
WHERE ape.year = 2026 
  AND ape.quarter = 1
  AND ape.media_final < 12
ORDER BY ape.media_final ASC;
