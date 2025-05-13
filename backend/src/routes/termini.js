import express from 'express';
import { Termin } from '../models/Termin.js';
import { getObavljeni } from '../controllers/termini.js';
const r = express.Router();

r.get('/', async (_, res) => res.json(await Termin.findAll()));
r.post('/', async (req, res) => res.json(await Termin.create(req.body)));
r.get('/obavljeni', getObavljeni);

export default r;
