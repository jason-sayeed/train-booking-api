import mongoose from 'mongoose';
import { connectToDatabase } from '../src/db/db';

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});
