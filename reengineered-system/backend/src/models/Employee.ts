import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface EmployeeAttributes {
  id?: number;
  username: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  position: 'Admin' | 'Cashier';
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

class Employee extends Model<EmployeeAttributes> implements EmployeeAttributes {
  public id!: number;
  public username!: string;
  public password_hash!: string;
  public first_name!: string;
  public last_name!: string;
  public position!: 'Admin' | 'Cashier';
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    position: {
      type: DataTypes.ENUM('Admin', 'Cashier'),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    tableName: 'employees',
    timestamps: true,
    underscored: true
  }
);

export default Employee;

