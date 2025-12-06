import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface CustomerAttributes {
  id?: number;
  phone_number: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

class Customer extends Model<CustomerAttributes> implements CustomerAttributes {
  public id!: number;
  public phone_number!: string;
  public first_name?: string | null;
  public last_name?: string | null;
  public email?: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'customers',
    timestamps: true,
    underscored: true
  }
);

export default Customer;

