import { Router, Request, Response } from 'express'
import { NotificationSettingsService } from '../services/NotificationSettingsService'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

// Obter configurações do usuário
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' })
    }
    
    const settings = await NotificationSettingsService.getUserSettings(userId)
    
    res.json(settings)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar configurações' })
  }
})

// Atualizar configurações
router.patch('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' })
    }
    
    const updates = req.body
    
    const settings = await NotificationSettingsService.updateSettings(userId, updates)
    
    res.json(settings)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar configurações' })
  }
})

export default router
