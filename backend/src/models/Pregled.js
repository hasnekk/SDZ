import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Termin } from './Termin.js';

export const Pregled = sequelize.define('Pregled', {
  pregledId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  opis:      { type: DataTypes.TEXT, allowNull: false }
},{
  tableName: 'pregled',
  timestamps: false
});
Termin.hasMany(Pregled, { foreignKey: 'terminId' });
Pregled.belongsTo(Termin, { foreignKey: 'terminId' });