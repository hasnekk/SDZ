import express from 'express';
import bcrypt from 'bcrypt';
import { Pacijent } from '../models/Pacijent.js';
import { Doktor } from '../models/Doktor.js';
const r = express.Router();

r.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const pac = await Pacijent.findOne({ where: { email }});
  if (pac && await bcrypt.compare(password, pac.lozinka)) {
    res.cookie('SDZ_USER', `${pac.pacijentId}|PACIJENT`, { httpOnly: true, maxAge: 86400000 });
    return res.json({ id: pac.pacijentId, role: 'PACIJENT' });
  }

  const dok = await Doktor.findOne({ where: { email }});
  if (dok && await bcrypt.compare(password, dok.lozinka)) {
    res.cookie('SDZ_USER', `${dok.doktorId}|DOKTOR`, { httpOnly: true, maxAge: 86400000 });
    return res.json({ id: dok.doktorId, role: 'DOKTOR' });
  }

  res.status(401).json({ message: 'Bad credentials' });
});

r.post('/logout', (req,res)=>{
  res.clearCookie('SDZ_USER').sendStatus(204);
});

r.get('/whoami', (req,res)=>{
  const c = req.cookies['SDZ_USER'];
  if(!c) return res.json({id:null,role:'ANON'});
  const [id,role] = c.split('|');
  res.json({ id:Number(id), role });
});

export default r;
