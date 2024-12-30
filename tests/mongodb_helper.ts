import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { mongoStore } from '../src/app';

let mongoServer: MongoMemoryServer;

beforeAll(async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const uri: string = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  await mongoStore.close();
});
