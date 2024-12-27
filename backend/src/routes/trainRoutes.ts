import express, { Router } from 'express';
import { searchTrains } from '../controllers/trainController';
import { trainSearchValidationRules } from '../validators/validateTrainSearch';
import { validate } from '../middleware/validationMiddleware';

const router: Router = express.Router();

router.get(
  '/search',
  trainSearchValidationRules,
  validate,
  searchTrains,
);

export default router;
