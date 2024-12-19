import { Response } from 'express';
import { sendError } from './responseHelper';

export const handleError = (
  res: Response,
  error: unknown,
): Response => {
  if (error instanceof Error) {
    return sendError(res, error.message, 400);
  }
  return sendError(res, 'An unknown error occurred', 400);
};
