import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Employee from './Employee';

export interface EmployeeLogAttributes {
  id?: number;
  employee_id: number;
  action: string;
  details?: any;
  timestamp?: Date;
}

class EmployeeLog extends Model<EmployeeLogAttributes> implements EmployeeLogAttributes {
  public id!: number;
  public employee_id!: number;
  public action!: string;
  public details!: any;
  public readonly timestamp!: Date;
}

EmployeeLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'employee_logs',
    timestamps: false,
    underscored: true
  }
);

EmployeeLog.belongsTo(Employee, { foreignKey: 'employee_id' });

export default EmployeeLog;

