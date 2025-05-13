import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB, sequelize } from './config/db.js';
import terminiRouter  from './routes/termini.js';
import preglediRouter from './routes/pregledi.js';
import loginRouter    from './routes/login.js';
import './models/index.js';
await sequelize.sync({ alter:true });


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/termini', terminiRouter);
app.use('/api/pregledi', preglediRouter);
app.use('/api', loginRouter);          // login, logout, whoami

const PORT = process.env.PORT || 3000;
await connectDB();
await sequelize.sync({ alter:true });  // kreira / alterira tablice

app.listen(PORT, ()=> console.log(`✔ Express on ${PORT}`));
