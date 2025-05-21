import request from 'supertest';
import express from 'express';
import { DataTypes } from 'sequelize';
import { makeTestSequelize } from '../../helpers/newTestDB.js';
import terminiRouter from '../../../src/routes/appointments.router.js';

let app, stop, Termin;
beforeAll(async () => {
  const db = await makeTestSequelize();
  stop = db.stop;

  /* lokalna kopija modela — samo polja koja trebaju testu */
  Termin = db.sequelize.define('Termin', {
    terminid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    datum:    DataTypes.STRING,
    status:   DataTypes.INTEGER
  },{ tableName:'Termin' });

  await db.sequelize.sync({ force:true });
  await Termin.create({ datum:'2025-04-20', status:2 });

  app = express().use(express.json()).use('/api/termini', terminiRouter);
});
afterAll(()=> stop());

test('GET /api/termini/obavljeni vraća 1 zapis', async () => {
  const r = await request(app).get('/api/termini/obavljeni?datum=20250420');
  expect(r.status).toBe(200);
  expect(r.body).toHaveProperty('appointment');
  expect(r.body.appointment.status).toBe(2);
});
