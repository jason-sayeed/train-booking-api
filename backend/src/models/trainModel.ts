import mongoose, {
  Schema,
  Model,
  Document,
} from 'mongoose';

interface ITrain extends Document {
  name: string;
  capacity: number;
  routes: Schema.Types.ObjectId[];
}

const trainSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Train name is required'],
    unique: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, 'Train capacity is required'],
    min: [
      1,
      'There must be at least one seat on the train',
    ],
  },
  routes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Route',
    },
  ],
});

const Train: Model<ITrain> = mongoose.model<ITrain>(
  'Train',
  trainSchema,
);

export default Train;
export { ITrain };
