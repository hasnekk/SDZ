import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { DomZdravlja } from './DomZdravlja.js';

export const Osoblje = sequelize.define('Osoblje', {
  osobljeId:   { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ime:         { type: DataTypes.STRING(40), allowNull: false },
  prezime:     { type: DataTypes.STRING(40), allowNull: false },
  zaposlenOd:  { type: DataTypes.DATEONLY, allowNull: false },
  placaMjesec: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  email:       { type: DataTypes.STRING(80), unique: true, allowNull: false },
  lozinka:     { type: DataTypes.STRING(100), allowNull: false }
});
DomZdravlja.hasMany(Osoblje, { foreignKey: 'sdzId' });
Osoblje.belongsTo(DomZdravlja, { foreignKey: 'sdzId' });

export const Doktor = sequelize.define('Doktor', {
  doktorId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
});
export const MedicinskaSestra = sequelize.define('MedicinskaSestra', {
  sestraId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
});
Osoblje.hasOne(Doktor, { foreignKey: 'osobljeId' });
Osoblje.hasOne(MedicinskaSestra, { foreignKey: 'osobljeId' });
Doktor.belongsTo(Osoblje, { foreignKey: 'osobljeId' });
MedicinskaSestra.belongsTo(Osoblje, { foreignKey: 'osobljeId' });
