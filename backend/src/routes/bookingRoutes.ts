import express, { Router } from 'express';
import {
  createBooking,
  updateBooking,
  getBookingById,
  deleteBooking,
} from '../controllers/bookingController';

const router: Router = express.Router();

router.get('/:bookingId', getBookingById);
router.post('/', createBooking);
router.put('/:bookingId', updateBooking);
router.delete('/:bookingId', deleteBooking);

export default router;
