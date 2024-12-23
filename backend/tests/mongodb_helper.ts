import mongoose from 'mongoose';
import { connectToDatabase } from '../src/db/db';
import { mongoStore } from '../src/app';

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoStore.close();
});
