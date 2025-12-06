import Rental from '../models/Rental';
import Customer from '../models/Customer';
import Item from '../models/Item';

export interface IRentalRepository {
  findOutstandingByCustomer(customerId: number): Promise<Rental[]>;
  findById(id: number): Promise<Rental | null>;
  create(data: any): Promise<Rental>;
  update(id: number, data: any): Promise<Rental>;
}

export class RentalRepository implements IRentalRepository {
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

