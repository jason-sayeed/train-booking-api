import mongoose, {
  Schema,
  Model,
  Document,
} from 'mongoose';

interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  trainId: mongoose.Types.ObjectId;
  seatsBooked: number;
  bookingDate: Date;
}

const bookingSchema = new Schema<IBooking>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  trainId: {
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
