import mongoose, {
  Schema,
  Model,
  Document,
} from 'mongoose';

interface IBooking extends Document {
  user: Schema.Types.ObjectId;
  train: Schema.Types.ObjectId;
  seatsBooked: number;
  bookingDate: Date;
}

const bookingSchema = new Schema<IBooking>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  train: {
    type: Schema.Types.ObjectId,
    ref: 'Train',
    required: true,
  },
  seatsBooked: {
    type: Number,
    required: true,
    min: [
      1,
      'seatsBooked is less than the minimum allowed',
    ],
  },
  bookingDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Booking: Model<IBooking> = mongoose.model<IBooking>(
  'Booking',
  bookingSchema,
);

export default Booking;
export { IBooking };
