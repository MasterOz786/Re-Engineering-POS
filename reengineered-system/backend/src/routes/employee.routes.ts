import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';

const router = Router();
const employeeController = new EmployeeController();

router.get('/', authMiddleware, employeeController.getAllEmployees);
router.get('/:id', authMiddleware, employeeController.getEmployeeById);
router.post('/', authMiddleware, adminOnly, employeeController.createEmployee);
router.put('/:id', authMiddleware, adminOnly, employeeController.updateEmployee);
router.delete('/:id', authMiddleware, adminOnly, employeeController.deleteEmployee);

export default router;

