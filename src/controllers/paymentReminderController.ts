import { Request, Response } from 'express';
import { 
  sendMonthlyReminders, 
  sendReminderToArtist, 
  getArtistsWithoutPayment 
} from '../services/paymentReminderService';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Enviar lembretes para todos os artistas que não pagaram (apenas admin)
 */
export const sendRemindersToAll = async (req: AuthRequest, res: Response) => {
  try {
    // Verificar se é admin
    if (req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem enviar lembretes'
      });
    }

    const result = await sendMonthlyReminders();

    res.json({
      success: true,
      message: 'Lembretes enviados com sucesso',
      sent: result.sent,
      errors: result.errors
    });
  } catch (error) {
    console.error('Erro ao enviar lembretes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar lembretes'
    });
  }
};

/**
 * Enviar lembrete para um artista específico (apenas admin)
 */
export const sendReminderToSpecificArtist = async (req: AuthRequest, res: Response) => {
  try {
    const { artistId } = req.params;

    // Verificar se é admin
    if (req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem enviar lembretes'
      });
    }

    await sendReminderToArtist(artistId);

    res.json({
      success: true,
      message: 'Lembrete enviado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao enviar lembrete:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar lembrete'
    });
  }
};

/**
 * Listar artistas que ainda não pagaram a quota do mês (apenas admin)
 */
export const getPendingArtists = async (req: AuthRequest, res: Response) => {
  try {
    // Verificar se é admin
    if (req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem acessar esta informação'
      });
    }

    const artists = await getArtistsWithoutPayment();

    res.json({
      success: true,
      count: artists.length,
      artists: artists
    });
  } catch (error) {
    console.error('Erro ao buscar artistas pendentes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar artistas pendentes'
    });
  }
};
