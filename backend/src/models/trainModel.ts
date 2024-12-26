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
  availableDates: {
    date: Date;
    availableSeats: number;
    seatsBooked: number;
  }[];
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
  availableDates: {
    type: [
      {
        date: {
          type: Date,
          required: true,
        },
        availableSeats: {
          type: Number,
          required: true,
          min: [
            1,
            'There must be at least one seat on the train',
          ],
        },
        seatsBooked: {
          type: Number,
          default: 0,
          min: [0, 'Seats booked cannot be less than 0'],
        },
      },
    ],
    required: true,
  },
});

const Train: Model<ITrain> = mongoose.model<ITrain>(
  'Train',
  trainSchema,
);

export default Train;
export { ITrain };
