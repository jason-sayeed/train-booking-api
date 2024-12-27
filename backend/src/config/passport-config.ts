import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/userModel';

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (
      email: string,
      password: string,
      done,
    ): Promise<void> => {
      try {
        const user = (await User.findOne({
          email,
        })) as IUser;

        if (!user) {
          return done(null, false, {
            message: 'Incorrect username',
          });
        }

        const isMatch: boolean = await bcrypt.compare(
          password,
          user.password,
        );

        if (!isMatch) {
          return done(null, false, {
            message: 'Incorrect password',
          });
        }

        return done(null, user);
      } catch (error: unknown) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser(
  (
    user: Partial<IUser>,
    done: (err: Error | null, id?: string) => void,
  ) => {
    if (!user._id) {
      throw new Error('User id is not found');
    }
    done(null, user._id);
  },
);

passport.deserializeUser(
  async (
    id: string,
    done: (err: Error | null, user?: IUser | false) => void,
  ): Promise<void> => {
    try {
      const user = (await User.findById(
        id,
      )) as IUser | null;
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      if (error instanceof Error) {
        done(error);
      } else {
        done(new Error('An unknown error occurred.'));
      }
    }
  },
);

export default passport;
