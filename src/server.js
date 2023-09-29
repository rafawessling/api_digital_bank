import express, { json } from 'express';
import routes from './routes/routes.js';
import cors from 'cors';

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3333',
    })
);

app.use(json());

app.use(routes);

export default app;
