import { DataTypes } from 'sequelize';
import { makeTestSequelize } from '../../helpers/newTestDB.js';

let Termin, stop;
beforeAll(async ()=>{
  const db = await makeTestSequelize();
  stop = db.stop;
  Termin = db.sequelize.define('Termin',{
    terminid:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
    datum:DataTypes.STRING,status:DataTypes.INTEGER
  },{tableName:'Termin'});
  await db.sequelize.sync({force:true});
});
afterAll(()=>stop());

test('create + findAll', async ()=>{
  await Termin.create({ datum:'2025-05-20', status:2 });
  const list = await Termin.findAll();
  expect(list).toHaveLength(1);
});
