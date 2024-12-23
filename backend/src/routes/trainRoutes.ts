import express, { Router } from 'express';
import { searchTrains } from '../controllers/trainController';

const router: Router = express.Router();

router.get('/search', searchTrains);

export default router;
