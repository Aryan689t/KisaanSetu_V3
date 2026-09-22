import { Router } from 'express';
import { checkIn, callNext, completeProcurement, sendToDryingYard } from '../controllers/operator.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// In demo mode, requireRole permits operator or demo role
router.post('/check-in', authenticate, requireRole(['operator', 'admin', 'farmer']), checkIn);
router.post('/call-next', authenticate, requireRole(['operator', 'admin', 'farmer']), callNext);
router.post('/complete-procurement', authenticate, requireRole(['operator', 'admin', 'farmer']), completeProcurement);
router.post('/send-to-drying-yard', authenticate, requireRole(['operator', 'admin', 'farmer']), sendToDryingYard);
router.post('/drying-yard', authenticate, requireRole(['operator', 'admin', 'farmer']), sendToDryingYard);

export default router;

