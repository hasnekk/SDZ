import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Pacijent = sequelize.define('Pacijent', {
  pacijentId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ime:        { type: DataTypes.STRING(40), allowNull: false },
  prezime:    { type: DataTypes.STRING(40), allowNull: false },
  email:      { type: DataTypes.STRING(80), unique: true, allowNull: false },
  lozinka:    { type: DataTypes.STRING(100), allowNull: false }
});
