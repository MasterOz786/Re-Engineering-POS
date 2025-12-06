import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface CouponAttributes {
  id?: number;
  code: string;
  discount_percentage: number;
  is_active?: boolean;
  valid_from?: Date | null;
  valid_until?: Date | null;
  created_at?: Date;
}

class Coupon extends Model<CouponAttributes> implements CouponAttributes {
  public id!: number;
  public code!: string;
  public discount_percentage!: number;
  public is_active!: boolean;
  public valid_from?: Date | null;
  public valid_until?: Date | null;
  public readonly created_at!: Date;
}

Coupon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    valid_from: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valid_until: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'coupons',
    timestamps: false,
    underscored: true
  }
);

export default Coupon;

