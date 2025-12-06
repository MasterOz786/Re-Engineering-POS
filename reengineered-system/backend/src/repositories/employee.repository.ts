import Employee, { EmployeeAttributes } from '../models/Employee';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from '../types';

export interface IEmployeeRepository {
  findAll(): Promise<Employee[]>;
  findById(id: number): Promise<Employee | null>;
  findByUsername(username: string): Promise<Employee | null>;
  create(employeeData: CreateEmployeeDTO, passwordHash: string): Promise<Employee>;
  update(id: number, employeeData: Partial<UpdateEmployeeDTO>, passwordHash?: string): Promise<Employee>;
  delete(id: number): Promise<boolean>;
}

export class EmployeeRepository implements IEmployeeRepository {
  async findAll(): Promise<Employee[]> {
    return await Employee.findAll({
      where: { is_active: true },
      order: [['created_at', 'DESC']]
    });
  }

  async findByUsername(username: string): Promise<Employee | null> {
    return await Employee.findOne({
      where: { username, is_active: true }
    });
  }

  async findById(id: number): Promise<Employee | null> {
    return await Employee.findByPk(id);
  }

  async create(employeeData: CreateEmployeeDTO, passwordHash: string): Promise<Employee> {
    return await Employee.create({
      username: employeeData.username,
      password_hash: passwordHash,
      first_name: employeeData.firstName,
      last_name: employeeData.lastName,
      position: employeeData.position,
      is_active: true
    });
  }

  async update(id: number, employeeData: Partial<UpdateEmployeeDTO>, passwordHash?: string): Promise<Employee> {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw new Error('Employee not found');
    }

    const updateData: Partial<EmployeeAttributes> = {};
    if (employeeData.firstName) updateData.first_name = employeeData.firstName;
    if (employeeData.lastName) updateData.last_name = employeeData.lastName;
    if (employeeData.position) updateData.position = employeeData.position;
    if (passwordHash) updateData.password_hash = passwordHash;

    await employee.update(updateData);
    return employee;
  }

  async delete(id: number): Promise<boolean> {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return false;
    }

    await employee.update({ is_active: false });
    return true;
  }
}

