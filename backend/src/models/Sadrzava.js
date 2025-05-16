import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Pacijent } from './Pacijent.js';
import { DomZdravlja } from './DomZdravlja.js';

export const Sadrzava = sequelize.define('Sadrzava', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
},{
  tableName: 'sadrzava',
  timestamps: false
});
DomZdravlja.belongsToMany(Pacijent, { through: Sadrzava, foreignKey: 'sdzId' });
Pacijent.belongsToMany(DomZdravlja, { through: Sadrzava, foreignKey: 'pacijentId' });
