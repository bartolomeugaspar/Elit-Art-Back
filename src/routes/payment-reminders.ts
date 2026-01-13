import express from 'express';
import { authenticate as authenticateToken } from '../middleware/auth';
import {
  sendRemindersToAll,
  sendReminderToSpecificArtist,
  getPendingArtists
} from '../controllers/paymentReminderController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Lembretes de Pagamento
 *   description: Endpoints para gerenciar lembretes de pagamento de quotas
 */

/**
 * @swagger
 * /payment-reminders/send-all:
 *   post:
 *     tags: [Lembretes de Pagamento]
 *     summary: Enviar lembretes para todos os artistas que não pagaram (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lembretes enviados com sucesso
 *       403:
 *         description: Sem permissão (apenas admin)
 */
router.post('/send-all', authenticateToken, sendRemindersToAll);

/**
 * @swagger
 * /payment-reminders/send/{artistId}:
 *   post:
 *     tags: [Lembretes de Pagamento]
 *     summary: Enviar lembrete para um artista específico (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do artista
 *     responses:
 *       200:
 *         description: Lembrete enviado com sucesso
 *       403:
 *         description: Sem permissão (apenas admin)
 */
router.post('/send/:artistId', authenticateToken, sendReminderToSpecificArtist);

/**
 * @swagger
 * /payment-reminders/pending:
 *   get:
 *     tags: [Lembretes de Pagamento]
 *     summary: Listar artistas que ainda não pagaram a quota do mês (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de artistas pendentes
 *       403:
 *         description: Sem permissão (apenas admin)
 */
router.get('/pending', authenticateToken, getPendingArtists);

export default router;
