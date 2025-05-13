import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Pacijent } from './Pacijent.js';

export const Termin = sequelize.define('Termin', {
  terminId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  datum:    { type: DataTypes.INTEGER, allowNull: false }, // 20250513
  status:   { type: DataTypes.INTEGER, allowNull: false } // 2 = obavljen
});
Pacijent.hasMany(Termin, { foreignKey: 'pacijentId' });
Termin.belongsTo(Pacijent, { foreignKey: 'pacijentId' });