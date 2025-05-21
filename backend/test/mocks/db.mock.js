/**
 * test/mocks/db.mock.js
 * ----------------------------------------------------------
 *  Potpuni stub za modul  src/db.js  – koristi se SAMO u Jest-run-u.
 *  Svaka funkcija vraća lažne (ali konzistentne) podatke tako da
 *  Express routeri dobiju ono što očekuju, a testovi ostanu
 *  potpuno izolirani od prave baze.
 * ----------------------------------------------------------
 */

import bcrypt from 'bcrypt';

/* ───── shared fixture objects ──────────────────────────── */
const fakeDoctor = {
  doktorid: 1,
  ime: 'Ivan',
  prezime: 'Kovač',
  email: 'ivan.kovac@example.com'
};

const fakePatient = {
  pacijentid: 1,
  ime: 'Ana',
  prezime: 'Test',
  email: 'a@t',
  lozinka: await bcrypt.hash('pw', 10)
};

const fakeAppointment = {
  appointmentid: 1,
  datum: '2025-04-20',
  status: 2,                    // 2 = completed
  pacijentid: fakePatient.pacijentid,
  doktorid: fakeDoctor.doktorid
};

const fakeRecord = {
  recordid: 1,
  pacijentid: fakePatient.pacijentid,
  opis: 'Kontrola krvnog tlaka',
  datum: '2025-04-20'
};

const fakeDocument = {
  dokumentid: 1,
  dokumenttip: 'PDF',
  naziv: 'Laboratorijski nalaz',
  kartonid: 1
};

/* ───── APPOINTMENTS ───────────────────────────────────── */
export async function getAppointment(id) {
  return { ...fakeAppointment, appointmentid: id ?? 1 };
}
export async function getAppointmentsByDate(datum) {
  return [{ ...fakeAppointment, datum: datum ?? fakeAppointment.datum }];
}
export async function getAllAppointments() {
  return [fakeAppointment];
}
export async function getAppointments() {
  return [fakeAppointment];                // alias
}
export async function createAppointment(data) {
  return { ...fakeAppointment, ...data, appointmentid: 99 };
}
export async function updateAppointment(id, data) {
  return { ...fakeAppointment, ...data, appointmentid: id };
}
export async function deleteAppointment(id) {
  return true;
}

/* ───── DOCTORS (šifrarnik) ───────────────────────────── */
export async function getDoctor(id) {
  return { ...fakeDoctor, doktorid: id ?? 1 };
}
export async function getAllDoctors() {
  return [fakeDoctor];
}

/* ───── PACIJENT / AUTH ───────────────────────────────── */
export async function getPacijentByEmail(email) {
  return email === fakePatient.email ? fakePatient : null;
}
export async function findUserByEmail(email) {
  return getPacijentByEmail(email);
}
export async function findUserById(id) {
  return id == fakePatient.pacijentid ? fakePatient : null;
}
export async function createUser(data) {
  return {
    pacijentid: 42,
    ...data,
    lozinka: await bcrypt.hash(data.lozinka ?? 'secret', 10)
  };
}
export async function updateUserById(id, data) {
  if (id != fakePatient.pacijentid) return null;
  Object.assign(fakePatient, data);
  return fakePatient;
}
export async function updateUserPassword(id, plainPw) {
  if (id != fakePatient.pacijentid) return null;
  fakePatient.lozinka = await bcrypt.hash(plainPw, 10);
  return true;
}

/* ───── RECORDS / MEDICAL CHARTS ──────────────────────── */
export async function getRecords(pacijentid) {
  return pacijentid == fakePatient.pacijentid ? [fakeRecord] : [];
}
export async function getRecord(id) {
  return { ...fakeRecord, recordid: id ?? 1 };
}
export async function createRecord(data) {
  return { ...fakeRecord, ...data, recordid: 77 };
}
export async function updateRecord(id, data) {
  return { ...fakeRecord, ...data, recordid: id };
}
export async function deleteRecord(id) {
  return true;
}

/* ───── DOKUMENTI ─────────────────────────────────────── */
export async function getDocuments(kartonid) {
  return kartonid === 1 ? [fakeDocument] : [];
}
export async function addDocument(data) {
  return { ...fakeDocument, ...data, dokumentid: 55 };
}

/* ───── ANALYTICS (pregled po doktoru npr.) ───────────── */
export async function getVisitCountByDoctor(doktorid) {
  return [{ doktorid: doktorid ?? 1, count: 42 }];
}
export async function getTopDiagnoses(limit = 5) {
  return [
    { dijagnoza: 'Hipertenzija', count: 12 },
    { dijagnoza: 'Dijabetes', count: 7 }
  ].slice(0, limit);
}

/* ───── ANALYTICS: broj termina ukupno ─────────────────── */
export async function getNumOfAppointments() {
  return 123;          // proizvoljan primjer – ruteru je važan broj
}

/* ───── ANALYTICS: broj pacijenata ukupno ──────────────── */
export async function getNumOfPatients() {
  return 2;                // proizvoljan “dummy” broj
}

export async function getNumOfStatuses() {
  /* možeš vratiti objekt ili niz – ovisi kako ga ruter koristi;
     tipično je objekt u stilu { scheduled: n, completed: n, … }      */
  return {
    scheduled: 4,
    completed: 8,
    canceled: 1,
    'not-arrived': 0
  };
}
export async function getappointmentsPerDay(datum) {
  /* vraćamo niz objekata  [{ datum:'YYYY-MM-DD', count:n }, … ]  */
  return [
    { datum: datum ?? '2025-04-20', count: 3 }
  ];
}