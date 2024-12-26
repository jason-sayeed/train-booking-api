import express, { Router } from 'express';
import {
  createBooking,
  updateBooking,
  getBookingById,
  deleteBooking,
} from '../controllers/bookingController';

const router: Router = express.Router();

router.get('/:id', getBookingById);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;
