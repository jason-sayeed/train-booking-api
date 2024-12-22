import express, {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import passport from '../config/passport-config';
import { ensureAuthenticated } from '../middleware/authMiddleware';
import { type IUser } from '../models/userModel';

const router: Router = express.Router();

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
  }),
  (_req: Request, res: Response) => {
    res.redirect('/auth/profile');
  },
);

router.get('/login', (_req: Request, res: Response) => {
  res.json({
    message: 'Please login with correct credentials.',
  });
});

router.get(
  '/logout',
  (req: Request, res: Response, next: NextFunction) => {
    req.logout((err: Error) => {
      if (err) {
        console.error('Logout error:', err);
        return next(err);
      }
      req.session.destroy((err: Error) => {
        if (err) {
          console.error('Session destruction error:', err);
          return next(err);
        }
      });
      res.clearCookie('connect.sid');
      res.redirect('/auth/login');
    });
  },
);

router.get(
  '/profile',
  ensureAuthenticated,
  (req: Request, res: Response) => {
    const user = req.user as IUser;
    const { _id, name, email } = user;
    res.json({ id: _id, name, email });
  },
);

export default router;
