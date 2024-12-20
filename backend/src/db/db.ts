import mongoose from 'mongoose';

export const connectToDatabase =
  async (): Promise<void> => {
    const dbUrl = process.env.MONGODB_URL;

    if (!dbUrl) {
      throw new Error(
        'MONGODB_URL is not defined in environment variables.',
      );
    }
    try {
      await mongoose.connect(dbUrl as string);
      if (process.env.NODE_ENV !== 'test') {
        console.info(
          'MongoDB connection started successfully.',
        );
      }
    } catch (error) {
      throw new Error(
        `MongoDB connection error: ${error instanceof Error ? error.message : error}`,
      );
    }
  };
