import { Pregled } from '../models/Pregled.js';

export const preglediByTermin = async (req, res) => {
  const { terminId } = req.params;
  const list = await Pregled.findAll({ where: { terminId }});
  res.json(list);
};
