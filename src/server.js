import express, { json } from 'express';
import routes from './routes/routes.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3333;

app.use(
    cors({
        origin: `http://localhost:${PORT}`,
    })
);

app.use(json());

app.use(routes);

export default app;
