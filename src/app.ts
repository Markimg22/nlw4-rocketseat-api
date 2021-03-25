import 'reflect-metadata';
import createConnection from './database';
import { router } from './routes';
import express from 'express';

createConnection();

const app = express();

app.use(express.json());
app.use(router);

export { app };
