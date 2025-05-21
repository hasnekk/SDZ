import { Sequelize } from 'sequelize';

/** Kreira svježu SQLite-memorijsku bazu za svaku test suitu */
export const makeTestSequelize = async () => {
  const sequelize = new Sequelize('sqlite::memory:', {
    logging: false,
    define: { freezeTableName: true, timestamps: false }
  });
  await sequelize.authenticate();
  return {
    sequelize,
    stop: () => sequelize.close()
  };
};
