import mongoose from 'mongoose';
import request, { Response } from 'supertest';
import { app } from '../../../src/app';
import Train, {
  ITrain,
} from '../../../src/models/trainModel';
import Route, {
  IRoute,
} from '../../../src/models/routesModel';
import '../../mongodb_helper';

describe('Train Routes', () => {
  const routeData = {
    startStation: 'Station A',
    endStation: 'Station B',
  };

  const trainData: {
    name: string;
    route: mongoose.Schema.Types.ObjectId | null;
    departureTime: Date;
    arrivalTime: Date;
    availableSeats: number;
    availableDates: {
      date: Date;
      availableSeats: number;
      seatsBooked: number;
    }[];
  } = {
    name: 'Train 1',
    route: null,
    departureTime: new Date('2024-12-23T10:00:00Z'),
    arrivalTime: new Date('2024-12-23T12:00:00Z'),
    availableSeats: 100,
    availableDates: [
      {
        date: new Date('2024-12-23'),
        availableSeats: 100,
        seatsBooked: 0,
      },
    ],
  };

  let route: IRoute;
  let train: ITrain;

  beforeEach(async (): Promise<void> => {
    await Train.deleteMany({});
    await Route.deleteMany({});

    route = await Route.create(routeData);

    trainData.route =
      route._id as mongoose.Schema.Types.ObjectId;

    train = await Train.create(trainData);
  });

  describe('GET /trains/search', () => {
    it('should return a list of trains matching the route and date', async (): Promise<void> => {
      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: routeData.startStation,
          endStation: routeData.endStation,
          date: '2024-12-23',
        });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('departureTime');
      expect(res.body[0]).toHaveProperty('arrivalTime');
      expect(res.body[0]).toHaveProperty('availableSeats');
      expect(res.body[0].trainId).toBe(
        train._id.toString(),
      );
    });

    it('should return 400 if required query parameters are missing', async (): Promise<void> => {
      const res: Response = await request(app)
        .get('/trains/search')
        .query({ startStation: routeData.startStation });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        'Route and date are required',
      );
    });

    it('should return 404 if no trains match the route and date', async (): Promise<void> => {
      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: 'Nonexistent Station',
          endStation: 'Nonexistent Station',
          date: '2024-12-23',
        });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Route not found');
    });

    it('should return 404 if no trains are available on the specified date', async (): Promise<void> => {
      train.availableDates = [
        {
          date: new Date('2024-12-24'),
          availableSeats: 100,
          seatsBooked: 0,
        },
      ];

      await train.save();

      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: routeData.startStation,
          endStation: routeData.endStation,
          date: '2024-12-23',
        });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe(
        'No trains found for the specified route and date',
      );
    });
  });
});
