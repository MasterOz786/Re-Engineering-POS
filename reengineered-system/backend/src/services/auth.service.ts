import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IEmployeeRepository } from '../repositories/employee.repository';
import { LoginResult } from '../types';

export interface IAuthService {
  login(username: string, password: string): Promise<LoginResult>;
  validateToken(token: string): Promise<any>;
}

export class AuthService implements IAuthService {
  constructor(
    private employeeRepository: IEmployeeRepository
  ) {}

  async login(username: string, password: string): Promise<LoginResult> {
    const employee = await this.employeeRepository.findByUsername(username);
    
    if (!employee) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, employee.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateJWT(employee);
    
    return {
      token,
      employee: {
        id: employee.id,
        username: employee.username,
        name: `${employee.first_name} ${employee.last_name}`,
        position: employee.position
      }
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private generateJWT(employee: any): string {
    return jwt.sign(
      {
        id: employee.id,
        username: employee.username,
        position: employee.position
      },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    );
  }
}

