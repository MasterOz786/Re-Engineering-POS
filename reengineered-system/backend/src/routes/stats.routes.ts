import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const statsController = new StatsController();

router.get('/', authMiddleware, statsController.getStats);

export default router;

