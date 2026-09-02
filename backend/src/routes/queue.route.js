import { Router } from 'express';
import { getCentreQueue, getQueuePosition } from '../controllers/queue.controller.js';

const router = Router();

router.get('/:centreId', getCentreQueue);
router.get('/:centreId/position/:bookingId', getQueuePosition);

export default router;
