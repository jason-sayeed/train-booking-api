import { body, ValidationChain } from 'express-validator';

export const createUserValidationRules: ValidationChain[] =
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),

    body('password')
      .isLength({ min: 8 })
      .withMessage(
        'Password must be at least 8 characters long',
      )
      .matches(/\d/)
      .withMessage(
        'Password must contain at least one number',
      )
      .matches(/[A-Z]/)
      .withMessage(
        'Password must contain at least one uppercase letter',
      )
      .matches(/[a-z]/)
      .withMessage(
        'Password must contain at least one lowercase letter',
      )
      .trim(),
  ];

export const updateUserValidationRules: ValidationChain[] =
  [
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),

    body('password')
      .optional()
      .isLength({ min: 8 })
      .withMessage(
        'Password must be at least 8 characters long',
      )
      .matches(/\d/)
      .withMessage(
        'Password must contain at least one number',
      )
      .matches(/[A-Z]/)
      .withMessage(
        'Password must contain at least one uppercase letter',
      )
      .matches(/[a-z]/)
      .withMessage(
        'Password must contain at least one lowercase letter',
      )
      .trim(),
  ];
