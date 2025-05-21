import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter, { authenticate, isStaff } from './src/routes/auth.router.js';
import profileRouter     from './src/routes/profile.router.js';
import appointmentRouter from './src/routes/appointments.router.js';
import recordRouter      from './src/routes/record.router.js';
import analyticsRouter   from './src/routes/analytics.router.js';

const app = express();
const port = process.env.PORT || 3000;

/* ---------- global middleware ---------- */
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

/* ---------- public rute (auth) ---------- */
app.use('/auth', authRouter);

/* ---------- privatne rute ---------- */
app.use(authenticate);                 // provjeri cookie / token
app.use('/user',        profileRouter);
app.use('/appointment', appointmentRouter);
app.use('/record',      recordRouter);
app.use('/analytics',   isStaff, analyticsRouter);

/* ---------- export za testove ---------- */
export default app;
export const buildApp = async () => {
   return { app };
 };

/* ---------- pokreni server ako NIJE test ---------- */
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
