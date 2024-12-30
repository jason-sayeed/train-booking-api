import { app } from './app';
import dotenv from 'dotenv';
import { connectToDatabase } from './db/db';

dotenv.config();

const listenForRequests: () => void = (): void => {
  const port: number = Number(process.env.PORT) || 3000;
  app.listen(port, (): void => {
    console.log(`Express server started on port: ${port}`);
  });
};

connectToDatabase()
  .then((): void => {
    listenForRequests();
  })
  .catch((error: unknown): never => {
    if (error instanceof Error) {
      console.error(
        'Failed to connect to the db:',
        error.message,
      );
    } else {
      console.error(
        'Failed to connect to the db. Unknown error:',
        error,
      );
    }
    process.exit(1);
  });
