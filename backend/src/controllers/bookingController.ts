import { RequestHandler } from 'express';
import Booking from '../models/bookingModel';
import { handleError } from '../utils/handleError';
import {
  sendError,
  sendSuccess,
} from '../utils/responseHelper';
import { IUser } from '../models/userModel';
import { IBooking } from '../models/bookingModel';

export const createBooking: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    if (!req.user) {
      return sendError(res, 'User not authenticated', 401);
    }

    const user = req.user as IUser;
    const { trainId, seatsBooked, bookingDate } = req.body;

    if (!trainId) {
      return sendError(res, 'train is required', 400);
    }

    if (!seatsBooked) {
      return sendError(res, 'seatsBooked is required', 400);
    }

    if (!bookingDate) {
      return sendError(res, 'bookingDate is required', 400);
    }

    const savedBooking: IBooking = await Booking.create({
      userId: user._id,
      ...req.body,
    });

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
    const booking: IBooking | null = await Booking.findById(
      req.params.id,
    );
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

    const updatedBooking: IBooking | null =
      await Booking.findByIdAndUpdate(
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
    const deletedBooking: IBooking | null =
      await Booking.findByIdAndDelete(req.params.id);
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
