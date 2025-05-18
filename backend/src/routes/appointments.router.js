import { Router } from 'express';
import {
  getAppointments,
  deleteAppointment,
  getAppointment,
  getAllDoctors,
  updateAppointment,
  createAppointment,
} from '../db.js';

const router = Router();

router.get('/all', async (req, res) => {
  try {
    const id = req.user.id;
    const role = req.user.role;

    const limit = parseInt(req.query.limit) || 10;

    const appointments = await getAppointments(id, role, limit);

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
});

router.delete('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    await deleteAppointment(appointmentId);

    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
});

router.get('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await getAppointment(appointmentId);
    const doctors = await getAllDoctors();

    res.status(200).json({ doctors, appointment });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
});

router.get('/doctors/all', async (req, res) => {
  try {
    const doctors = await getAllDoctors();

    res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
});

router.patch('/:appointmentId', async (req, res) => {
  try {
    const { appointment } = req.body;

    await updateAppointment(appointment);

    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
});

router.post('/', async (req, res) => {
  try {
    const id = req.user.id;
    const appointment = req.body;

    await createAppointment(id, appointment);

    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
});

export default router;
