import { Router } from 'express';
import {
  getNumOfPatients,
  getNumOfAppointments,
  getappointmentsPerDay,
  getNumOfStatuses,
} from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const numOfPatients = await getNumOfPatients();
    const numOfAppointments = await getNumOfAppointments();
    const appointmentsPerDay = await getappointmentsPerDay();
    const numOfStatuses = await getNumOfStatuses();

    res.status(200).json({ numOfPatients, numOfAppointments, appointmentsPerDay, numOfStatuses });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error ' });
  }
});

export default router;
