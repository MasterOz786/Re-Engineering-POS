import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Transaction from '../models/Transaction';
import Rental from '../models/Rental';
import Item from '../models/Item';
import { Op } from 'sequelize';

export class StatsController {
  getStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const [totalSales, activeRentals, inventoryItems, recentTransactions] = await Promise.all([
        // Total sales count
        Transaction.count({
          where: { transaction_type: 'Sale' }
        }),
        // Active rentals (not returned)
        Rental.count({
          where: { is_returned: false }
        }),
        // Total inventory items
        Item.count(),
        // Recent transactions (last 10)
        Transaction.findAll({
          limit: 10,
          order: [['created_at', 'DESC']],
          attributes: ['id', 'transaction_type', 'total_amount', 'created_at']
        })
      ]);

      // Calculate total sales amount
      const salesTransactions = await Transaction.findAll({
        where: { transaction_type: 'Sale' },
        attributes: ['total_amount']
      });
      const totalSalesAmount = salesTransactions.reduce((sum, t) => sum + parseFloat(t.total_amount.toString()), 0);

      res.json({
        totalSales,
        totalSalesAmount: totalSalesAmount.toFixed(2),
        activeRentals,
        inventoryItems,
        recentTransactions: recentTransactions.map(t => ({
          id: t.id,
          type: t.transaction_type,
          amount: parseFloat(t.total_amount.toString()).toFixed(2),
          date: t.created_at
        }))
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch statistics' });
    }
  };
}

