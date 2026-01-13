import express, { Request, Response } from 'express';
import ArtistQuotaModel from '../models/ArtistQuota';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { upload } from '../config/multer';
import { SupabaseStorageService } from '../services/SupabaseStorageService';

const router = express.Router();

/**
 * @swagger
 * /api/artist-quotas/debug/me:
 *   get:
 *     summary: Debug endpoint to check current user
 *     tags: [ArtistQuotas]
 *     security:
 *       - bearerAuth: []
 */
router.get('/debug/me', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({
    user: req.user,
    message: 'Token decodificado com sucesso'
  });
}));

/**
 * @swagger
 * /api/artist-quotas/debug/check-artists:
 *   get:
 *     summary: Debug endpoint to check artists in database
 *     tags: [ArtistQuotas]
 */
router.get('/debug/check-artists', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { supabase } = await import('../config/database');
  
  // Get all users with all fields
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  
  // Group by role
  const byRole: Record<string, number> = {};
  users?.forEach(user => {
    const role = user.role || 'undefined';
    byRole[role] = (byRole[role] || 0) + 1;
  });
  
  const artistUsers = users?.filter(u => u.role === 'artista') || [];
  
  res.json({
    total_users: users?.length || 0,
    by_role: byRole,
    all_users: users?.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      hasPassword: !!u.password,
      passwordLength: u.password?.length || 0,
      created_at: u.created_at
    })),
    artists: artistUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isActive: u.isActive,
      hasPassword: !!u.password
    })),
    message: artistUsers.length > 0 
      ? `Encontrados ${artistUsers.length} artistas` 
      : 'Nenhum usuário com role "artista" encontrado'
  });
}));

/**
 * @swagger
 * /api/artist-quotas:
 *   post:
 *     summary: Create a new quota payment (Artist only)
 *     tags: [ArtistQuotas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - payment_date
 *             properties:
 *               amount:
 *                 type: number
 *               payment_date:
 *                 type: string
 *                 format: date
 *               payment_method:
 *                 type: string
 *               payment_reference:
 *                 type: string
 *               notes:
 *                 type: string
 *               proof_of_payment:
 *                 type: string
 *                 format: binary
 */
router.post('/', authenticate, upload.single('proof_of_payment'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  // Verify user is an artist
  if (user?.role !== 'artista') {
    res.status(403).json({ error: 'Apenas artistas podem registrar quotas' });
    return;
  }

  const { amount, payment_date, payment_method, payment_reference, notes } = req.body;

  if (!amount || !payment_date) {
    res.status(400).json({ error: 'Valor e data de pagamento são obrigatórios' });
    return;
  }

  // Upload proof of payment to Supabase if file is provided
  let proofOfPaymentUrl: string | undefined;
  if (req.file) {
    proofOfPaymentUrl = await SupabaseStorageService.uploadImage(req.file);
  }

  const quotaData = {
    artist_id: user?.id,
    amount: parseFloat(amount),
    payment_date: new Date(payment_date),
    payment_method,
    payment_reference,
    proof_of_payment: proofOfPaymentUrl,
    notes
  };

  const quotaId = await ArtistQuotaModel.create(quotaData);
  const quota = await ArtistQuotaModel.findById(quotaId);

  res.status(201).json(quota);
}));

/**
 * @swagger
 * /api/artist-quotas/my-quotas:
 *   get:
 *     summary: Get current artist's quotas
 *     tags: [ArtistQuotas]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-quotas', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  // Debug logging
  console.log('🔍 Debug /my-quotas - User:', JSON.stringify(user, null, 2));
  
  if (user?.role !== 'artista') {
    console.log('❌ Acesso negado - Role:', user?.role);
    res.status(403).json({ 
      error: 'Apenas artistas podem acessar esta rota',
      debug: {
        receivedRole: user?.role,
        expectedRole: 'artista'
      }
    });
    return;
  }

  const quotas = await ArtistQuotaModel.findByArtist(user.id);
  res.json(quotas);
}));

/**
 * @swagger
 * /api/artist-quotas/my-stats:
 *   get:
 *     summary: Get current artist's quota statistics
 *     tags: [ArtistQuotas]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-stats', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (user?.role !== 'artista') {
    res.status(403).json({ error: 'Apenas artistas podem acessar esta rota' });
    return;
  }

  const stats = await ArtistQuotaModel.getArtistStats(user.id);
  res.json(stats);
}));

/**
 * @swagger
 * /api/artist-quotas:
 *   get:
 *     summary: Get all quotas (Admin only)
 *     tags: [ArtistQuotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 */
router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Acesso negado' });
    return;
  }

  const { status } = req.query;
  const quotas = await ArtistQuotaModel.findAll(status as string);
  res.json(quotas);
}));

/**
 * @swagger
 * /api/artist-quotas/{id}:
 *   get:
 *     summary: Get quota by ID
 *     tags: [ArtistQuotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const quota = await ArtistQuotaModel.findById(req.params.id);

  if (!quota) {
    return res.status(404).json({ error: 'Quota não encontrada' });
  }

  // Artists can only see their own quotas
  if (user?.role === 'artista' && quota.artist_id !== user.id) {
    res.status(403).json({ error: 'Acesso negado' });
    return;
  }

  res.json(quota);
}));

/**
 * @swagger
 * /api/artist-quotas/{id}/approve:
 *   patch:
 *     summary: Approve or reject quota payment (Admin only)
 *     tags: [ArtistQuotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               notes:
 *                 type: string
 */
router.patch('/:id/approve', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Apenas administradores podem aprovar quotas' });
    return;
  }

  const { status, notes } = req.body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    res.status(400).json({ error: 'Status inválido' });
    return;
  }

  const updateData: any = {
    status,
    approved_by: user.id
  };

  if (notes) {
    updateData.notes = notes;
  }

  const updated = await ArtistQuotaModel.update(req.params.id, updateData);

  if (!updated) {
    res.status(404).json({ error: 'Quota não encontrada' });
    return;
  }

  const quota = await ArtistQuotaModel.findById(req.params.id);
  res.json(quota);
}));

/**
 * @swagger
 * /api/artist-quotas/{id}:
 *   put:
 *     summary: Update quota (Artist can update pending quotas only)
 *     tags: [ArtistQuotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put('/:id', authenticate, upload.single('proof_of_payment'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const quota = await ArtistQuotaModel.findById(req.params.id);

  if (!quota) {
    return res.status(404).json({ error: 'Quota não encontrada' });
  }

  // Artists can only update their own pending quotas
  if (user?.role === 'artista') {
    if (quota.artist_id !== user.id) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }
    if (quota.status !== 'pending') {
      res.status(400).json({ error: 'Apenas quotas pendentes podem ser editadas' });
      return;
    }
  }

  const { amount, payment_date, payment_method, payment_reference, notes } = req.body;

  const updateData: any = {};
  if (amount) updateData.amount = parseFloat(amount);
  if (payment_date) updateData.payment_date = new Date(payment_date);
  if (payment_method) updateData.payment_method = payment_method;
  if (payment_reference) updateData.payment_reference = payment_reference;
  if (notes) updateData.notes = notes;
  
  // Upload new proof of payment to Supabase if file is provided
  if (req.file) {
    // Delete old proof if exists
    if (quota.proof_of_payment) {
      await SupabaseStorageService.deleteImage(quota.proof_of_payment);
    }
    updateData.proof_of_payment = await SupabaseStorageService.uploadImage(req.file);
  }

  await ArtistQuotaModel.update(req.params.id, updateData);
  const updatedQuota = await ArtistQuotaModel.findById(req.params.id);

  res.json(updatedQuota);
}));

/**
 * @swagger
 * /api/artist-quotas/{id}:
 *   delete:
 *     summary: Delete quota (Admin only or artist's own pending quota)
 *     tags: [ArtistQuotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  const quota = await ArtistQuotaModel.findById(req.params.id);

  if (!quota) {
    return res.status(404).json({ error: 'Quota não encontrada' });
  }

  // Artists can only delete their own pending quotas
  if (user?.role === 'artista') {
    if (quota.artist_id !== user.id || quota.status !== 'pending') {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }
  }

  // Delete proof of payment from Supabase if exists
  if (quota.proof_of_payment) {
    await SupabaseStorageService.deleteImage(quota.proof_of_payment);
  }

  await ArtistQuotaModel.delete(req.params.id);
  res.json({ message: 'Quota excluída com sucesso' });
}));

export default router;
