import express, { Router } from 'express';
import { searchTrains } from '../controllers/trainController';
import {
  trainSearchValidationRules,
  validateTrainSearch,
} from '../middleware/validateTrainSearch';

const router: Router = express.Router();

router.get(
  '/search',
  trainSearchValidationRules,
  validateTrainSearch,
  searchTrains,
);

export default router;
