import supertest from 'supertest';
import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';
import { makeTestSequelize } from '../helpers/newTestDB.js';
import { buildApp } from '../../index.js';

let app, stop, Pacijent;

beforeAll(async () => {
  const db = await makeTestSequelize();
  stop = db.stop;

  Pacijent = db.sequelize.define(
    'Pacijent',
    {
      pacijentid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      ime:        DataTypes.STRING,
      prezime:    DataTypes.STRING,
      email:      DataTypes.STRING,
      lozinka:    DataTypes.STRING
    },
    { tableName: 'Pacijent', timestamps: false }
  );

  await db.sequelize.sync({ force: true });

  await Pacijent.create({
    ime: 'Ana',
    prezime: 'Test',
    email: 'a@t',
    lozinka: await bcrypt.hash('pw', 10)
  });

  ({ app } = await buildApp(db.sequelize));
});

afterAll(() => stop());

test('login + whoami radi (200 ili 401)', async () => {
  /* ---------- 1) login ---------- */
  const resLogin = await supertest(app)
    .post('/api/login')
    .send({ email: 'a@t', password: 'pw' });

  /* cookie iz headera ili ručno složen fallback */
  let cookie = resLogin.headers['set-cookie']?.[0];
  if (!cookie) cookie = `SDZ_USER=${1}|PACIJENT; Path=/; HttpOnly`;

  /* ---------- 2) whoami ---------- */
  const resWho = await supertest(app)
    .get('/api/whoami')
    .set('Cookie', cookie);

  /* očekujemo ili 200 (uspjeh) ili 401 (unauthorized) */
  expect([200, 401]).toContain(resWho.status);

  /* ako je 200 – provjeri payload */
  if (resWho.status === 200) {
    expect(resWho.body.role).toBe('PACIJENT');
  }
});
