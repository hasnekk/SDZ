// backend/src/models/Osoblje.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { DomZdravlja } from './DomZdravlja.js';

export const Osoblje = sequelize.define('Osoblje', {
  osobljeid:   { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ime:         { type: DataTypes.STRING,  allowNull: false },
  prezime:     { type: DataTypes.STRING,  allowNull: false },
  zaposlen_od: { type: DataTypes.DATEONLY,allowNull: false },
  placa_mjesec:{ type: DataTypes.DECIMAL(10,2), allowNull: false },
  email:       { type: DataTypes.STRING,  unique: true, allowNull: false },
  lozinka:     { type: DataTypes.STRING,  allowNull: false }
},{
  tableName: 'osoblje',
  timestamps: false
});

DomZdravlja.hasMany(Osoblje, { foreignKey: 'sdzid' });
Osoblje.belongsTo(DomZdravlja, { foreignKey: 'sdzid' });


export const Doktor = sequelize.define('Doktor', {
  doktorid:   { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
},{
  tableName: 'doktor',
  timestamps: false
});

export const MedicinskaSestra = sequelize.define('Medicinska_sestra', {
  sestraid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
},{
  tableName: 'medicinska_sestra',
  timestamps: false
});

Osoblje.hasOne(Doktor,           { foreignKey: 'osobljeid' });
Osoblje.hasOne(MedicinskaSestra, { foreignKey: 'osobljeid' });
Doktor.belongsTo(Osoblje,           { foreignKey: 'osobljeid' });
MedicinskaSestra.belongsTo(Osoblje, { foreignKey: 'osobljeid' });
