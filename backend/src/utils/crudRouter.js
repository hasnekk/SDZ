// src/utils/crudRouter.js
import express from 'express';

export const crudRouter = (Model) => {
  const r = express.Router();

  r.get('/', async (_,res)=> res.json(await Model.findAll()));
  r.get('/:id', async (req,res)=> res.json(await Model.findByPk(req.params.id)));
  r.post('/', async (req,res)=> res.json(await Model.create(req.body)));
  r.put('/:id', async (req,res)=> {
    const obj = await Model.findByPk(req.params.id);
    res.json(await obj.update(req.body));
  });
  r.delete('/:id', async (req,res)=> {
    const rows = await Model.destroy({ where:{ id:req.params.id }});
    res.status(rows?204:404).end();
  });
  return r;
};
