import { IItemRepository } from '../repositories/item.repository';
import { ICustomerRepository } from '../repositories/customer.repository';
import { IRentalRepository } from '../repositories/rental.repository';
import { ITransactionService } from './transaction.service';
import { CreateRentalDTO, ProcessReturnDTO, ReturnResult, RentalItemDTO } from '../types';
import { RENTAL } from '../utils/constants';
import Customer from '../models/Customer';
import Rental from '../models/Rental';
import Item from '../models/Item';

export interface IRentalService {
  createRental(rentalData: CreateRentalDTO): Promise<Rental>;
  getOutstandingRentals(customerId: number): Promise<Rental[]>;
  processReturn(returnData: ProcessReturnDTO): Promise<ReturnResult>;
  calculateLateFees(rentalId: number): Promise<number>;
}

export class RentalService implements IRentalService {
  constructor(
    private itemRepository: IItemRepository,
    private customerRepository: ICustomerRepository,
    private rentalRepository: IRentalRepository,
    private transactionService: ITransactionService
  ) {}

  async createRental(rentalData: CreateRentalDTO): Promise<Rental> {
    // Validate customer exists or create
    let customer = await Customer.findOne({
      where: { phone_number: rentalData.phoneNumber }
    });

    if (!customer) {
      customer = await Customer.create({
        phone_number: rentalData.phoneNumber
      });
    }

    // Check for outstanding rentals
    const outstandingRentals = await this.getOutstandingRentals(customer.id);
    if (outstandingRentals.length > 0) {
      throw new Error('Customer has outstanding rentals');
    }

    // Process rental items
    const rentals: Rental[] = [];
    const transactionItems: any[] = [];

    for (const rentalItem of rentalData.items) {
      const item = await this.itemRepository.findById(rentalItem.itemId);
      if (!item) {
        throw new Error(`Item ${rentalItem.itemId} not found`);
      }

      if (item.quantity < rentalItem.quantity) {
        throw new Error(
          `Insufficient stock for item ${item.name}. Available: ${item.quantity}, Requested: ${rentalItem.quantity}`
        );
      }

      const dueDate = this.calculateDueDate(rentalData.rentalDate);

      const rental = await Rental.create({
        customerId: customer.id,
        itemId: item.id,
        rentalDate: rentalData.rentalDate,
        dueDate: dueDate,
        quantity: rentalItem.quantity,
        is_returned: false
      });

      rentals.push(rental);
      transactionItems.push({
        itemId: item.id,
        quantity: rentalItem.quantity,
        unitPrice: item.price
      });
    }

    // Create transaction record
    const totalAmount = this.transactionService.calculateTotal(transactionItems);
    await this.transactionService.createTransaction({
      type: 'Rental',
      customerId: customer.id,
      employeeId: rentalData.employeeId,
      items: transactionItems,
      totalAmount: totalAmount.total
    });

    // Update inventory
    await this.transactionService.updateInventoryForTransaction(
      transactionItems,
      'sale'
    );

    return rentals[0];
  }

  async getOutstandingRentals(customerId: number): Promise<Rental[]> {
    return await this.rentalRepository.findOutstandingByCustomer(customerId);
  }

  async processReturn(returnData: ProcessReturnDTO): Promise<ReturnResult> {
    const rental = await this.rentalRepository.findById(returnData.rentalId);

    if (!rental) {
      throw new Error('Rental not found');
    }

    if (rental.is_returned) {
      throw new Error('Rental already returned');
    }

    const lateFee = await this.calculateLateFees(rental.id);
    const returnDate = new Date();

    await this.rentalRepository.update(rental.id, {
      return_date: returnDate,
      is_returned: true,
      late_fee: lateFee
    });

    // Update inventory
    await this.itemRepository.updateQuantity(
      rental.item_id,
      rental.quantity
    );

    const item = await this.itemRepository.findById(rental.item_id);
    await this.transactionService.createTransaction({
      type: 'Return',
      customerId: rental.customer_id,
      employeeId: returnData.employeeId,
      items: [{
        itemId: rental.item_id,
        quantity: rental.quantity,
        unitPrice: parseFloat(item!.price.toString())
      }],
      totalAmount: lateFee
    });

    return {
      rentalId: rental.id,
      returnDate: returnDate,
      lateFee: lateFee,
      itemReturned: item!.name
    };
  }

  async calculateLateFees(rentalId: number): Promise<number> {
    const rental = await this.rentalRepository.findById(rentalId);
    if (!rental) {
      throw new Error('Rental not found');
    }

    const today = new Date();
    const dueDate = new Date(rental.due_date);

    if (today <= dueDate) {
      return 0;
    }

    const daysLate = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const item = await this.itemRepository.findById(rental.item_id);
    const itemPrice = parseFloat(item!.price.toString());
    const dailyFee = itemPrice * rental.quantity * RENTAL.LATE_FEE_RATE_PER_DAY;
    
    return dailyFee * daysLate;
  }

  private calculateDueDate(rentalDate: Date): Date {
    const dueDate = new Date(rentalDate);
    dueDate.setDate(dueDate.getDate() + RENTAL.DEFAULT_PERIOD_DAYS);
    return dueDate;
  }
}

