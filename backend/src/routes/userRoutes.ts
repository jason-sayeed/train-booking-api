import express, { Router } from 'express';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const router: Router = express.Router();

router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
