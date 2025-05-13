import express from 'express';
import { preglediByTermin } from '../controllers/pregledi.js';
const r = express.Router();

r.get('/termin/:terminId', preglediByTermin);
export default r;
