import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Customer from './Customer';
import Item from './Item';
import Transaction from './Transaction';

export interface RentalAttributes {
  id?: number;
  transaction_id?: number | null;
  customer_id: number;
  item_id: number;
  rental_date: Date;
  due_date: Date;
  return_date?: Date | null;
  is_returned?: boolean;
  late_fee?: number;
  quantity: number;
  created_at?: Date;
}

class Rental extends Model<RentalAttributes> implements RentalAttributes {
  public id!: number;
  public transaction_id?: number | null;
  public customer_id!: number;
  public item_id!: number;
  public rental_date!: Date;
  public due_date!: Date;
  public return_date?: Date | null;
  public is_returned!: boolean;
  public late_fee!: number;
  public quantity!: number;
  public readonly created_at!: Date;
}

Rental.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'transactions',
        key: 'id'
      }
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      }
    },
    rental_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    return_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    is_returned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    late_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'rentals',
    timestamps: false,
    underscored: true
  }
);

Rental.belongsTo(Customer, { foreignKey: 'customer_id' });
Rental.belongsTo(Item, { foreignKey: 'item_id' });
Rental.belongsTo(Transaction, { foreignKey: 'transaction_id' });

export default Rental;

