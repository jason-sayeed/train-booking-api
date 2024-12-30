import mongoose from 'mongoose';
import Booking, {
  IBooking,
} from '../../../src/models/bookingModel';
import '../../mongodb_helper';
import { DeleteResult } from 'mongodb';

describe('Booking Model', (): void => {
  beforeEach(async (): Promise<void> => {
    await Booking.deleteMany({});
  });

  it('should create and save a booking successfully', async (): Promise<void> => {
    const userId = new mongoose.Types.ObjectId();
    const trainId = new mongoose.Types.ObjectId();

    const booking = new Booking({
      userId: userId,
      trainId: trainId,
      seatsBooked: 2,
      bookingDate: new Date(),
    });

    const savedBooking: IBooking = await booking.save();

    expect(savedBooking._id).toBeDefined();
    expect(savedBooking.userId).toBe(userId);
    expect(savedBooking.trainId).toBe(trainId);
    expect(savedBooking.seatsBooked).toBe(2);
    expect(savedBooking.bookingDate).toBeDefined();
  });

  it('should not save a booking without a user', async (): Promise<void> => {
    const trainId = new mongoose.Types.ObjectId();

    const booking = new Booking({
      trainId: trainId,
      seatsBooked: 2,
      bookingDate: new Date(),
    });

    await expect(booking.save()).rejects.toThrow(
      /Path `userId` is required/,
    );
  });

  it('should not save a booking without a train', async (): Promise<void> => {
    const userId = new mongoose.Types.ObjectId();

    const booking = new Booking({
      userId: userId,
      seatsBooked: 2,
      bookingDate: new Date(),
    });

    await expect(booking.save()).rejects.toThrow(
      /Path `trainId` is required/,
    );
  });

  it('should not save a booking without seatsBooked', async (): Promise<void> => {
    const userId = new mongoose.Types.ObjectId();
    const trainId = new mongoose.Types.ObjectId();

    const booking = new Booking({
      userId: userId,
      trainId: trainId,
      bookingDate: new Date(),
    });

    await expect(booking.save()).rejects.toThrow(
      /Path `seatsBooked` is required/,
    );
  });

  it('should not save a booking with seatsBooked less than 1', async (): Promise<void> => {
    const userId = new mongoose.Types.ObjectId();
    const trainId = new mongoose.Types.ObjectId();

    const booking = new Booking({
      userId: userId,
      trainId: trainId,
      seatsBooked: 0,
      bookingDate: new Date(),
    });

    await expect(booking.save()).rejects.toThrow(
      /seatsBooked is less than the minimum allowed/,
    );
  });

  it('should return bookings for a specific user', async (): Promise<void> => {
    const userId = new mongoose.Types.ObjectId();
    const trainId = new mongoose.Types.ObjectId();

    const booking = new Booking({
      userId: userId,
      trainId: trainId,
      seatsBooked: 2,
      bookingDate: new Date(),
    });
    await booking.save();

    const foundBookings: IBooking[] = await Booking.find({
      userId: userId,
    });
    expect(foundBookings.length).toBe(1);
    expect(foundBookings[0].userId.toString()).toBe(
      userId.toString(),
    );
  });

  it('should delete a booking by ID', async (): Promise<void> => {
    const userId = new mongoose.Types.ObjectId();
    const trainId = new mongoose.Types.ObjectId();

    const booking = new Booking({
      userId: userId,
      trainId: trainId,
      seatsBooked: 2,
      bookingDate: new Date(),
    });
    const savedBooking: IBooking = await booking.save();

    const result: DeleteResult = await Booking.deleteOne({
      _id: savedBooking._id,
    });
    expect(result.deletedCount).toBe(1);
  });

  it('should update a booking successfully', async (): Promise<void> => {
    const userId = new mongoose.Types.ObjectId();
    const trainId = new mongoose.Types.ObjectId();

    const booking = new Booking({
      userId: userId,
      trainId: trainId,
      seatsBooked: 2,
      bookingDate: new Date(),
    });
    const savedBooking: IBooking = await booking.save();

    await Booking.updateOne(
      { _id: savedBooking._id },
      { seatsBooked: 3 },
    );

    const updatedBooking: IBooking | null =
      await Booking.findById(savedBooking._id);
    expect(updatedBooking?.seatsBooked).toBe(3);
  });
});
