// backend/src/routes/login.js
import { Pacijent }          from '../models/Pacijent.js';
import { Doktor, Osoblje }   from '../models/Osoblje.js';
import bcrypt from 'bcrypt';
import express from 'express';
const r = express.Router();

/* ----------- LOGIN ---------------- */
r.post('/login', async (req,res)=>{
  const { email, password } = req.body;

  /* 1) pacijent */
  const pac = await Pacijent.findOne({ where:{ email }});
  if (pac && await bcrypt.compare(password, pac.lozinka)) {
    res.cookie('SDZ_USER',`${pac.pacijentid}|PACIJENT`,{httpOnly:true,maxAge:86400000});
    return res.json({id:pac.pacijentid,role:'PACIJENT'});
  }

  /* 2) osoblje → doktor ili sestra */
  const osoblje = await Osoblje.findOne({ where:{ email }, include:[Doktor] });
  if (osoblje && await bcrypt.compare(password, osoblje.lozinka)) {
    /* provjeri je li doktor ili sestra */
    const role = osoblje.Doktor ? 'DOKTOR' : 'SESTRA';
    const id   = role==='DOKTOR' ? osoblje.Doktor.doktorid : osoblje.osobljeid;
    res.cookie('SDZ_USER',`${id}|${role}`,{httpOnly:true,maxAge:86400000});
    return res.json({ id, role });
  }

  res.status(401).json({message:'Bad credentials'});
});
