import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: unknown,
  statusCode = 200,
): void => {
  res.status(statusCode).json(data);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
): void => {
  res.status(statusCode).json({ error: message });
};
