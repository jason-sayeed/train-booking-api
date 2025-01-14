import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { mongoStore } from '../src/app';

let mongoServer: MongoMemoryServer;

beforeAll(async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URL = mongoServer.getUri();
  await mongoose.connect(process.env.MONGODB_URL);
});

afterAll(async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  mongoStore.clear();
  await mongoStore.close();
});
