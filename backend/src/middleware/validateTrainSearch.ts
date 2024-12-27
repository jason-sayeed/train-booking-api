import { query, validationResult } from 'express-validator';
import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';

export const trainSearchValidationRules = [
  query('startStation')
    .notEmpty()
    .withMessage('startStation is required'),
  query('endStation')
    .notEmpty()
    .withMessage('endStation is required'),
  query('date')
    .notEmpty()
    .withMessage('date is required')
    .isDate()
    .withMessage('date must be a valid date'),
  query('numberOfSeatsRequested')
    .notEmpty()
    .withMessage('numberOfSeatsRequested is required')
    .isInt({ min: 1 })
    .withMessage(
      'numberOfSeatsRequested must be a positive number',
    ),
];

export const validateTrainSearch: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
