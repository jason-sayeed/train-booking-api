import mongoose from 'mongoose';
import { connectToDatabase } from '../src/db/db';
import { mongoStore } from '../src/app';

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  await mongoStore.close();
  await mongoose.connection.close();
});
