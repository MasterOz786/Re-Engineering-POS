import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { EmployeeRepository } from '../repositories/employee.repository';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    position: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const authService = new AuthService(new EmployeeRepository());
    const decoded = await authService.validateToken(token);
    
    req.user = decoded as any;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.position !== 'Admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};

