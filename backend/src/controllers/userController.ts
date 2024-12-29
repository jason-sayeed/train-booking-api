import { RequestHandler } from 'express';
import User from '../models/userModel';
import { hashPassword } from '../utils/hashPassword';
import { handleError } from '../utils/handleError';
import {
  sendError,
  sendSuccess,
} from '../utils/responseHelper';

export const createUser: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!email) {
      return sendError(res, 'Email is required', 400);
    }

    if (!password) {
      return sendError(res, 'Password is required', 400);
    }

    if (!name) {
      return sendError(res, 'Name is required', 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'Email already exists', 400);
    }

    const hashedPassword: string =
      await hashPassword(password);
    const savedUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    return sendSuccess(res, savedUser, 201);
  } catch (error: unknown) {
    return handleError(res, error);
  }
};

export const getUser: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, user);
  } catch (error: unknown) {
    return handleError(res, error);
  }
};

export const updateUser: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    if (req.body.password) {
      req.body.password = await hashPassword(
        req.body.password,
      );
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, updatedUser);
  } catch (error: unknown) {
    return handleError(res, error);
  }
};

export const deleteUser: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const deletedUser = await User.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedUser) {
      return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, {
      message: 'User successfully deleted',
    });
  } catch (error: unknown) {
    return handleError(res, error);
  }
};
