import express, {
  Express,
  Request,
  Response,
} from 'express';

import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Express server started');
});

app.listen(port, () => {
  console.log(`Express server started on port: ${port}`);
});
