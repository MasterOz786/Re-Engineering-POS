import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { RentalService } from '../services/rental.service';
import { RentalRepository } from '../repositories/rental.repository';
import { ItemRepository } from '../repositories/item.repository';
import { CustomerRepository } from '../repositories/customer.repository';
import { TransactionService } from '../services/transaction.service';
import { PricingService } from '../services/pricing.service';

export class RentalController {
  private rentalService: RentalService;

  constructor() {
    const itemRepo = new ItemRepository();
    const customerRepo = new CustomerRepository();
    const rentalRepo = new RentalRepository();
    const pricingService = new PricingService();
    const transactionService = new TransactionService(itemRepo, pricingService);
    this.rentalService = new RentalService(itemRepo, customerRepo, rentalRepo, transactionService);
  }

  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const rentals = await this.rentalService.getAllRentals(limit);
      res.json(rentals);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch rentals' });
    }
  };

  getActive = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const rentals = await this.rentalService.getActiveRentals(limit);
      res.json(rentals);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch active rentals' });
    }
  };

  getOutstanding = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const rentals = await this.rentalService.getOutstanding(limit);
      res.json(rentals);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch outstanding rentals' });
    }
  };

  getById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const rental = await this.rentalService.getRentalById(id);
      res.json(rental);
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Rental not found' });
    }
  };
}

