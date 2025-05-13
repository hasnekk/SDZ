import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Pacijent } from './Pacijent.js';

export const Analitika = sequelize.define('Analitika', {
  analitikaId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
});
Pacijent.hasMany(Analitika, { foreignKey: 'pacijentId' });
Analitika.belongsTo(Pacijent, { foreignKey: 'pacijentId' });
