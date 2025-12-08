import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const customerController = new CustomerController();

router.get('/', authMiddleware, customerController.getAllCustomers);
router.get('/:id', authMiddleware, customerController.getCustomerById);
router.get('/phone/:phone', authMiddleware, customerController.getCustomerByPhone);
router.put('/:id', authMiddleware, customerController.updateCustomer);

export default router;

