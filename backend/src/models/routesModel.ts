import mongoose, {
  Schema,
  Model,
  Document,
} from 'mongoose';

interface IRoute extends Document {
  _id: Schema.Types.ObjectId;
  startStation: string;
  endStation: string;
}

const routeSchema: Schema = new Schema({
  startStation: {
    type: String,
    required: true,
  },
  endStation: {
    type: String,
    required: true,
  },
});

const Route: Model<IRoute> = mongoose.model<IRoute>(
  'Route',
  routeSchema,
);

export default Route;
export { IRoute };
