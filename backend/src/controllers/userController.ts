import { RequestHandler } from 'express';
import User from '../models/userModel';
import { hashPassword } from '../utils/hashPassword';
import { handleError } from '../utils/handleError';
import {
  sendError,
  sendSuccess,
} from '../utils/responseHelper';

const MONGO_DUPLICATE_KEY_ERROR = 11000;

export const createUser: RequestHandler = async (
  req,
  res,
) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return sendError(
        res,
        'Name, email, and password are required',
        400,
      );
    }
    const hashedPassword = await hashPassword(password);
    const savedUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return sendSuccess(res, savedUser, 201);
  } catch (error: unknown) {
    const err = error as {
      code?: number;
      message?: string;
    };
    if (err.code === MONGO_DUPLICATE_KEY_ERROR) {
      return sendError(res, 'Email already exists', 400);
    }
    return handleError(res, error);
  }
};

export const getUser: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 'User not found', 400);
    }
    return sendSuccess(res, user);
  } catch (error: unknown) {
    return handleError(res, error);
  }
};

export const updateUser: RequestHandler = async (
  req,
  res,
) => {
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
) => {
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

export const getAllUsers: RequestHandler = async (
  _req,
  res,
) => {
  try {
    const users = await User.find();
    return sendSuccess(res, users);
  } catch (error: unknown) {
    return handleError(res, error);
  }
};
