import Customer from '../models/Customer';

export interface ICustomerRepository {
  findByPhone(phoneNumber: string): Promise<Customer | null>;
  create(phoneNumber: string): Promise<Customer>;
  findById(id: number): Promise<Customer | null>;
}

export class CustomerRepository implements ICustomerRepository {
  async findByPhone(phoneNumber: string): Promise<Customer | null> {
    return await Customer.findOne({
      where: { phone_number: phoneNumber }
    });
  }

  async create(phoneNumber: string): Promise<Customer> {
    return await Customer.create({
      phone_number: phoneNumber
    });
  }

  async findById(id: number): Promise<Customer | null> {
    return await Customer.findByPk(id);
  }
}

