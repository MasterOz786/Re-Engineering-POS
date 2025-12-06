import { IItemRepository } from '../repositories/item.repository';
import { CreateItemDTO, UpdateItemDTO } from '../types';
import Item from '../models/Item';

export interface IItemService {
  getAllItems(): Promise<Item[]>;
  getItemById(id: number): Promise<Item>;
  createItem(itemData: CreateItemDTO): Promise<Item>;
  updateItem(id: number, itemData: UpdateItemDTO): Promise<Item>;
  checkStockAvailability(itemId: number, requestedQuantity: number): Promise<boolean>;
}

export class ItemService implements IItemService {
  constructor(
    private itemRepository: IItemRepository
  ) {}

  async getAllItems(): Promise<Item[]> {
    return await this.itemRepository.findAll();
  }

  async getItemById(id: number): Promise<Item> {
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }

  async createItem(itemData: CreateItemDTO): Promise<Item> {
    return await this.itemRepository.create(itemData);
  }

  async updateItem(id: number, itemData: UpdateItemDTO): Promise<Item> {
    return await this.itemRepository.update(id, itemData);
  }

  async checkStockAvailability(itemId: number, requestedQuantity: number): Promise<boolean> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      return false;
    }
    return item.quantity >= requestedQuantity;
  }
}

