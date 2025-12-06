import sequelize from './database';
// Import all models to ensure they're registered
import '../models';

const runMigrations = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sync all models - this will create tables if they don't exist
    await sequelize.sync({ force: false });
    console.log('✅ Database models synchronized.');

    console.log('✅ Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();

