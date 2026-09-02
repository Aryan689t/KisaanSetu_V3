import { Router } from 'express';
import { checkIn, callNext, completeProcurement } from '../controllers/operator.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// In demo mode, requireRole permits operator or demo role
router.post('/check-in', authenticate, requireRole(['operator', 'admin', 'farmer']), checkIn);
router.post('/call-next', authenticate, requireRole(['operator', 'admin', 'farmer']), callNext);
router.post('/complete-procurement', authenticate, requireRole(['operator', 'admin', 'farmer']), completeProcurement);

export default router;
