import { Response } from 'express';
import { CustomerRepository } from '../repositories/customer.repository';
import { AuthRequest } from '../middleware/auth.middleware';
import Customer from '../models/Customer';

export class CustomerController {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  getAllCustomers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const customers = await Customer.findAll({
        order: [['created_at', 'DESC']]
      });
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch customers' });
    }
  };

  getCustomerById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const customer = await this.customerRepository.findById(id);
      if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch customer' });
    }
  };

  getCustomerByPhone = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const phoneNumber = req.params.phone;
      const customer = await this.customerRepository.findByPhone(phoneNumber);
      if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch customer' });
    }
  };

  updateCustomer = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const customer = await Customer.findByPk(id);
      
      if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      const { first_name, last_name, email } = req.body;
      await customer.update({
        first_name: first_name || customer.first_name,
        last_name: last_name || customer.last_name,
        email: email || customer.email
      });

      res.json(customer);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update customer' });
    }
  };
}

