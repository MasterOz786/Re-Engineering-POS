import sequelize from './database';
import Employee from '../models/Employee';
import bcrypt from 'bcrypt';

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Create default admin user if it doesn't exist
    const existingAdmin = await Employee.findOne({ where: { username: 'admin' } });
    
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await Employee.create({
        username: 'admin',
        password_hash: passwordHash,
        first_name: 'Admin',
        last_name: 'User',
        position: 'Admin',
        is_active: true
      });
      console.log('✅ Default admin user created (username: admin, password: admin123)');
    } else {
      // Update password if user exists but password might be wrong
      const passwordHash = await bcrypt.hash('admin123', 10);
      await existingAdmin.update({ password_hash: passwordHash });
      console.log('✅ Admin user password updated (username: admin, password: admin123)');
    }

    // Create default cashier user if it doesn't exist
    const existingCashier = await Employee.findOne({ where: { username: 'cashier' } });
    
    if (!existingCashier) {
      const passwordHash = await bcrypt.hash('cashier123', 10);
      await Employee.create({
        username: 'cashier',
        password_hash: passwordHash,
        first_name: 'Cashier',
        last_name: 'User',
        position: 'Cashier',
        is_active: true
      });
      console.log('✅ Default cashier user created (username: cashier, password: cashier123)');
    }

    console.log('✅ Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

