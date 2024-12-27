import express, { Router } from 'express';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import {
  createUserValidationRules,
  updateUserValidationRules,
} from '../validators/validateUser';
import { validate } from '../middleware/validationMiddleware';

const router: Router = express.Router();

router.get('/:id', getUser);
router.post(
  '/',
  createUserValidationRules,
  validate,
  createUser,
);
router.put(
  '/:id',
  updateUserValidationRules,
  validate,
  updateUser,
);
router.delete('/:id', deleteUser);

export default router;
