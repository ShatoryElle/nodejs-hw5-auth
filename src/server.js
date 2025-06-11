import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

import cookieParser from 'cookie-parser';

import { initMongoConnection } from './db/initMongoConnection.js';

const PORT = process.env.PORT || 3000;

export const setupServer = async () => {
  await initMongoConnection();

  const app = express();

  app.use(express.json());
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    }),
  );

  app.use('/auth', authRouter);

  app.use('/contacts', contactsRouter);

  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
  });

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};
