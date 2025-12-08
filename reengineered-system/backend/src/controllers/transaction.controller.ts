import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TransactionService } from '../services/transaction.service';
import { ItemRepository } from '../repositories/item.repository';
import { CustomerRepository } from '../repositories/customer.repository';
import { RentalRepository } from '../repositories/rental.repository';
import { PricingService } from '../services/pricing.service';
import { RentalService } from '../services/rental.service';
import Transaction from '../models/Transaction';
import TransactionItem from '../models/TransactionItem';

export class TransactionController {
  private transactionService: TransactionService;
  private rentalService: RentalService;

  constructor() {
    const itemRepo = new ItemRepository();
    const customerRepo = new CustomerRepository();
    const rentalRepo = new RentalRepository();
    const pricingService = new PricingService();
    this.transactionService = new TransactionService(itemRepo, pricingService);
    this.rentalService = new RentalService(itemRepo, customerRepo, rentalRepo, this.transactionService);
  }

  createSale = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const transactionData = {
        ...req.body,
        employeeId: req.user!.id,
        type: 'Sale' as const
      };

      const transaction = await this.transactionService.createTransaction(transactionData);
      await this.transactionService.updateInventoryForTransaction(
        transactionData.items,
        'sale'
      );

      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create sale' });
    }
  };

  createRental = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rentalData = {
        ...req.body,
        employeeId: req.user!.id
      };

      const rental = await this.rentalService.createRental(rentalData);
      res.status(201).json(rental);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create rental' });
    }
  };

  processReturn = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const returnData = {
        ...req.body,
        employeeId: req.user!.id
      };

      const result = await this.rentalService.processReturn(returnData);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to process return' });
    }
  };

  getAllTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { type, limit = 50 } = req.query;
      const where: any = {};
      if (type) {
        where.transaction_type = type;
      }

      const transactions = await Transaction.findAll({
        where,
        limit: parseInt(limit as string),
        order: [['created_at', 'DESC']],
        include: [
          { association: 'Employee', attributes: ['id', 'username', 'first_name', 'last_name'] },
          { association: 'Customer', attributes: ['id', 'phone_number', 'first_name', 'last_name'] }
        ]
      });

      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch transactions' });
    }
  };

  getTransactionById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await Transaction.findByPk(id, {
        include: [
          { association: 'Employee', attributes: ['id', 'username', 'first_name', 'last_name'] },
          { association: 'Customer', attributes: ['id', 'phone_number', 'first_name', 'last_name'] },
          { association: 'TransactionItems', include: [{ association: 'Item' }] }
        ]
      });

      if (!transaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch transaction' });
    }
  };

  getTransactionsByType = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const type = req.params.type as 'Sale' | 'Rental' | 'Return';
      const { limit = 50 } = req.query;

      const transactions = await Transaction.findAll({
        where: { transaction_type: type },
        limit: parseInt(limit as string),
        order: [['created_at', 'DESC']],
        include: [
          { association: 'Employee', attributes: ['id', 'username', 'first_name', 'last_name'] },
          { association: 'Customer', attributes: ['id', 'phone_number', 'first_name', 'last_name'] }
        ]
      });

      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch transactions' });
    }
  };
}

