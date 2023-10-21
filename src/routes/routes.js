import express from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json' assert { type: 'json' };

import {
    getAccounts,
    registerAccount,
    updateAccount,
    deleteAccount,
    getBalance,
    getReceipt,
} from '../controllers/accounts.js';

import { registerDeposit, registerWithdrawal, registerTransfer } from '../controllers/transactions.js';
import { validatePassword } from '../middlewares/middlewares.js';

const routes = express();

routes.get('/accounts', validatePassword, getAccounts);
routes.post('/accounts', registerAccount);
routes.put('/accounts/:accountNumber/user', updateAccount);
routes.delete('/accounts/:accountNumber', deleteAccount);
routes.post('/transactions/deposit', registerDeposit);
routes.post('/transactions/withdrawal', registerWithdrawal);
routes.post('/transactions/transfer', registerTransfer);
routes.get('/accounts/balance', getBalance);
routes.get('/accounts/receipt', getReceipt);
routes.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export default routes;
