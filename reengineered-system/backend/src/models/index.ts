// Export all models for easy importing
import Employee from './Employee';
import Item from './Item';
import Customer from './Customer';
import Transaction from './Transaction';
import TransactionItem from './TransactionItem';
import Rental from './Rental';
import Coupon from './Coupon';
import EmployeeLog from './EmployeeLog';

// Define associations
Rental.belongsTo(Customer, { foreignKey: 'customer_id' });
Rental.belongsTo(Item, { foreignKey: 'item_id' });
Rental.belongsTo(Transaction, { foreignKey: 'transaction_id' });

TransactionItem.belongsTo(Transaction, { foreignKey: 'transaction_id' });
TransactionItem.belongsTo(Item, { foreignKey: 'item_id' });

Transaction.belongsTo(Employee, { foreignKey: 'employee_id' });
Transaction.belongsTo(Customer, { foreignKey: 'customer_id' });

EmployeeLog.belongsTo(Employee, { foreignKey: 'employee_id' });

export {
  Employee,
  Item,
  Customer,
  Transaction,
  TransactionItem,
  Rental,
  Coupon,
  EmployeeLog
};

