import { Router, Request, Response } from 'express'
import { NotificationSettingsService } from '../services/NotificationSettingsService'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Obter configurações do usuário
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId
    const settings = await NotificationSettingsService.getUserSettings(userId)
    
    res.json(settings)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar configurações' })
  }
})

// Atualizar configurações
router.patch('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId
    const updates = req.body
    
    const settings = await NotificationSettingsService.updateSettings(userId, updates)
    
    res.json(settings)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar configurações' })
  }
})

export default router
