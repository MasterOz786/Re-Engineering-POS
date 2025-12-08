import { Router } from 'express';
import { RentalController } from '../controllers/rental.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const rentalController = new RentalController();

router.get('/', authMiddleware, rentalController.getAll);
router.get('/active', authMiddleware, rentalController.getActive);
router.get('/outstanding', authMiddleware, rentalController.getOutstanding);
router.get('/:id', authMiddleware, rentalController.getById);

export default router;

