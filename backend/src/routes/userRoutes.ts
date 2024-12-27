import express, { Router } from 'express';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import {
  userValidationRules,
  validateUser,
} from '../validators/validateUser';

const router: Router = express.Router();

router.get('/:id', getUser);
router.post(
  '/',
  userValidationRules,
  validateUser,
  createUser,
);
router.put(
  '/:id',
  userValidationRules,
  validateUser,
  updateUser,
);
router.delete('/:id', deleteUser);

export default router;
