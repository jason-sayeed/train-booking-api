import app from './app';
import dotenv from 'dotenv';
import { connectToDatabase } from './db/db';

dotenv.config();

const listenForRequests = (): void => {
  const port: number = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Express server started on port: ${port}`);
  });
};

connectToDatabase()
  .then(() => {
    listenForRequests();
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(
        'Failed to connect to the database:',
        error.message,
      );
    } else {
      console.error(
        'Failed to connect to the database. Unknown error:',
        error,
      );
    }
    process.exit(1);
  });
