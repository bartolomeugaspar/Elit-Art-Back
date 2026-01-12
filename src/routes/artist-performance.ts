import express, { Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { supabase } from '../config/database';

const router = express.Router();

/**
 * @swagger
 * /api/artist-performance/my-stats:
 *   get:
 *     summary: Get current artist's performance statistics
 *     tags: [ArtistPerformance]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-stats', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (user?.role !== 'artista') {
    res.status(403).json({ error: 'Apenas artistas podem acessar esta rota' });
    return;
  }

  // Get artwork statistics
  const { data: artworks } = await supabase
    .from('artworks')
    .select('*')
    .eq('artist_id', user.id);

  const artworkStats = {
    total_artworks: artworks?.length || 0,
    available_artworks: artworks?.filter(a => a.status === 'available').length || 0,
    sold_artworks: artworks?.filter(a => a.status === 'sold').length || 0,
    avg_price: artworks?.length ? artworks.reduce((sum, a) => sum + (a.price || 0), 0) / artworks.length : 0,
    min_price: artworks?.length ? Math.min(...artworks.map(a => a.price || 0)) : 0,
    max_price: artworks?.length ? Math.max(...artworks.map(a => a.price || 0)) : 0,
  };

  // Get sales statistics (simplified - adapt to your order structure)
  const salesStats = {
    total_sales: 0,
    total_revenue: 0,
    unique_customers: 0,
    avg_sale_value: 0,
  };

  const recentPerformance = {
    recent_sales: 0,
    recent_revenue: 0,
  };

  const monthly_trend: any[] = [];
  const top_artworks: any[] = [];

  res.json({
    artwork_stats: artworkStats,
    sales_stats: salesStats,
    recent_performance: recentPerformance,
    monthly_trend,
    top_artworks,
  });
}));

/**
 * @swagger
 * /api/artist-performance/{artistId}/stats:
 *   get:
 *     summary: Get artist performance statistics (Admin only)
 *     tags: [ArtistPerformance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:artistId/stats', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (user?.role !== 'admin') {
    res.status(403).json({ error: 'Acesso negado' });
    return;
  }

  const artistId = req.params.artistId;

  // Get artwork statistics
  const { data: artworks } = await supabase
    .from('artworks')
    .select('*')
    .eq('artist_id', artistId);

  const artworkStats = {
    total_artworks: artworks?.length || 0,
    available_artworks: artworks?.filter(a => a.status === 'available').length || 0,
    sold_artworks: artworks?.filter(a => a.status === 'sold').length || 0,
    avg_price: artworks?.length ? artworks.reduce((sum, a) => sum + (a.price || 0), 0) / artworks.length : 0,
    min_price: artworks?.length ? Math.min(...artworks.map(a => a.price || 0)) : 0,
    max_price: artworks?.length ? Math.max(...artworks.map(a => a.price || 0)) : 0,
  };

  const salesStats = {
    total_sales: 0,
    total_revenue: 0,
    unique_customers: 0,
    avg_sale_value: 0,
  };

  const monthly_trend: any[] = [];

  res.json({
    artwork_stats: artworkStats,
    sales_stats: salesStats,
    monthly_trend,
  });
}));

export default router;
