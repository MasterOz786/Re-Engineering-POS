import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface ItemAttributes {
  id?: number;
  item_code: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  created_at?: Date;
  updated_at?: Date;
}

class Item extends Model<ItemAttributes> implements ItemAttributes {
  public id!: number;
  public item_code!: string;
  public name!: string;
  public price!: number;
  public quantity!: number;
  public category!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    item_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
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
    tableName: 'items',
    timestamps: true,
    underscored: true
  }
);

export default Item;

