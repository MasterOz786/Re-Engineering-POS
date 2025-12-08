import { Request, Response } from 'express';
import { ItemService } from '../services/item.service';
import { ItemRepository } from '../repositories/item.repository';

export class ItemController {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService(new ItemRepository());
  }

  getAllItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const items = await this.itemService.getAllItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch items' });
    }
  };

  getItemById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const item = await this.itemService.getItemById(id);
      res.json(item);
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Item not found' });
    }
  };

  createItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await this.itemService.createItem(req.body);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create item' });
    }
  };

  updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const item = await this.itemService.updateItem(id, req.body);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update item' });
    }
  };

  deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.itemService.deleteItem(id);
      res.json({ message: 'Item deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete item' });
    }
  };
}

