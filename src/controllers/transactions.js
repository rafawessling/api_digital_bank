import { searchData, writeData } from './data.js';
import { formatDate } from '../helpers/formatDate.js';
import { requiredFields } from '../helpers/validation.js';

const registerDeposit = async (req, res) => {
    const { accountNumber, amount } = req.body;

    const fields = ['accountNumber', 'amount'];

    const { status, message } = requiredFields(req.body, fields);

    if (status === 'error') {
        return res.status(400).json({ message });
    }

    if (isNaN(Number(accountNumber))) {
        return res.status(400).json({ message: 'The account number has to be a valid number.' });
    }

    if (isNaN(Number(amount))) {
        return res.status(400).json({ message: 'The amount has to be a valid number.' });
    }

    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount entered cannot be less than zero.' });
    }

    try {
        const data = await searchData();

        const account = data.accounts.find(account => account.number === accountNumber);

        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        account.balance += amount;

        data.deposits.push({
            accountNumber,
            amount,
            date: formatDate(new Date()),
        });

        await writeData(data);

        res.status(200).json({ message: 'Deposit completed successfully.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const registerWithdrawal = async (req, res) => {
    const { accountNumber, amount, password } = req.body;

    const fields = ['accountNumber', 'amount', 'password'];

    const { status, message } = requiredFields(req.body, fields);

    if (status === 'error') {
        return res.status(400).json({ message });
    }

    if (isNaN(Number(accountNumber))) {
        return res.status(400).json({ message: 'The account number has to be a valid number.' });
    }

    if (isNaN(Number(amount))) {
        return res.status(400).json({ message: 'The amount has to be a valid number.' });
    }

    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount entered cannot be less than zero.' });
    }

    try {
        const data = await searchData();

        const account = data.accounts.find(account => account.number === accountNumber);

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.user.password !== password) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        if (account.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance for withdrawal.' });
        }

        account.balance -= amount;

        data.withdrawals.push({
            accountNumber,
            amount,
            date: formatDate(new Date()),
        });

        await writeData(data);

        res.status(200).json({ message: 'Withdrawal completed successfully.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const registerTransfer = async (req, res) => {
    const { senderAccountNumber, recipientAccountNumber, amount, password } = req.body;

    const fields = ['senderAccountNumber', 'recipientAccountNumber', 'amount', 'password'];

    const { status, message } = requiredFields(req.body, fields);

    if (status === 'error') {
        return res.status(400).json({ message });
    }

    if (isNaN(Number(senderAccountNumber)) || isNaN(Number(recipientAccountNumber))) {
        return res.status(400).json({ message: 'The account numbers have to be valid numbers.' });
    }

    if (isNaN(Number(amount))) {
        return res.status(400).json({ message: 'The amount has to be a valid number.' });
    }

    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount entered cannot be less than zero.' });
    }

    try {
        const data = await searchData();

        const senderAccount = data.accounts.find(account => account.number === senderAccountNumber);

        if (!senderAccount) {
            return res.status(404).json({ message: 'Sender account not found.' });
        }

        const recipientAccount = data.accounts.find(acc => acc.number === recipientAccountNumber);

        if (!recipientAccount) {
            return res.status(404).json({ message: 'Recipient account not found.' });
        }

        if (senderAccount.user.password !== password) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        if (senderAccount.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance for transfer.' });
        }

        senderAccount.balance -= amount;
        recipientAccount.balance += amount;

        data.transfers.push({
            senderAccountNumber,
            recipientAccountNumber,
            amount,
            date: formatDate(new Date()),
        });

        await writeData(data);

        res.status(200).json({ message: 'Transfer completed successfully.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { registerDeposit, registerTransfer, registerWithdrawal };
