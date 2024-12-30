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
import { ensureAuthenticated } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.get('/:id', ensureAuthenticated, getUser);
router.post(
  '/',
  createUserValidationRules,
  validate,
  createUser,
);
router.put(
  '/:id',
  ensureAuthenticated,
  updateUserValidationRules,
  validate,
  updateUser,
);
router.delete('/:id', ensureAuthenticated, deleteUser);

export default router;
