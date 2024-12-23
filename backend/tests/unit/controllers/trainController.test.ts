import { Request, Response } from 'express';
import { searchTrains } from '../../../src/controllers/trainController';
import Train from '../../../src/models/trainModel';
import Route from '../../../src/models/routesModel';
import {
  sendError,
  sendSuccess,
} from '../../../src/utils/responseHelper';
import {
  createRequest,
  createResponse,
} from 'node-mocks-http';

jest.mock('../../../src/models/trainModel');
jest.mock('../../../src/models/routesModel');
jest.mock('../../../src/utils/responseHelper');

let req: Request;
let res: Response;
let next: jest.Mock;

beforeEach(() => {
  req = createRequest();
  res = createResponse();
  next = jest.fn();

  jest.clearAllMocks();
});

describe('Train Controller', () => {
  describe('searchTrains', () => {
    it('should return an error if route or date is missing', async (): Promise<void> => {
      req.query = { startStation: 'Station A' };

      await searchTrains(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'Route and date are required',
        400,
      );
    });

    it('should return an error if no trains are found for the specified route and date', async (): Promise<void> => {
      req.query = {
        startStation: 'Station A',
        endStation: 'Station B',
        date: '2024-12-25',
      };

      (Train.find as jest.Mock).mockResolvedValue([]);

      await searchTrains(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'Route not found',
        404,
      );
    });

    it('should return trains if found for the specified route and date', async (): Promise<void> => {
      req.query = {
        startStation: 'Station A',
        endStation: 'Station B',
        date: '2024-12-25',
      };

      const mockRoute = {
        _id: 'route1',
        startStation: 'Station A',
        endStation: 'Station B',
      };

      const mockTrains = [
        {
          _id: 'train1',
          route: mockRoute._id,
          departureTime: new Date('2024-12-25T08:00:00Z'),
          arrivalTime: new Date('2024-12-25T10:00:00Z'),
          availableSeats: 100,
          availableDates: [new Date('2024-12-25')],
        },
        {
          _id: 'train2',
          route: mockRoute._id,
          departureTime: new Date('2024-12-25T12:00:00Z'),
          arrivalTime: new Date('2024-12-25T14:00:00Z'),
          availableSeats: 80,
          availableDates: [new Date('2024-12-25')],
        },
      ];

      (Route.findOne as jest.Mock).mockResolvedValue(
        mockRoute,
      );
      (Train.find as jest.Mock).mockResolvedValue(
        mockTrains,
      );

      await searchTrains(req, res, next);

      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        mockTrains.map((train) => ({
          departureTime: train.departureTime,
          arrivalTime: train.arrivalTime,
          availableSeats: train.availableSeats,
        })),
      );
    });

    it('should handle unexpected errors', async (): Promise<void> => {
      req.query = {
        startStation: 'Station A',
        endStation: 'Station B',
        date: '2024-12-25',
      };

      (Train.find as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await searchTrains(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'Error searching for trains',
        500,
      );
    });
  });
});
