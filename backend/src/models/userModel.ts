import mongoose, {
  Schema,
  Model,
  Document,
} from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value: string): boolean => {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
          value,
        );
      },
      message: (props: { value: string }): string =>
        `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [
      6,
      'Password must be at least 6 characters long',
    ],
  },
});

const User: Model<IUser> = mongoose.model<IUser>(
  'User',
  userSchema,
);

export default User;
export { IUser };
