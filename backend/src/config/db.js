import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(process.env.DB_URL, {
  logging: false   // ispiši SQL ako želiš: console.log
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✔ DB connected');
  } catch (e) {
    console.error('DB error ➜', e.message);
    process.exit(1);
  }
};
