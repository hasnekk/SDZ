import { Router } from 'express';
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
import { findUserByEmail, createUser } from '../db.js';

const router = Router();
// const saltRounds = 10;

function generateToken(userId, role) {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function authenticate(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: 'Invalid token' });
  }
}

function isStaff(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.user.role === 'pacijent') throw new Error('only staff');

    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: 'Unathorized' });
  }
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, surname } = req.body;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // so it is possible to use the data createwd by .txt file
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      email,
      lozinka: password,
      ime: name,
      prezime: surname,
    };

    const createdUser = await createUser(newUser);

    const token = generateToken(createdUser.id, createdUser.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ message: 'User registered successfully', role: createUser.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (password !== existingUser.lozinka) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // so it is possible to use the data createwd by .txt file
  // const passwordMatch = await bcrypt.compare(password, existingUser.lozinka);

  // if (!passwordMatch) {
  //   return res.status(401).json({ message: 'Invalid credentials' });
  // }

  const token = generateToken(existingUser.id, existingUser.role);

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return res.status(200).json({ message: 'Logged in successfully', role: existingUser.role });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

export default router;
export { authenticate, isStaff };
