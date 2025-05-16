import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const DomZdravlja = sequelize.define('DomZdravlja', {
  sdzId:    { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  naziv:    { type: DataTypes.STRING(80), allowNull: false },
  lokacija: { type: DataTypes.STRING(120), allowNull: false },
  osnovano: { type: DataTypes.DATEONLY, allowNull: false }
},{
  tableName: 'dom_zdravlja',
  timestamps: false
});
