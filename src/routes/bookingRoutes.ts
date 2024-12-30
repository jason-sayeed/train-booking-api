import express, { Router } from 'express';
import {
  createBooking,
  updateBooking,
  getBookingById,
  deleteBooking,
} from '../controllers/bookingController';
import { ensureAuthenticated } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.get('/:id', ensureAuthenticated, getBookingById);
router.post('/', ensureAuthenticated, createBooking);
router.put('/:id', ensureAuthenticated, updateBooking);
router.delete('/:id', ensureAuthenticated, deleteBooking);

export default router;
