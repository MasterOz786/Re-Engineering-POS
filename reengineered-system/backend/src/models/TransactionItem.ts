import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Transaction from './Transaction';
import Item from './Item';

export interface TransactionItemAttributes {
  id?: number;
  transaction_id: number;
  item_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at?: Date;
}

class TransactionItem extends Model<TransactionItemAttributes> implements TransactionItemAttributes {
  public id!: number;
  public transaction_id!: number;
  public item_id!: number;
  public quantity!: number;
  public unit_price!: number;
  public subtotal!: number;
  public readonly created_at!: Date;
}

TransactionItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'transactions',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'transaction_items',
    timestamps: false,
    underscored: true
  }
);

TransactionItem.belongsTo(Transaction, { foreignKey: 'transaction_id' });
TransactionItem.belongsTo(Item, { foreignKey: 'item_id' });

export default TransactionItem;

