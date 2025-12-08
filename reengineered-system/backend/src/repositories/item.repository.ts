import { Transaction } from 'sequelize';
import Item, { ItemAttributes } from '../models/Item';
import { CreateItemDTO, UpdateItemDTO } from '../types';

export interface IItemRepository {
  findAll(): Promise<Item[]>;
  findById(id: number): Promise<Item | null>;
  findByCode(code: string): Promise<Item | null>;
  updateQuantity(itemId: number, quantityChange: number, transaction?: Transaction): Promise<Item>;
  update(itemId: number, itemData: UpdateItemDTO): Promise<Item>;
  create(itemData: CreateItemDTO): Promise<Item>;
  delete(id: number): Promise<void>;
}

export class ItemRepository implements IItemRepository {
  async findAll(): Promise<Item[]> {
    return await Item.findAll({
      order: [['name', 'ASC']]
    });
  }

  async findById(id: number): Promise<Item | null> {
    return await Item.findByPk(id);
  }

  async findByCode(code: string): Promise<Item | null> {
    return await Item.findOne({
      where: { item_code: code }
    });
  }

  async updateQuantity(itemId: number, quantityChange: number, transaction?: Transaction): Promise<Item> {
    const item = await Item.findByPk(itemId, { transaction });
    if (!item) {
      throw new Error('Item not found');
    }

    const newQuantity = item.quantity + quantityChange;
    if (newQuantity < 0) {
      throw new Error('Insufficient inventory');
    }

    await item.update({ quantity: newQuantity }, { transaction });
    return item;
  }

  async update(itemId: number, itemData: UpdateItemDTO): Promise<Item> {
    const item = await Item.findByPk(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    const updateData: Partial<ItemAttributes> = {};
    if (itemData.name) updateData.name = itemData.name;
    if (itemData.price !== undefined) updateData.price = itemData.price;
    if (itemData.quantity !== undefined) updateData.quantity = itemData.quantity;
    if (itemData.category !== undefined) updateData.category = itemData.category;

    await item.update(updateData);
    return item;
  }

  async create(itemData: CreateItemDTO): Promise<Item> {
    return await Item.create({
      item_code: itemData.itemCode,
      name: itemData.name,
      price: itemData.price,
      quantity: itemData.quantity,
      category: itemData.category || null
    });
  }

  async delete(id: number): Promise<void> {
    const item = await Item.findByPk(id);
    if (!item) {
      throw new Error('Item not found');
    }
    await item.destroy();
  }
}

