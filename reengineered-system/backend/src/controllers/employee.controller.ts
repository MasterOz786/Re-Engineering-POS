import { Request, Response } from 'express';
import { EmployeeRepository } from '../repositories/employee.repository';
import { AuthRequest } from '../middleware/auth.middleware';
import bcrypt from 'bcrypt';

export class EmployeeController {
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  getAllEmployees = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const employees = await this.employeeRepository.findAll();
      res.json(employees.map(emp => ({
        id: emp.id,
        username: emp.username,
        first_name: emp.first_name,
        last_name: emp.last_name,
        position: emp.position,
        is_active: emp.is_active,
        created_at: emp.created_at
      })));
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch employees' });
    }
  };

  getEmployeeById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const employee = await this.employeeRepository.findById(id);
      if (!employee) {
        res.status(404).json({ error: 'Employee not found' });
        return;
      }
      res.json({
        id: employee.id,
        username: employee.username,
        first_name: employee.first_name,
        last_name: employee.last_name,
        position: employee.position,
        is_active: employee.is_active,
        created_at: employee.created_at
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch employee' });
    }
  };

  createEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { username, password, firstName, lastName, position } = req.body;

      if (!username || !password || !firstName || !lastName || !position) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      const existing = await this.employeeRepository.findByUsername(username);
      if (existing) {
        res.status(400).json({ error: 'Username already exists' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const employee = await this.employeeRepository.create(
        { username, password, firstName, lastName, position },
        passwordHash
      );

      res.status(201).json({
        id: employee.id,
        username: employee.username,
        first_name: employee.first_name,
        last_name: employee.last_name,
        position: employee.position,
        is_active: employee.is_active
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create employee' });
    }
  };

  updateEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { password, firstName, lastName, position } = req.body;

      let passwordHash: string | undefined;
      if (password) {
        passwordHash = await bcrypt.hash(password, 10);
      }

      const employee = await this.employeeRepository.update(
        id,
        { password, firstName, lastName, position },
        passwordHash
      );

      res.json({
        id: employee.id,
        username: employee.username,
        first_name: employee.first_name,
        last_name: employee.last_name,
        position: employee.position,
        is_active: employee.is_active
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update employee' });
    }
  };

  deleteEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (id === req.user!.id) {
        res.status(400).json({ error: 'Cannot delete your own account' });
        return;
      }

      const deleted = await this.employeeRepository.delete(id);
      if (!deleted) {
        res.status(404).json({ error: 'Employee not found' });
        return;
      }

      res.json({ message: 'Employee deactivated successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete employee' });
    }
  };
}

