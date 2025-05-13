import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Pacijent } from './Pacijent.js';

export const Karton = sequelize.define('Karton', {
  kartonId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
});
Pacijent.hasMany(Karton, { foreignKey: 'pacijentId' });
Karton.belongsTo(Pacijent, { foreignKey: 'pacijentId' });