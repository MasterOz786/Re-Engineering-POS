import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { EmployeeRepository } from '../repositories/employee.repository';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService(new EmployeeRepository());
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const result = await this.authService.login(username, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Authentication failed' });
    }
  };

  validateToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const decoded = await this.authService.validateToken(token);
      res.json({ valid: true, user: decoded });
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Invalid token' });
    }
  };
}

