import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import passport from './config/passport-config';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

if (!process.env.SESSION_SECRET) {
  throw new Error(
    'SESSION_SECRET is not defined in the environment variables.',
  );
}

const mongoStore: MongoStore = new MongoStore({
  mongoUrl: process.env.MONGODB_URL as string,
  ttl: 2 * 24 * 60 * 60,
  autoRemove: 'native',
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 300000000,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
    store: mongoStore,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(
  (
    err: Error & { status?: number },
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    const status: number = err.status || 500;
    console.error('Error:', err.message);
    const message: string =
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Unknown error';
    res.status(status).json({ error: message });
  },
);

export { app, mongoStore };
