import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { upload } from '../config/multer';
import {
  createQuotaPayment,
  getQuotaPayments,
  getQuotaPaymentById,
  updateQuotaPayment,
  deleteQuotaPayment,
  approveQuotaPayment,
  rejectQuotaPayment
} from '../controllers/artistQuotaPaymentController';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Rotas de pagamentos de cota
router.post('/', upload.single('comprovante'), createQuotaPayment);
router.get('/', getQuotaPayments);
router.get('/:id', getQuotaPaymentById);
router.put('/:id', upload.single('comprovante'), updateQuotaPayment);
router.delete('/:id', deleteQuotaPayment);

// Rotas de aprovação/rejeição (apenas admin)
router.post('/:id/approve', approveQuotaPayment);
router.post('/:id/reject', rejectQuotaPayment);

export default router;
