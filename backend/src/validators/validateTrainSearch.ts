import { query } from 'express-validator';
import { validate } from '../middleware/validationMiddleware';
import { RequestHandler } from 'express';

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

export const validateTrainSearch: RequestHandler = validate;