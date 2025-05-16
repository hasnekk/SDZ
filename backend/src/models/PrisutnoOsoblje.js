import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Termin } from './Termin.js';
import { Osoblje } from './Osoblje.js';

export const PristunoOsoblje = sequelize.define('PristunoOsoblje', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
},{
  tableName: 'prisutno_osoblje',
  timestamps: false
});
Termin.belongsToMany(Osoblje, { through: PristunoOsoblje, foreignKey: 'terminId' });
Osoblje.belongsToMany(Termin, { through: PristunoOsoblje, foreignKey: 'osobljeId' });
