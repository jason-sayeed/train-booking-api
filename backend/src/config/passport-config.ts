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
      done: (
        error: Error | null,
        user?: false | IUser,
        options?: { message: string },
      ) => void,
    ): Promise<void> => {
      try {
        const user = await User.findOne({
          email,
        });

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
      } catch (error) {
        if (error instanceof Error) {
          return done(error);
        }
        return done(new Error('An unknown error occurred'));
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
    done(null, user._id.toString());
  },
);

passport.deserializeUser(
  async (
    id: string,
    done: (err: Error | null, user?: IUser | false) => void,
  ): Promise<void> => {
    try {
      const user = await User.findById(id);
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
