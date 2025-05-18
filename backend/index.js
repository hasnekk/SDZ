import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter, { authenticate } from './src/routes/auth.router.js';
import profileRouter from './src/routes/profile.router.js';
import appointmentRouter from './src/routes/appointments.router.js';
import recordRouter from './src/routes/record.router.js';

const app = express();
const port = 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/auth', authRouter);

app.use(authenticate);
app.use('/user', profileRouter);
app.use('/appointment', appointmentRouter);
app.use('/record', recordRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
