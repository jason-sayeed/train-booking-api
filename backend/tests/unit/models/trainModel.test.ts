import mongoose from 'mongoose';
import Train from '../../../src/models/trainModel';
import '../../mongodb_helper';

describe('Train Model', () => {
  beforeEach(async (): Promise<void> => {
    await Train.deleteMany({});
  });

  afterEach(async (): Promise<void> => {
    await Train.deleteMany({});
  });

  it('should create and save a train successfully', async (): Promise<void> => {
    const mockRouteId = new mongoose.Types.ObjectId();

    const train = new Train({
      name: 'Express Train',
      route: mockRouteId,
      departureTime: new Date('2024-12-25T08:00:00Z'),
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      availableSeats: 100,
      availableDates: [
        {
          date: new Date('2024-12-25'),
          availableSeats: 100,
          seatsBooked: 0,
        },
        {
          date: new Date('2024-12-26'),
          availableSeats: 100,
          seatsBooked: 0,
        },
      ],
    });

    const savedTrain = await train.save();

    expect(savedTrain._id).toBeDefined();
    expect(savedTrain.name).toBe('Express Train');
    expect(savedTrain.route).toBe(mockRouteId);
  });

  it('should not save a train without a name', async (): Promise<void> => {
    const mockRouteId = new mongoose.Types.ObjectId();

    const train = new Train({
      route: mockRouteId,
      departureTime: new Date('2024-12-25T08:00:00Z'),
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      availableSeats: 100,
      availableDates: [
        {
          date: new Date('2024-12-25'),
          availableSeats: 0,
          seatsBooked: 0,
        },
      ],
    });

    await expect(train.save()).rejects.toThrow(
      /Path `name` is required/,
    );
  });

  it('should not save a train without a route', async (): Promise<void> => {
    const train = new Train({
      name: 'Express Train',
      departureTime: new Date('2024-12-25T08:00:00Z'),
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      availableSeats: 100,
      availableDates: [new Date('2024-12-25')],
    });

    await expect(train.save()).rejects.toThrow(
      /Path `route` is required/,
    );
  });

  it('should not save a train without availableSeats', async (): Promise<void> => {
    const mockRouteId = new mongoose.Types.ObjectId();

    const train = new Train({
      name: 'Express Train',
      route: mockRouteId,
      departureTime: new Date('2024-12-25T08:00:00Z'),
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      availableDates: [new Date('2024-12-25')],
    });

    await expect(train.save()).rejects.toThrow(
      /Path `availableSeats` is required/,
    );
  });

  it('should not save a train with a capacity less than 1', async (): Promise<void> => {
    const mockRouteId = new mongoose.Types.ObjectId();

    const train = new Train({
      name: 'Express Train',
      route: mockRouteId,
      departureTime: new Date('2024-12-25T08:00:00Z'),
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      availableSeats: 0,
      availableDates: [
        {
          date: new Date('2024-12-25'),
          availableSeats: 0,
          seatsBooked: 0,
        },
      ],
    });

    await expect(train.save()).rejects.toThrow(
      /There must be at least one seat on the train/,
    );
  });

  it('should return trains available on a specific date', async (): Promise<void> => {
    const mockRouteId = new mongoose.Types.ObjectId();

    const train1 = new Train({
      name: 'Express Train 1',
      route: mockRouteId,
      departureTime: new Date('2024-12-25T08:00:00Z'),
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      availableSeats: 100,
      availableDates: [
        {
          date: new Date('2024-12-25'),
          availableSeats: 100,
          seatsBooked: 0,
        },
        {
          date: new Date('2024-12-26'),
          availableSeats: 100,
          seatsBooked: 0,
        },
      ],
    });

    const train2 = new Train({
      name: 'Express Train 2',
      route: mockRouteId,
      departureTime: new Date('2024-12-25T12:00:00Z'),
      arrivalTime: new Date('2024-12-25T14:00:00Z'),
      availableSeats: 80,
      availableDates: [
        {
          date: new Date('2024-12-25'),
          availableSeats: 80,
          seatsBooked: 0,
        },
      ],
    });

    await train1.save();
    await train2.save();

    const searchDate = new Date('2024-12-25');
    const trains = await Train.find({
      route: mockRouteId,
      availableDates: {
        $elemMatch: {
          date: searchDate,
        },
      },
    });

    expect(trains.length).toBe(2);
    expect(trains[0].name).toBe('Express Train 1');
    expect(trains[1].name).toBe('Express Train 2');
  });

  it('should not return trains for a date they are not available on', async (): Promise<void> => {
    const mockRouteId = new mongoose.Types.ObjectId();

    const train1 = new Train({
      name: 'Express Train 1',
      route: mockRouteId,
      departureTime: new Date('2024-12-25T08:00:00Z'),
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      availableSeats: 100,
      availableDates: [
        {
          date: new Date('2024-12-25'),
          availableSeats: 100,
          seatsBooked: 0,
        },
      ],
    });

    const train2 = new Train({
      name: 'Express Train 2',
      route: mockRouteId,
      departureTime: new Date('2024-12-25T12:00:00Z'),
      arrivalTime: new Date('2024-12-25T14:00:00Z'),
      availableSeats: 80,
      availableDates: [
        {
          date: new Date('2024-12-26'),
          availableSeats: 80,
          seatsBooked: 0,
        },
      ],
    });

    await train1.save();
    await train2.save();

    const searchDate = new Date('2024-12-25');
    const trains = await Train.find({
      availableDates: {
        $elemMatch: {
          date: searchDate,
        },
      },
    });

    expect(trains.length).toBe(1);
    expect(trains[0].name).toBe('Express Train 1');
  });
});
