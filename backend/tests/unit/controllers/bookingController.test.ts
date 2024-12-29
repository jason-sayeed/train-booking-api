import { Request, Response } from 'express';
import {
  createRequest,
  createResponse,
} from 'node-mocks-http';
import {
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingById,
} from '../../../src/controllers/bookingController';
import Booking from '../../../src/models/bookingModel';
import {
  sendError,
  sendSuccess,
} from '../../../src/utils/responseHelper';

jest.mock('../../../src/models/bookingModel');
jest.mock('../../../src/utils/responseHelper');
import { IBooking } from '../../../src/models/bookingModel';

let req: Request;
let res: Response;
let next: jest.Mock;

beforeEach(() => {
  req = createRequest();
  res = createResponse();
  next = jest.fn();

  jest.clearAllMocks();
});

describe('Booking Controller', () => {
  describe('createBooking', () => {
    it('should return an error if required fields are missing', async () => {
      req.user = { _id: 'mockUserId' };
      req.body = {
        train: 'trainId',
        seatsBooked: 2,
      };

      await createBooking(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'bookingDate is required',
        400,
      );
    });

    it('should create and return a booking if all fields are valid', async () => {
      req.user = { _id: 'mockUserId' };
      req.body = {
        train: 'trainId',
        seatsBooked: 2,
        bookingDate: '2024-12-29T12:00:00.000Z',
      };

      const mockBooking: IBooking = {
        _id: 'mockBookingId',
        ...req.body,
      };

      (Booking.create as jest.Mock).mockResolvedValue(
        mockBooking,
      );

      await createBooking(req, res, next);

      expect(Booking.create).toHaveBeenCalledWith({
        user: 'mockUserId',
        train: 'trainId',
        seatsBooked: 2,
        bookingDate: '2024-12-29T12:00:00.000Z',
      });
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        mockBooking,
        201,
      );
    });
  });

  describe('getBookingById', () => {
    it('should return a booking by ID', async () => {
      req.params.id = 'bookingId123';
      const mockBooking = {
        _id: 'bookingId123',
        user: 'userId',
        train: 'trainId',
        seatsBooked: 2,
        bookingDate: new Date(),
      };

      (Booking.findById as jest.Mock).mockResolvedValue(
        mockBooking,
      );

      await getBookingById(req, res, next);

      expect(Booking.findById).toHaveBeenCalledWith(
        'bookingId123',
      );
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        mockBooking,
      );
    });

    it('should return an error if booking not found', async () => {
      req.params.id = 'bookingId123';
      (Booking.findById as jest.Mock).mockResolvedValue(
        null,
      );

      await getBookingById(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'Booking not found',
        404,
      );
    });
  });

  describe('updateBooking', () => {
    it('should return an error if seatsBooked is less than 1', async () => {
      req.params.id = 'bookingId123';
      req.body = {
        seatsBooked: 0,
        bookingDate: new Date(),
      };

      await updateBooking(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'seatsBooked must be at least 1',
        400,
      );
    });

    it('should update a booking successfully', async () => {
      req.params.id = 'bookingId123';
      req.body = {
        seatsBooked: 3,
        bookingDate: new Date(),
      };

      const mockUpdatedBooking = {
        _id: 'bookingId123',
        user: 'userId',
        train: 'trainId',
        seatsBooked: 3,
        bookingDate: new Date(),
      };
      (
        Booking.findByIdAndUpdate as jest.Mock
      ).mockResolvedValue(mockUpdatedBooking);

      await updateBooking(req, res, next);

      expect(
        Booking.findByIdAndUpdate,
      ).toHaveBeenCalledWith(
        'bookingId123',
        {
          seatsBooked: 3,
          bookingDate: req.body.bookingDate,
        },
        { new: true, runValidators: true },
      );
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        mockUpdatedBooking,
      );
    });
  });

  describe('deleteBooking', () => {
    it('should delete a booking by ID', async () => {
      req.params.id = 'bookingId123';
      (
        Booking.findByIdAndDelete as jest.Mock
      ).mockResolvedValue({});

      await deleteBooking(req, res, next);

      expect(
        Booking.findByIdAndDelete,
      ).toHaveBeenCalledWith('bookingId123');
      expect(sendSuccess).toHaveBeenCalledWith(res, {
        message: 'Booking successfully deleted',
      });
    });

    it('should return an error if booking not found', async () => {
      req.params.id = 'bookingId123';
      (
        Booking.findByIdAndDelete as jest.Mock
      ).mockResolvedValue(null);

      await deleteBooking(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'Booking not found',
        404,
      );
    });
  });
});
