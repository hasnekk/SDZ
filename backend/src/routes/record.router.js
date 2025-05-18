import { Router } from 'express';
import { getRecords, findUserById } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const id = req.user.id;

    const limit = parseInt(req.query.limit) || 10;

    const records = await getRecords(id, limit);
    const user = await findUserById(id);

    res.status(200).json({ records, name: user.name });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
});

export default router;
