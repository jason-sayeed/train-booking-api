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

type RouteTestData = Pick<
  IRoute,
  'startStation' | 'endStation'
>;

type TrainTestData = Pick<
  ITrain,
  | 'name'
  | 'departureTime'
  | 'arrivalTime'
  | 'operatingDate'
  | 'availableSeats'
  | 'seatsBooked'
> & {
  route: mongoose.Types.ObjectId | null;
};

describe('Train Routes', (): void => {
  const routeData: RouteTestData = {
    startStation: 'Station A',
    endStation: 'Station B',
  };

  const trainData: TrainTestData = {
    name: 'Train 1',
    route: null,
    departureTime: new Date('2024-12-23T10:00:00Z'),
    arrivalTime: new Date('2024-12-23T12:00:00Z'),
    operatingDate: new Date('2024-12-23'),
    availableSeats: 100,
    seatsBooked: 0,
  };

  let route: IRoute;
  let train: ITrain;

  beforeEach(async (): Promise<void> => {
    await Train.deleteMany({});
    await Route.deleteMany({});

    route = await Route.create(routeData);

    trainData.route = route._id as mongoose.Types.ObjectId;

    train = await Train.create(trainData);
  });

  describe('GET /trains/search', (): void => {
    it('should return a list of trains matching the route and date', async (): Promise<void> => {
      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: routeData.startStation,
          endStation: routeData.endStation,
          date: '2024-12-23',
          numberOfSeatsRequested: '5',
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

    it('should return only trains with enough available seats', async () => {
      await Train.create({
        name: 'Train 2',
        route: route._id,
        departureTime: new Date('2024-12-23T12:00:00Z'),
        arrivalTime: new Date('2024-12-23T14:00:00Z'),
        operatingDate: new Date('2024-12-23'),
        availableSeats: 50,
        seatsBooked: 0,
      });

      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: routeData.startStation,
          endStation: routeData.endStation,
          date: '2024-12-23',
          numberOfSeatsRequested: '60',
        });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].availableSeats).toBe(100);
    });

    it('should return 400 if required query parameters are missing', async (): Promise<void> => {
      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: routeData.startStation,
          numberOfSeatsRequested: '5',
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe(
        'endStation is required',
      );
      expect(res.body.errors[1].msg).toBe(
        'date is required',
      );
    });

    it('should return 404 if no trains match the route and date', async (): Promise<void> => {
      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: 'Nonexistent Station',
          endStation: 'Nonexistent Station',
          date: '2024-12-22',
          numberOfSeatsRequested: '5',
        });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Route not found');
    });

    it('should return 404 if no trains are available on the specified date', async (): Promise<void> => {
      await train.save();

      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: routeData.startStation,
          endStation: routeData.endStation,
          date: '2024-12-22',
          numberOfSeatsRequested: '5',
        });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe(
        'No trains found for the specified route, date and seat count',
      );
    });

    it('should return 404 if no trains are available for the specified date because there are no seats available', async (): Promise<void> => {
      train.availableSeats = 0;
      await train.save();

      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: routeData.startStation,
          endStation: routeData.endStation,
          date: '2024-12-23',
          numberOfSeatsRequested: '1',
        });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe(
        'No trains found for the specified route, date and seat count',
      );
    });
  });

  describe('Search validation middleware', (): void => {
    it('should return 400 if startStation is missing', async (): Promise<void> => {
      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          endStation: 'Station B',
          date: '2024-12-23',
          numberOfSeatsRequested: '5',
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe(
        'startStation is required',
      );
    });

    it('should return 400 if endStation is missing', async (): Promise<void> => {
      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: 'Station A',
          date: '2024-12-23',
          numberOfSeatsRequested: '5',
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe(
        'endStation is required',
      );
    });

    it('should return 400 if date is invalid', async (): Promise<void> => {
      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: 'Station A',
          endStation: 'Station B',
          date: 'invalid-date',
          numberOfSeatsRequested: '5',
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe(
        'date must be a valid date',
      );
    });

    it('should return 400 if numberOfSeatsRequested is invalid', async (): Promise<void> => {
      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: 'Station A',
          endStation: 'Station B',
          date: '2024-12-23',
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toBe(
        'numberOfSeatsRequested is required',
      );

      const resInvalid: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: 'Station A',
          endStation: 'Station B',
          date: '2024-12-23',
          numberOfSeatsRequested: 'invalid',
        });

      expect(resInvalid.status).toBe(400);
      expect(resInvalid.body.errors[0].msg).toBe(
        'numberOfSeatsRequested must be a positive number',
      );
    });

    it('should pass validation for valid request', async (): Promise<void> => {
      const res: Response = await request(app)
        .get('/trains/search')
        .query({
          startStation: 'Station A',
          endStation: 'Station B',
          date: '2024-12-23',
          numberOfSeatsRequested: '5',
        });

      expect(res.status).toBe(200);
    });
  });
});
