import mongoose, { Schema, Document } from 'mongoose';

interface IRoute extends Document {
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

const Route = mongoose.model<IRoute>('Route', routeSchema);

export default Route;
export { IRoute };
