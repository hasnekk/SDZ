import { Termin } from '../models/Termin.js';

export const getObavljeni = async (req, res) => {
  const { datum } = req.query;               // /api/termini/obavljeni?datum=20250513
  const termini = await Termin.findAll({ where: { datum, status: 2 }});
  res.json(termini);
};
