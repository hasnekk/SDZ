import { Router } from 'express';
import bcrypt from 'bcrypt';
import { findUserById, updateUserById, updateUserPassword } from '../db.js';

const router = Router();
const saltRounds = 10;

router.get('/profile', async (req, res) => {
  try {
    const id = req.user.id;

    const user = await findUserById(id);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // eslint-disable-next-line no-unused-vars
    const { lozinka, ...returnUser } = user;

    res.status(201).json(returnUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/profile', async (req, res) => {
  try {
    const id = req.user.id;
    const role = req.user.role;
    const { name, email } = req.body;

    const updatedUser = await updateUserById(id, role, { name, email });

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/profile/password', async (req, res) => {
  try {
    const id = req.user.id;
    const role = req.user.role;
    const { currentPassword, password } = req.body;

    const user = await findUserById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(currentPassword, user.lozinka);
    if (!match) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(password, saltRounds);

    await updateUserPassword(id, role, hashed);

    res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
