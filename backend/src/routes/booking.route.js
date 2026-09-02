import { Router } from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getBookings);
router.get('/:id', getBookingById);
router.post('/', authenticate, createBooking);
router.patch('/:id', authenticate, updateBooking);
router.delete('/:id', authenticate, deleteBooking);

export default router;
