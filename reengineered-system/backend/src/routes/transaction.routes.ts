import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const transactionController = new TransactionController();

router.get('/', authMiddleware, transactionController.getAllTransactions);
router.get('/:id', authMiddleware, transactionController.getTransactionById);
router.get('/type/:type', authMiddleware, transactionController.getTransactionsByType);
router.post('/sale', authMiddleware, transactionController.createSale);
router.post('/rental', authMiddleware, transactionController.createRental);
router.post('/return', authMiddleware, transactionController.processReturn);

export default router;

