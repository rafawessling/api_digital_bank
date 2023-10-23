import express, { json } from 'express';
import routes from './routes/routes.js';
import cors from 'cors';

const app = express();

app.use(
    cors({
        origin: 'https://cubos-bank.cyclic.app/docs/',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    })
);

app.use(json());

app.use(routes);

export default app;
