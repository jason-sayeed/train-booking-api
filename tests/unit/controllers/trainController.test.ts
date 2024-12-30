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

beforeEach((): void => {
  req = createRequest();
  res = createResponse();
  next = jest.fn();

  jest.clearAllMocks();
});

type MockRouteType = {
  _id: string;
  startStation: string;
  endStation: string;
};

type MockTrainData = {
  _id: string;
  route: string;
  departureTime: Date;
  arrivalTime: Date;
  operatingDate: Date;
  availableSeats: number;
};

type MockTrainDataResponse = {
  trainId: string;
  departureTime: Date;
  arrivalTime: Date;
  availableSeats: number;
};

describe('Train Controller', (): void => {
  describe('searchTrains', (): void => {
    it('should return an error if no trains are found for the specified route, date and seat count', async (): Promise<void> => {
      req.query = {
        startStation: 'Station A',
        endStation: 'Station B',
        date: '2024-12-25',
      };

      (Route.findOne as jest.Mock).mockResolvedValue({
        _id: 'route1',
        startStation: 'Station A',
        endStation: 'Station B',
      });

      (Train.find as jest.Mock).mockResolvedValue([]);

      await searchTrains(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'No trains found for the specified route, date and seat count',
        404,
      );
    });

    it('should return trains if found for the specified route, date and seat count', async (): Promise<void> => {
      req.query = {
        startStation: 'Station A',
        endStation: 'Station B',
        date: '2024-12-25',
        numberOfSeatsRequested: '5',
      };

      const mockRoute: MockRouteType = {
        _id: 'route1',
        startStation: 'Station A',
        endStation: 'Station B',
      };

      const mockTrains: MockTrainData[] = [
        {
          _id: 'train1',
          route: mockRoute._id,
          departureTime: new Date('2024-12-25T08:00:00Z'),
          arrivalTime: new Date('2024-12-25T10:00:00Z'),
          operatingDate: new Date('2024-12-25'),
          availableSeats: 100,
        },
        {
          _id: 'train2',
          route: mockRoute._id,
          departureTime: new Date('2024-12-25T12:00:00Z'),
          arrivalTime: new Date('2024-12-25T14:00:00Z'),
          operatingDate: new Date('2024-12-25'),
          availableSeats: 80,
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
        mockTrains.map(
          (
            train: MockTrainData,
          ): MockTrainDataResponse => ({
            trainId: train._id.toString(),
            departureTime: train.departureTime,
            arrivalTime: train.arrivalTime,
            availableSeats: train.availableSeats,
          }),
        ),
      );
    });

    it('should return an error if route is not found', async (): Promise<void> => {
      req.query = {
        startStation: 'Station A',
        endStation: 'Station B',
        date: '2024-12-25',
        numberOfSeatsRequested: '5',
      };

      (Route.findOne as jest.Mock).mockResolvedValue(null); // No route found

      await searchTrains(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'Route not found',
        404,
      );
    });

    it('should return an error if no trains have sufficient available seats', async () => {
      req.query = {
        startStation: 'Station A',
        endStation: 'Station B',
        date: '2024-12-25',
        numberOfSeatsRequested: '50',
      };

      const mockRoute: MockRouteType = {
        _id: 'route1',
        startStation: 'Station A',
        endStation: 'Station B',
      };

      (Route.findOne as jest.Mock).mockResolvedValue(
        mockRoute,
      );

      (Train.find as jest.Mock).mockImplementation(
        (query) => {
          const mockTrains = [
            { _id: 'train1', availableSeats: 30 },
            { _id: 'train2', availableSeats: 40 },
          ];
          return mockTrains.filter(
            (train): boolean =>
              train.availableSeats >
              query.availableSeats.$gt,
          );
        },
      );

      await searchTrains(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'No trains found for the specified route, date and seat count',
        404,
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
