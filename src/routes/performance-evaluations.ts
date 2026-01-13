import express, { Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { supabase } from '../config/database';
import { z } from 'zod';

const router = express.Router();

// Validação do schema de avaliação
const evaluationSchema = z.object({
  artist_id: z.string().uuid(),
  year: z.number().int().min(2020).max(2100),
  quarter: z.number().int().min(1).max(3),
  presenca_reunioes_presenciais: z.number().min(0).max(20),
  presenca_reunioes_online: z.number().min(0).max(20),
  presenca_espetaculos: z.number().min(0).max(20),
  cumprimento_tarefas: z.number().min(0).max(20),
  producao_artistica: z.number().min(0).max(20),
  comportamento_disciplina: z.number().min(0).max(20),
  regularizacao_quota: z.number().min(0).max(20),
  observacoes: z.string().optional(),
});

// Helper para determinar o trimestre atual
const getCurrentQuarterInfo = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();
  
  let quarter: number;
  if (month >= 1 && month <= 4) quarter = 1;
  else if (month >= 5 && month <= 8) quarter = 2;
  else quarter = 3;
  
  return { year, quarter };
};

/**
 * @swagger
 * /api/performance-evaluations:
 *   post:
 *     summary: Create a new performance evaluation (Admin only)
 *     tags: [PerformanceEvaluations]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Apenas administradores podem criar avaliações' });
    return;
  }

  try {
    const validatedData = evaluationSchema.parse(req.body);
    
    const { data, error } = await supabase
      .from('artist_performance_evaluations')
      .insert({
        ...validatedData,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        res.status(409).json({ 
          error: 'Já existe uma avaliação para este artista neste trimestre' 
        });
        return;
      }
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    throw error;
  }
}));

/**
 * @swagger
 * /api/performance-evaluations/{id}:
 *   put:
 *     summary: Update a performance evaluation (Admin only)
 *     tags: [PerformanceEvaluations]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Apenas administradores podem atualizar avaliações' });
    return;
  }

  const evaluationId = parseInt(req.params.id);
  
  try {
    const updateData = {
      presenca_reunioes_presenciais: req.body.presenca_reunioes_presenciais,
      presenca_reunioes_online: req.body.presenca_reunioes_online,
      presenca_espetaculos: req.body.presenca_espetaculos,
      cumprimento_tarefas: req.body.cumprimento_tarefas,
      producao_artistica: req.body.producao_artistica,
      comportamento_disciplina: req.body.comportamento_disciplina,
      regularizacao_quota: req.body.regularizacao_quota,
      observacoes: req.body.observacoes,
      updated_by: user.id,
    };

    const { data, error } = await supabase
      .from('artist_performance_evaluations')
      .update(updateData)
      .eq('id', evaluationId)
      .select()
      .single();

    if (error) throw error;
    
    if (!data) {
      res.status(404).json({ error: 'Avaliação não encontrada' });
      return;
    }

    res.json(data);
  } catch (error) {
    throw error;
  }
}));

/**
 * @swagger
 * /api/performance-evaluations/{id}:
 *   delete:
 *     summary: Delete a performance evaluation (Admin only)
 *     tags: [PerformanceEvaluations]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Apenas administradores podem deletar avaliações' });
    return;
  }

  const evaluationId = parseInt(req.params.id);
  
  const { error } = await supabase
    .from('artist_performance_evaluations')
    .delete()
    .eq('id', evaluationId);

  if (error) throw error;

  res.json({ message: 'Avaliação deletada com sucesso' });
}));

/**
 * @swagger
 * /api/performance-evaluations/artist/{artistId}:
 *   get:
 *     summary: Get all evaluations for a specific artist
 *     tags: [PerformanceEvaluations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/artist/:artistId', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const artistId = req.params.artistId;
  
  // Artistas só podem ver suas próprias avaliações
  if (user?.role === 'artista' && user.id !== artistId) {
    res.status(403).json({ error: 'Acesso negado' });
    return;
  }

  const { data, error } = await supabase
    .from('artist_performance_evaluations')
    .select(`
      *,
      artists!artist_id(id, name, email, image)
    `)
    .eq('artist_id', artistId)
    .order('year', { ascending: false })
    .order('quarter', { ascending: false });

  if (error) throw error;

  const evaluations = (data || []).map((evaluation: any) => ({
    ...evaluation,
    artist: evaluation.artists
  }));

  res.json(evaluations);
}));

/**
 * @swagger
 * /api/performance-evaluations/my-evaluations:
 *   get:
 *     summary: Get current artist's evaluations
 *     tags: [PerformanceEvaluations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-evaluations', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (!user) {
    res.status(401).json({ error: 'Não autenticado' });
    return;
  }

  console.log('🔍 Buscando avaliações para user ID:', user.id);
  console.log('👤 User data:', { id: user.id, email: user.email, role: user.role });

  // Primeiro, buscar o artist_id baseado no email do usuário
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('email')
    .eq('id', user.id)
    .single();

  if (userError) {
    console.error('Error fetching user:', userError);
  }

  const userEmail = userData?.email || user.email;
  console.log('📧 User email:', userEmail);

  // Buscar o artista pelo email
  const { data: artistData, error: artistError } = await supabase
    .from('artists')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (artistError) {
    console.error('Error fetching artist:', artistError);
    res.json([]);
    return;
  }

  const artistId = artistData?.id;
  console.log('🎨 Artist ID found:', artistId);

  // Buscar avaliações usando o artist_id
  const { data, error } = await supabase
    .from('artist_performance_evaluations')
    .select('*')
    .eq('artist_id', artistId)
    .order('year', { ascending: false })
    .order('quarter', { ascending: false });

  if (error) {
    console.error('Error fetching evaluations:', error);
    throw error;
  }

  console.log('📊 Avaliações encontradas:', data?.length || 0);
  
  res.json(data || []);
}));

/**
 * @swagger
 * /api/performance-evaluations/quarter/{year}/{quarter}:
 *   get:
 *     summary: Get all evaluations for a specific quarter (Admin only)
 *     tags: [PerformanceEvaluations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/quarter/:year/:quarter', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Acesso negado' });
    return;
  }

  const year = parseInt(req.params.year);
  const quarter = parseInt(req.params.quarter);

  try {
    const { data, error } = await supabase
      .from('artist_performance_evaluations')
      .select(`
        *,
        artists!artist_id(id, name, email, image)
      `)
      .eq('year', year)
      .eq('quarter', quarter)
      .order('media_final', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Transformar dados para o formato esperado pelo frontend
    const evaluations = (data || []).map((evaluation: any) => ({
      ...evaluation,
      artist: evaluation.artists
    }));

    res.json(evaluations);
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    throw error;
  }
}));

/**
 * @swagger
 * /api/performance-evaluations/current-quarter:
 *   get:
 *     summary: Get all evaluations for the current quarter (Admin only)
 *     tags: [PerformanceEvaluations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/current-quarter', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Acesso negado' });
    return;
  }

  const { year, quarter } = getCurrentQuarterInfo();

  const { data, error } = await supabase
    .from('artist_performance_evaluations')
    .select(`
      *,
      artists!artist_id(id, name, email, image)
    `)
    .eq('year', year)
    .eq('quarter', quarter)
    .order('media_final', { ascending: false });

  if (error) throw error;

  const evaluations = (data || []).map((evaluation: any) => ({
    ...evaluation,
    artist: evaluation.artists
  }));

  res.json({
    year,
    quarter,
    evaluations,
  });
}));

/**
 * @swagger
 * /api/performance-evaluations/statistics:
 *   get:
 *     summary: Get overall performance statistics (Admin only)
 *     tags: [PerformanceEvaluations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/statistics', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Acesso negado' });
    return;
  }

  const { year, quarter } = getCurrentQuarterInfo();

  // Get current quarter statistics
  const { data: currentQuarter } = await supabase
    .from('artist_performance_evaluations')
    .select('*')
    .eq('year', year)
    .eq('quarter', quarter);

  // Get overall statistics
  const { data: allEvaluations } = await supabase
    .from('artist_performance_evaluations')
    .select('*');

  const stats = {
    current_quarter: {
      year,
      quarter,
      total_evaluations: currentQuarter?.length || 0,
      avg_media_final: currentQuarter?.length 
        ? currentQuarter.reduce((sum, e) => sum + (e.media_final || 0), 0) / currentQuarter.length 
        : 0,
      highest_score: currentQuarter?.length 
        ? Math.max(...currentQuarter.map(e => e.media_final || 0)) 
        : 0,
      lowest_score: currentQuarter?.length 
        ? Math.min(...currentQuarter.map(e => e.media_final || 0)) 
        : 0,
    },
    all_time: {
      total_evaluations: allEvaluations?.length || 0,
      avg_media_final: allEvaluations?.length 
        ? allEvaluations.reduce((sum, e) => sum + (e.media_final || 0), 0) / allEvaluations.length 
        : 0,
    },
  };

  res.json(stats);
}));

export default router;
