import {
  ValidationError,
  Result,
  validationResult,
} from 'express-validator';
import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';

export const validate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors: Result<ValidationError> =
    validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
