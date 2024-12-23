import { Request, Response } from 'express';
import {
  createTrain,
  getTrain,
  updateTrain,
  deleteTrain,
  getAllTrains,
} from '../../../src/controllers/trainController';
import Train from '../../../src/models/trainModel';
import {
  sendError,
  sendSuccess,
} from '../../../src/utils/responseHelper';
import {
  createRequest,
  createResponse,
} from 'node-mocks-http';

jest.mock('../../../src/models/trainModel');
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
  describe('createTrain', () => {
    it('should return an error if required fields are missing', async (): Promise<void> => {
      req.body = { name: 'Express' };
      await createTrain(req, res, next);
      expect(sendError).toHaveBeenCalledWith(
        res,
        'Name, route, capacity, and schedule are required',
        400,
      );
    });

    it('should create a train', async (): Promise<void> => {
      req.body = {
        name: 'Express',
        route: 'A to B',
        capacity: 300,
        schedule: '10:00 AM',
      };

      const mockTrain = { _id: 'trainId123', ...req.body };

      (Train.create as jest.Mock).mockResolvedValue(
        mockTrain,
      );

      await createTrain(req, res, next);

      expect(Train.create).toHaveBeenCalledWith(req.body);
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        mockTrain,
        201,
      );
    });
  });

  describe('getTrain', () => {
    it('should return a train by ID', async () => {
      req.params.id = 'trainId123';
      const mockTrain = {
        id: 'trainId123',
        name: 'Express',
        route: 'A to B',
      };

      (Train.findById as jest.Mock).mockResolvedValue(
        mockTrain,
      );

      await getTrain(req, res, next);

      expect(Train.findById).toHaveBeenCalledWith(
        'trainId123',
      );
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        mockTrain,
      );
    });

    it('should return an error if train is not found', async (): Promise<void> => {
      req.params.id = 'trainId123';
      (Train.findById as jest.Mock).mockResolvedValue(null);

      await getTrain(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'Train not found',
        404,
      );
    });
  });

  describe('updateTrain', () => {
    it('should update a train', async (): Promise<void> => {
      req.params.id = 'trainId123';
      req.body = { name: 'Super Express' };
      const mockTrain = {
        _id: 'trainId123',
        name: 'Super Express',
      };

      (
        Train.findByIdAndUpdate as jest.Mock
      ).mockResolvedValue(mockTrain);

      await updateTrain(req, res, next);

      expect(Train.findByIdAndUpdate).toHaveBeenCalledWith(
        'trainId123',
        req.body,
        { new: true, runValidators: true },
      );
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        mockTrain,
      );
    });

    it('should return an error if train is not found', async (): Promise<void> => {
      req.params.id = 'trainId123';
      (
        Train.findByIdAndUpdate as jest.Mock
      ).mockResolvedValue(null);

      await updateTrain(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'Train not found',
        404,
      );
    });
  });

  describe('deleteTrain', () => {
    it('should delete a train by ID', async (): Promise<void> => {
      req.params.id = 'trainId123';
      (
        Train.findByIdAndDelete as jest.Mock
      ).mockResolvedValue({});

      await deleteTrain(req, res, next);

      expect(Train.findByIdAndDelete).toHaveBeenCalledWith(
        'trainId123',
      );
      expect(sendSuccess).toHaveBeenCalledWith(res, {
        message: 'Train successfully deleted',
      });
    });

    it('should return an error if train is not found', async (): Promise<void> => {
      req.params.id = 'trainId123';
      (
        Train.findByIdAndDelete as jest.Mock
      ).mockResolvedValue(null);

      await deleteTrain(req, res, next);

      expect(sendError).toHaveBeenCalledWith(
        res,
        'Train not found',
        404,
      );
    });
  });

  describe('getAllTrains', () => {
    it('should return all trains', async (): Promise<void> => {
      const mockTrains = [
        { name: 'Express', route: 'A to B' },
        { name: 'Super Express', route: 'B to C' },
      ];
      (Train.find as jest.Mock).mockResolvedValue(
        mockTrains,
      );

      await getAllTrains(req, res, next);

      expect(Train.find).toHaveBeenCalled();
      expect(sendSuccess).toHaveBeenCalledWith(
        res,
        mockTrains,
      );
    });
  });
});
