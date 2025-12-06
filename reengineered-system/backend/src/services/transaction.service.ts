import { Transaction as SequelizeTransaction } from 'sequelize';
import { TransactionItem, CreateTransactionDTO } from '../types';
import { IItemRepository } from '../repositories/item.repository';
import { IPricingService } from './pricing.service';
import Transaction from '../models/Transaction';
import TransactionItemModel from '../models/TransactionItem';
import sequelize from '../config/database';

export interface ITransactionService {
  createTransaction(data: CreateTransactionDTO): Promise<Transaction>;
  updateInventoryForTransaction(items: TransactionItem[], operation: 'sale' | 'return'): Promise<void>;
  calculateTotal(items: TransactionItem[]): { subtotal: number; tax: number; discount: number; total: number };
}

export class TransactionService implements ITransactionService {
  constructor(
    private itemRepository: IItemRepository,
    private pricingService: IPricingService
  ) {}

  async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    const total = this.calculateTotal(data.items);
    const transaction = await sequelize.transaction();
    
    try {
      const newTransaction = await Transaction.create({
        transaction_type: data.type,
        employee_id: data.employeeId,
        customer_id: data.customerId || null,
        total_amount: total.total,
        tax_amount: total.tax,
        discount_amount: total.discount,
        coupon_code: data.couponCode || null,
        status: 'Completed'
      }, { transaction });

      // Create transaction items
      for (const item of data.items) {
        await TransactionItemModel.create({
          transaction_id: newTransaction.id,
          item_id: item.itemId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          subtotal: item.unitPrice * item.quantity
        }, { transaction });
      }

      await transaction.commit();
      return newTransaction;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateInventoryForTransaction(
    items: TransactionItem[],
    operation: 'sale' | 'return'
  ): Promise<void> {
    const transaction = await sequelize.transaction();
    
    try {
      for (const transactionItem of items) {
        const quantityChange = operation === 'sale' 
          ? -transactionItem.quantity 
          : transactionItem.quantity;

        await this.itemRepository.updateQuantity(
          transactionItem.itemId,
          quantityChange,
          transaction
        );
      }
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  calculateTotal(items: TransactionItem[]): { subtotal: number; tax: number; discount: number; total: number } {
    return this.pricingService.calculateTotal(items);
  }
}

