import { Response } from 'express';
import { sendError } from './responseHelper';
import mongoose from 'mongoose';

export const handleError = (
  res: Response,
  error: unknown,
): void => {
  if (error instanceof mongoose.Error.CastError) {
    sendError(res, 'Invalid ID format', 400);
    return;
  }

  if (error instanceof Error) {
    sendError(res, error.message, 400);
    return;
  }
  sendError(res, 'An unknown error occurred', 400);
};
