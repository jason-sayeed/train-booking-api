import mongoose, {
  Schema,
  Model,
  Document,
} from 'mongoose';

interface IUser extends Document {
  _id: string;
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
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [
      8,
      'Password must be at least 8 characters long',
    ],
  },
});

const User: Model<IUser> = mongoose.model<IUser>(
  'User',
  userSchema,
);

export default User;
export { IUser };
