import mongoose from 'mongoose';
import { connectToDatabase } from '../../../src/db/db';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('connectToDatabase', (): void => {
  const originalEnv: NodeJS.ProcessEnv = process.env;

  beforeEach((): void => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  it('should throw an error if MONGODB_URL is not defined', async (): Promise<void> => {
    delete (
      process.env as Record<string, string | undefined>
    ).MONGODB_URL;

    await expect(connectToDatabase()).rejects.toThrow(
      'MONGODB_URL is not defined in environment variables.',
    );

    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it('should connect to the database in non-test environments', async (): Promise<void> => {
    process.env.MONGODB_URL =
      'mongodb://localhost:0000/testdb';
    process.env.NODE_ENV = 'development';

    await connectToDatabase();

    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://localhost:0000/testdb',
    );
  });

  it('should connect to the database in test environment', async (): Promise<void> => {
    process.env.MONGODB_URL =
      'mongodb://localhost:0000/testdb';
    process.env.NODE_ENV = 'test';

    await connectToDatabase();

    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://localhost:0000/testdb',
    );
  });

  it('should throw an error if connection fails with an Error instance', async (): Promise<void> => {
    process.env.MONGODB_URL =
      'mongodb://localhost:0000/testdb';
    const mockError: Error = new Error('Connection failed');

    (mongoose.connect as jest.Mock).mockRejectedValue(
      mockError,
    );

    await expect(connectToDatabase()).rejects.toThrow(
      'MongoDB connection error: Connection failed',
    );

    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://localhost:0000/testdb',
    );
  });

  it('should throw a MongoDB connection error when connection fails with a non-Error value', async (): Promise<void> => {
    process.env.MONGODB_URL =
      'mongodb://localhost:0000/testdb';
    const mockError: string = 'Non-error string';

    (mongoose.connect as jest.Mock).mockRejectedValue(
      mockError,
    );

    await expect(connectToDatabase()).rejects.toThrow(
      'MongoDB connection error: Non-error string',
    );
  });
});
