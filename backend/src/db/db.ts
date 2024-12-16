import mongoose from 'mongoose';

export const connectToDatabase =
  async (): Promise<void> => {
    try {
      await mongoose.connect(process.env.MONGODB_URL);
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
