import { Router } from 'express';
import { getAdminOverview, getPendingPayments, disbursePayment } from '../controllers/admin.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/overview', authenticate, requireRole(['admin', 'operator', 'farmer']), getAdminOverview);
router.get('/pending-payments', authenticate, requireRole(['admin', 'operator', 'farmer']), getPendingPayments);
router.post('/disburse-payment', authenticate, requireRole(['admin', 'operator', 'farmer']), disbursePayment);

export default router;
