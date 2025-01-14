import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import trainRoutes from './routes/trainRoutes';
import bookingRoutes from './routes/bookingRoutes';
import passport from './config/passport-config';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit, {
  RateLimitRequestHandler,
} from 'express-rate-limit';
import morgan from 'morgan';

dotenv.config();

const app: Application = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());
app.use(hpp());
app.use(limiter);

app.use(
  (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    res.setTimeout(30000, (): void => {
      res.status(408).json({ error: 'Request Timeout' });
    });
    next();
  },
);

if (!process.env.SESSION_SECRET) {
  throw new Error(
    'SESSION_SECRET is not defined in the environment variables.',
  );
}

const mongoStore: MongoStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URL,
  ttl: 15 * 60,
  autoRemove: 'disabled',
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
    },
    store: mongoStore,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/trains', trainRoutes);
app.use('/bookings', bookingRoutes);

app.use((_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Not Found' });
});

interface CustomError extends Error {
  status?: number;
}

app.use(
  (
    err: CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void => {
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
