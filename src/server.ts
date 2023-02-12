import express, { Express } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/authRouter';
import { errorMiddleware } from './middlewares/errorMiddleware';
import config from './config/config';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors())
app.use('/auth', authRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL || config.dbLink);

    app.listen(PORT, () => console.log(`⚡️[server]: Server started on port ${PORT}`));
  } catch (e) {
    console.log(e)
  }
};

start();
