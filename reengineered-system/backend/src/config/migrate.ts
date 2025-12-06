import sequelize from './database';
import Employee from '../models/Employee';
import Item from '../models/Item';
import Customer from '../models/Customer';
import Transaction from '../models/Transaction';
import Rental from '../models/Rental';

const runMigrations = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database models synchronized.');

    console.log('✅ Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();

