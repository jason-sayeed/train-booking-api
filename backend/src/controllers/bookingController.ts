import { RequestHandler } from 'express';
import Booking from '../models/bookingModel';
import { handleError } from '../utils/handleError';
import {
  sendError,
  sendSuccess,
} from '../utils/responseHelper';

export const createBooking: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const { user, train, seatsBooked, bookingDate } =
      req.body;

    if (!user || !train || !seatsBooked || !bookingDate) {
      return sendError(
        res,
        'User, train, seatsBooked and bookingDate are required',
        400,
      );
    }

    const booking = new Booking({
      user,
      train,
      seatsBooked,
      bookingDate,
    });

    const savedBooking = await booking.save();
    return sendSuccess(res, savedBooking, 201);
  } catch (error: unknown) {
    return handleError(res, error);
  }
};

export const getBookingById: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return sendError(res, 'Booking not found', 404);
    }
    return sendSuccess(res, booking);
  } catch (error: unknown) {
    return handleError(res, error);
  }
};

export const updateBooking: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const { seatsBooked, bookingDate } = req.body;
    if (seatsBooked < 1) {
      return sendError(
        res,
        'seatsBooked must be at least 1',
        400,
      );
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { seatsBooked, bookingDate },
      { new: true, runValidators: true },
    );

    if (!updatedBooking) {
      return sendError(res, 'Booking not found', 404);
    }

    return sendSuccess(res, updatedBooking);
  } catch (error: unknown) {
    return handleError(res, error);
  }
};

export const deleteBooking: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedBooking) {
      return sendError(res, 'Booking not found', 404);
    }
    return sendSuccess(res, {
      message: 'Booking successfully deleted',
    });
  } catch (error: unknown) {
    return handleError(res, error);
  }
};
