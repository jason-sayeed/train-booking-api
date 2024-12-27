import mongoose, {
  Schema,
  Model,
  Document,
} from 'mongoose';

interface ITrain extends Document {
  _id: string;
  name: string;
  route: Schema.Types.ObjectId;
  departureTime: Date;
  arrivalTime: Date;
  operatingDate: Date;
  availableSeats: number;
  seatsBooked: number;
}

const trainSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  route: {
    type: Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  operatingDate: {
    type: Date,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
    min: [1, '`availableSeats` cannot be less than 1'],
  },
  seatsBooked: {
    type: Number,
    default: 0,
    min: [0, 'Seats booked cannot be less than 0'],
  },
});

const Train: Model<ITrain> = mongoose.model<ITrain>(
  'Train',
  trainSchema,
);

export default Train;
export { ITrain };
