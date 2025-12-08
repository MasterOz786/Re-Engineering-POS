import Rental from '../models/Rental';
import Customer from '../models/Customer';
import Item from '../models/Item';
import { Op } from 'sequelize';

export interface IRentalRepository {
  findOutstandingByCustomer(customerId: number): Promise<Rental[]>;
  findById(id: number): Promise<Rental | null>;
  findAll(limit?: number): Promise<Rental[]>;
  findActive(limit?: number): Promise<Rental[]>;
  findOutstanding(limit?: number): Promise<Rental[]>;
  create(data: any): Promise<Rental>;
  update(id: number, data: any): Promise<Rental>;
}

export class RentalRepository implements IRentalRepository {
  async findAll(limit: number = 100): Promise<Rental[]> {
    return await Rental.findAll({
      limit,
      order: [['created_at', 'DESC']],
      include: [
        { model: Customer },
        { model: Item }
      ]
    });
  }

  async findActive(limit: number = 100): Promise<Rental[]> {
    return await Rental.findAll({
      where: {
        is_returned: false
      },
      limit,
      order: [['created_at', 'DESC']],
      include: [
        { model: Customer },
        { model: Item }
      ]
    });
  }

  async findOutstanding(limit: number = 100): Promise<Rental[]> {
    const today = new Date().toISOString().split('T')[0];
    return await Rental.findAll({
      where: {
        is_returned: false,
        due_date: { [Op.lt]: today }
      },
      limit,
      order: [['due_date', 'ASC']],
      include: [
        { model: Customer },
        { model: Item }
      ]
    });
  }

  async findOutstandingByCustomer(customerId: number): Promise<Rental[]> {
    return await Rental.findAll({
      where: {
        customer_id: customerId,
        is_returned: false
      },
      include: [
        { model: Customer },
        { model: Item }
      ]
    });
  }

  async findById(id: number): Promise<Rental | null> {
    return await Rental.findByPk(id, {
      include: [
        { model: Customer },
        { model: Item }
      ]
    });
  }

  async create(data: any): Promise<Rental> {
    return await Rental.create(data);
  }

  async update(id: number, data: any): Promise<Rental> {
    const rental = await Rental.findByPk(id);
    if (!rental) {
      throw new Error('Rental not found');
    }
    await rental.update(data);
    return rental;
  }
}

