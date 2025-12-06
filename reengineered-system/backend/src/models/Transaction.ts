import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Employee from './Employee';
import Customer from './Customer';

export interface TransactionAttributes {
  id?: number;
  transaction_type: 'Sale' | 'Rental' | 'Return';
  employee_id?: number | null;
  customer_id?: number | null;
  total_amount: number;
  tax_amount?: number;
  discount_amount?: number;
  coupon_code?: string | null;
  status?: string;
  created_at?: Date;
}

class Transaction extends Model<TransactionAttributes> implements TransactionAttributes {
  public id!: number;
  public transaction_type!: 'Sale' | 'Rental' | 'Return';
  public employee_id?: number | null;
  public customer_id?: number | null;
  public total_amount!: number;
  public tax_amount!: number;
  public discount_amount!: number;
  public coupon_code?: string | null;
  public status!: string;
  public readonly created_at!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    transaction_type: {
      type: DataTypes.ENUM('Sale', 'Rental', 'Return'),
      allowNull: false
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    coupon_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'Completed'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'transactions',
    timestamps: false,
    underscored: true
  }
);

Transaction.belongsTo(Employee, { foreignKey: 'employee_id' });
Transaction.belongsTo(Customer, { foreignKey: 'customer_id' });

export default Transaction;

