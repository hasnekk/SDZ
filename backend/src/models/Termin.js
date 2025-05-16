import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Pacijent } from './Pacijent.js';

export const Termin = sequelize.define('Termin', {
  terminid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  datum:    { type: DataTypes.DATEONLY, allowNull: false },
  status:   {                     // mapiramo na ENUM u bazi
    type: DataTypes.ENUM('scheduled','completed','canceled','not-arrived'),
    allowNull: false
  }
},{
  tableName:'termin',
  timestamps:false
});

Pacijent.hasMany(Termin, { foreignKey: 'pacijentId' });
Termin.belongsTo(Pacijent, { foreignKey: 'pacijentId' });