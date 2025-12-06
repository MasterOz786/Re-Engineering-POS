import { Router } from 'express';
import { ItemController } from '../controllers/item.controller';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';

const router = Router();
const itemController = new ItemController();

router.get('/', authMiddleware, itemController.getAllItems);
router.get('/:id', authMiddleware, itemController.getItemById);
router.post('/', authMiddleware, adminOnly, itemController.createItem);
router.put('/:id', authMiddleware, adminOnly, itemController.updateItem);

export default router;

