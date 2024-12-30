import mongoose from 'mongoose';
import Train, {
  ITrain,
} from '../../../src/models/trainModel';
import '../../mongodb_helper';

describe('Train Model', (): void => {
  beforeEach(async (): Promise<void> => {
    await Train.deleteMany({});
  });

  it('should create and save a train successfully', async (): Promise<void> => {
    const mockRouteId = new mongoose.Types.ObjectId();

    const train = new Train({
      name: 'Express Train',
      route: mockRouteId,
      departureTime: new Date('2024-12-25T08:00:00Z'),
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      operatingDate: new Date('2024-12-25'),
      availableSeats: 100,
      seatsBooked: 0,
    });

    const savedTrain: ITrain = await train.save();

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
      operatingDate: new Date('2024-12-25'),
      availableSeats: 100,
      seatsBooked: 0,
    });

    await expect(train.save()).rejects.toThrow(
      /Path `name` is required/,
    );
  });

  it('should trim the name before saving', async (): Promise<void> => {
    const mockRouteId = new mongoose.Types.ObjectId();

    const train = new Train({
      name: '  Express Train  ',
      route: mockRouteId,
      departureTime: new Date('2024-12-25T08:00:00Z'),
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      operatingDate: new Date('2024-12-25'),
      availableSeats: 100,
      seatsBooked: 0,
    });

    const savedTrain: ITrain = await train.save();
    expect(savedTrain.name).toBe('Express Train');
  });

  it('should not save a train without a route', async (): Promise<void> => {
    const train = new Train({
      name: 'Express Train',
      departureTime: new Date('2024-12-25T08:00:00Z'),
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      operatingDate: new Date('2024-12-25'),
      availableSeats: 100,
      seatsBooked: 0,
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
      operatingDate: new Date('2024-12-25'),
      seatsBooked: 0,
    });

    await expect(train.save()).rejects.toThrow(
      /Path `availableSeats` is required/,
    );
  });

  it('should not save a train without a departureTime', async (): Promise<void> => {
    const mockRouteId = new mongoose.Types.ObjectId();

    const train = new Train({
      name: 'Express Train',
      route: mockRouteId,
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      operatingDate: new Date('2024-12-25'),
      availableSeats: 100,
      seatsBooked: 0,
    });

    await expect(train.save()).rejects.toThrow(
      /Path `departureTime` is required/,
    );
  });

  it('should not save a train without an arrivalTime', async (): Promise<void> => {
    const mockRouteId = new mongoose.Types.ObjectId();

    const train = new Train({
      name: 'Express Train',
      route: mockRouteId,
      departureTime: new Date('2024-12-25T08:00:00Z'),
      operatingDate: new Date('2024-12-25'),
      availableSeats: 100,
      seatsBooked: 0,
    });

    await expect(train.save()).rejects.toThrow(
      /Path `arrivalTime` is required/,
    );
  });

  it('should not save a train without an operatingDate', async (): Promise<void> => {
    const mockRouteId = new mongoose.Types.ObjectId();

    const train = new Train({
      name: 'Express Train',
      route: mockRouteId,
      departureTime: new Date('2024-12-25T08:00:00Z'),
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      availableSeats: 100,
      seatsBooked: 0,
    });

    await expect(train.save()).rejects.toThrow(
      /Path `operatingDate` is required/,
    );
  });

  it('should update seatsBooked correctly when booking seats', async (): Promise<void> => {
    const mockRouteId = new mongoose.Types.ObjectId();

    const train = new Train({
      name: 'Express Train',
      route: mockRouteId,
      departureTime: new Date('2024-12-25T08:00:00Z'),
      arrivalTime: new Date('2024-12-25T10:00:00Z'),
      operatingDate: new Date('2024-12-25'),
      availableSeats: 100,
      seatsBooked: 0,
    });

    const savedTrain: ITrain = await train.save();

    savedTrain.seatsBooked += 30;
    savedTrain.availableSeats -= 30;
    await savedTrain.save();

    const updatedTrain: ITrain | null =
      await Train.findById(savedTrain._id);
    expect(updatedTrain).not.toBeNull();
    expect(updatedTrain!.seatsBooked).toBe(30);
    expect(updatedTrain!.availableSeats).toBe(70);
  });
});
