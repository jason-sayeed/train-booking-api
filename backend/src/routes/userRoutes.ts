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
  validateUser,
} from '../validators/validateUser';

const router: Router = express.Router();

router.get('/:id', getUser);
router.post(
  '/',
  createUserValidationRules,
  validateUser,
  createUser,
);
router.put(
  '/:id',
  updateUserValidationRules,
  validateUser,
  updateUser,
);
router.delete('/:id', deleteUser);

export default router;
