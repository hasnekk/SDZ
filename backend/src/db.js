import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

async function findUserByEmail(email) {
  const query = {
    text: `
      SELECT 
        osobljeId AS id,
        lozinka,
        'osoblje' AS role
      FROM osoblje 
      WHERE email = $1

      UNION

      SELECT 
        pacijentId AS id,
        lozinka,
        'pacijent' AS role
      FROM pacijent 
      WHERE email = $1

      LIMIT 1;
    `,
    values: [email],
  };

  const response = await pool.query(query);
  return response.rows[0] || null;
}

async function findUserById(id, role) {
  if (!['pacijent', 'osoblje'].includes(role)) {
    throw new Error('Invalid role');
  }

  const table = role === 'pacijent' ? 'pacijent' : 'osoblje';
  const idColumn = role === 'pacijent' ? 'pacijentId' : 'osobljeId';

  const query = {
    text: `
      SELECT 
        ime AS name,
        prezime AS surname,
        lozinka,
        email,
        $2 AS role
      FROM ${table}
      WHERE ${idColumn} = $1
      LIMIT 1;
    `,
    values: [id, role],
  };

  const response = await pool.query(query);
  return response.rows[0] || null;
}

async function createUser(user) {
  const query = {
    text: `
      INSERT INTO pacijent (ime, prezime, email, lozinka)
      VALUES ($1, $2, $3, $4)
      RETURNING pacijentId AS id, email
    `,
    values: [user.ime, user.prezime, user.email, user.lozinka],
  };

  const result = await pool.query(query);
  const newUser = result.rows[0];

  return {
    id: newUser.id,
    role: 'pacijent',
  };
}

async function updateUserById(id, role, { name, email }) {
  if (!['pacijent', 'osoblje'].includes(role)) {
    throw new Error('Invalid role');
  }

  const table = role === 'pacijent' ? 'pacijent' : 'osoblje';
  const idColumn = role === 'pacijent' ? 'pacijentId' : 'osobljeId';

  const query = {
    text: `
      UPDATE ${table}
      SET ime = COALESCE($1, ime),
          email = COALESCE($2, email)
      WHERE ${idColumn} = $3
      RETURNING ime AS name, email
    `,
    values: [name || null, email || null, id],
  };

  const result = await pool.query(query);
  return result.rows[0] || null;
}

async function updateUserPassword(id, role, password) {
  if (!['pacijent', 'osoblje'].includes(role)) {
    throw new Error('Invalid role');
  }

  const table = role === 'pacijent' ? 'pacijent' : 'osoblje';
  const idColumn = role === 'pacijent' ? 'pacijentId' : 'osobljeId';

  const query = {
    text: `
      UPDATE ${table}
      SET lozinka = $1
      WHERE ${idColumn} = $2
      RETURNING ime AS name, email
    `,
    values: [password, id],
  };

  const result = await pool.query(query);
  return result.rows[0] || null;
}

async function getAppointments(id, role, limit) {
  if (role === 'pacijent') return await getPatientAppointments(id, limit);
  else return await getStaffAppointments(id, limit);
}

async function getPatientAppointments(id, limit) {
  const query = {
    text: `
      SELECT opis, datum, status, prezime, terminId as id
      FROM 
        pregled 
        NATURAL JOIN termin
        NATURAL JOIN pristuno_osoblje 
        NATURAL JOIN osoblje
      WHERE 
        pregled.pacijentId = $1
        AND status = 'scheduled'
      ORDER BY datum ASC
      LIMIT $2
    `,
    values: [id, limit],
  };

  const response = await pool.query(query);

  return response.rows;
}

async function getStaffAppointments(id, limit) {
  const query = {
    text: `
      SELECT opis, datum, status, pacijent.ime, pacijent.prezime, terminId as id
      FROM 
        pregled 
        NATURAL JOIN termin
        NATURAL JOIN pristuno_osoblje 
        NATURAL JOIN osoblje
      	INNER JOIN pacijent ON pacijent.pacijentId = pregled.pacijentId
      WHERE 
        pristuno_osoblje.osobljeId = $1
        AND status = 'scheduled'
      ORDER BY datum ASC
      LIMIT $2
    `,
    values: [id, limit],
  };

  const response = await pool.query(query);

  return response.rows;
}

async function deleteAppointment(appointmentId) {
  await pool.query(`DELETE FROM pristuno_osoblje WHERE terminId = $1`, [appointmentId]);
  await pool.query(`DELETE FROM pregled WHERE terminId = $1`, [appointmentId]);
  await pool.query(`DELETE FROM termin WHERE terminId = $1`, [appointmentId]);
}

async function getAppointment(appointmentId) {
  const query = {
    text: `
      SELECT opis, datum, osobljeId as doctor, terminId as id
      FROM 
        pregled 
        NATURAL JOIN termin
        NATURAL JOIN pristuno_osoblje 
        NATURAL JOIN osoblje
      WHERE 
        terminId = $1
      ORDER BY datum ASC
    `,
    values: [appointmentId],
  };

  const response = await pool.query(query);
  return response.rows[0];
}

async function getAllDoctors() {
  const query = {
    text: `
      SELECT doktorId as id, prezime
      FROM 
        doktor
        NATURAL JOIN osoblje
    `,
  };

  const response = await pool.query(query);
  return response.rows;
}

async function updateAppointment(appointment) {
  const { datum, doctor, id, opis } = appointment;

  const updateTermin = {
    text: `
      UPDATE termin
      SET datum = $1
      WHERE terminId = $2
    `,
    values: [datum, id],
  };

  const updatePregled = {
    text: `
      UPDATE pregled
      SET opis = $1
      WHERE terminId = $2
    `,
    values: [opis, id],
  };

  const updateDoktor = {
    text: `
      UPDATE pristuno_osoblje
      SET osobljeId = $1
      WHERE terminId = $2
    `,
    values: [doctor, id],
  };

  await pool.query(updateTermin);
  await pool.query(updatePregled);
  await pool.query(updateDoktor);
}

async function createAppointment(pacijentId, appointment) {
  const { date, desc, doctor, status = 'scheduled' } = appointment;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insert into termin
    const insertTerminQuery = {
      text: `INSERT INTO termin (datum, status) VALUES ($1, $2) RETURNING terminId`,
      values: [date, status],
    };
    const terminResult = await client.query(insertTerminQuery);
    const terminId = terminResult.rows[0].terminid;

    // 2. Insert into pregled
    const insertPregledQuery = {
      text: `INSERT INTO pregled (opis, pacijentId, terminId) VALUES ($1, $2, $3)`,
      values: [desc, pacijentId, terminId],
    };
    await client.query(insertPregledQuery);

    // 3. Insert into pristuno_osoblje
    const insertDoktorQuery = {
      text: `INSERT INTO pristuno_osoblje (pacijentId, terminId, osobljeId) VALUES ($1, $2, $3)`,
      values: [pacijentId, terminId, doctor],
    };
    await client.query(insertDoktorQuery);

    await client.query('COMMIT');
    return { success: true, terminId };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating appointment:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function getRecords(id, limit) {
  const query = {
    text: `
      SELECT  osoblje.prezime, datum, opis
      FROM 
        termin 
        NATURAL JOIN pregled
        NATURAL JOIN doktor
        NATURAL JOIN osoblje 
      WHERE status = 'completed' AND pacijentId = $1
      ORDER BY datum DESC
      LIMIT $2
    `,
    values: [id, limit],
  };

  const response = await pool.query(query);
  return response.rows;
}

async function getNumOfPatients() {
  const query = {
    text: `
      SELECT COUNT(*)
      FROM 
        pacijent
    `,
  };

  const response = await pool.query(query);
  return response.rows?.[0].count;
}

async function getNumOfAppointments() {
  const query = {
    text: `
      SELECT COUNT(*)
      FROM 
        termin
    `,
  };

  const response = await pool.query(query);
  return response.rows?.[0].count;
}

async function getNumOfStatuses() {
  const { rows } = await pool.query(`
  SELECT status, COUNT(*) AS count
  FROM Termin
  GROUP BY status;
`);

  const statusOrder = ['completed', 'canceled', 'not-arrived', 'scheduled'];
  const statusCounts = {
    completed: 0,
    canceled: 0,
    'not-arrived': 0,
    scheduled: 0,
  };

  // Fill in counts from the DB
  rows.forEach((row) => {
    const status = row.status;
    // eslint-disable-next-line no-prototype-builtins
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status] = parseInt(row.count, 10);
    }
  });

  return statusOrder.map((status) => statusCounts[status]);
}

async function getappointmentsPerDay() {
  const { rows } = await pool.query(`
  SELECT 
    TO_CHAR(datum, 'Dy') AS day,
    COUNT(*) AS count
  FROM Termin
  WHERE status = 'scheduled'
  GROUP BY TO_CHAR(datum, 'Dy'), EXTRACT(DOW FROM datum)
  ORDER BY EXTRACT(DOW FROM datum);
`);

  const dayMap = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };

  const appointmentsPerDay = new Array(5).fill(0); // Only Mon–Fri

  for (const row of rows) {
    const index = dayMap[row.day.trim()];
    if (index < 5) {
      appointmentsPerDay[index] = parseInt(row.count, 10);
    }
  }

  return appointmentsPerDay;
}

export {
  findUserById,
  findUserByEmail,
  createUser,
  updateUserById,
  updateUserPassword,
  getAppointments,
  deleteAppointment,
  getAppointment,
  getAllDoctors,
  updateAppointment,
  createAppointment,
  getRecords,
  getNumOfPatients,
  getNumOfAppointments,
  getappointmentsPerDay,
  getNumOfStatuses,
};
