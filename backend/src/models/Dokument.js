import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Karton } from './Karton.js';

export const Dokument = sequelize.define('Dokument', {
  dokumentId:  { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  dokumentTip: { type: DataTypes.STRING(10), allowNull: false },
  dokument:    { type: DataTypes.TEXT }          // base64 ili path
});
Karton.hasMany(Dokument, { foreignKey: 'kartonId' });
Dokument.belongsTo(Karton, { foreignKey: 'kartonId' });