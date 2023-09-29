import { searchData, writeData } from './data.js';
import {
    isCpfRegistered,
    validateCpf,
    isEmailRegistered,
    validateEmail,
    requiredFields,
    validatePhoneNumber,
    validateBirth,
} from '../helpers/validation.js';
import { updateUserFields } from '../helpers/updateUserFields.js';

const getAccounts = async (req, res) => {
    try {
        const data = await searchData();

        return res.status(200).json(data.accounts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const registerAccount = async (req, res) => {
    const { cpf, birth, email, phoneNumber } = req.body;

    const fields = ['name', 'cpf', 'birth', 'phoneNumber', 'email', 'password'];

    const { status, message } = requiredFields(req.body, fields);

    if (status === 'error') {
        return res.status(400).json({ message });
    }

    try {
        const data = await searchData();

        if (await isCpfRegistered(data, cpf))
            return res.status(400).json({ message: 'This CPF number is already registered.' });

        if (!validateCpf(cpf))
            return res.status(400).json({ message: 'The CPF number must contain 11 numeric digits.' });

        if (!validateBirth(birth))
            return res
                .status(400)
                .json({ message: 'The birth must contain 8 numeric digits (yyyy-mm-dd) and be of legal age.' });

        if (await isEmailRegistered(data, email))
            return res.status(400).json({ message: 'This email address is already registered.' });

        if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email.' });

        if (!validatePhoneNumber(phoneNumber))
            return res.status(400).json({ message: 'The phone number must contain 10 or 11 numeric digits.' });

        const account = {
            number: (data.accounts.length + 1).toString(),
            balance: 0,
            user: {
                ...req.body,
            },
        };

        data.accounts.push(account);

        await writeData(data);

        return res.status(201).json(account);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateAccount = async (req, res) => {
    const { accountNumber } = req.params;

    if (isNaN(Number(accountNumber))) {
        return res.status(400).json({ message: 'The account number has to be a valid number.' });
    }

    const { name, cpf, birth, phoneNumber, email, password } = req.body;

    if (!name && !cpf && !birth && !phoneNumber && !email && !password) {
        return res.status(400).json({ message: 'To update the user, you must enter at least one field.' });
    }

    try {
        const data = await searchData();

        const accountToUpdate = data.accounts.find(account => account.number === accountNumber);

        if (!accountToUpdate) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        if (cpf) {
            if (await isCpfRegistered(data, cpf))
                return res.status(400).json({ message: 'This CPF number is already registered.' });

            if (!validateCpf(cpf))
                return res.status(400).json({ message: 'The CPF number must contain 11 numeric digits.' });
        }

        if (birth) {
            if (!validateBirth(birth))
                return res
                    .status(400)
                    .json({ message: 'The birth must contain 8 numeric digits (yyyy-mm-dd) and be of legal age.' });
        }

        if (email) {
            if (await isEmailRegistered(data, email)) {
                return res.status(400).json({ message: 'This email address is already registered.' });
            }

            if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email.' });
        }

        if (phoneNumber) {
            if (!validatePhoneNumber(phoneNumber))
                return res.status(400).json({ message: 'The phone number must contain 10 or 11 numeric digits.' });
        }

        const indexAccount = data.accounts.findIndex(account => account.number === accountNumber);

        data.accounts[indexAccount].user = updateUserFields(req.body, accountToUpdate.user);

        await writeData(data);

        return res.status(200).json({ message: 'The account has been updated.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteAccount = async (req, res) => {
    const { accountNumber } = req.params;

    if (!accountNumber) return res.status(400).json({ message: 'accountNumber is required.' });

    if (isNaN(Number(accountNumber))) {
        return res.status(400).json({ message: 'The account number has to be a valid number.' });
    }

    try {
        const data = await searchData();

        const account = data.accounts.find(account => account.number === accountNumber);

        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        const indexAccount = data.accounts.findIndex(account => account.number === accountNumber);

        if (data.accounts[indexAccount].balance !== 0) {
            return res
                .status(400)
                .json({ message: 'It is not possible to delete an account with a balance other than R$ 0,00.' });
        }

        data.accounts.splice(indexAccount, 1);

        await writeData(data);

        return res.status(200).json({ message: 'The account has been deleted.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getBalance = async (req, res) => {
    const { accountNumber, password } = req.query;

    const fields = ['accountNumber', 'password'];

    const { status, message } = requiredFields(req.query, fields);

    if (status === 'error') {
        return res.status(400).json({ message });
    }

    if (isNaN(Number(accountNumber))) {
        return res.status(400).json({ message: 'The account number has to be a valid number.' });
    }

    try {
        const data = await searchData();

        const account = data.accounts.find(account => account.number === accountNumber);

        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        res.status(200).json({ balance: account.balance });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getReceipt = async (req, res) => {
    const { accountNumber, password } = req.query;

    const fields = ['accountNumber', 'password'];

    const { status, message } = requiredFields(req.query, fields);

    if (status === 'error') {
        return res.status(400).json({ message });
    }

    if (isNaN(Number(accountNumber))) {
        return res.status(400).json({ message: 'The account number has to be a valid number.' });
    }

    try {
        const data = await searchData();

        const account = data.accounts.find(account => account.number === accountNumber);

        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        const receiptWithdrawals = data.withdrawals.filter(withdral => withdral.accountNumber === accountNumber);
        const receiptDeposits = data.deposits.filter(deposit => deposit.accountNumber === accountNumber);
        const receiptTransferSender = data.transfers.filter(transfer => transfer.senderAccountNumber === accountNumber);
        const receiptTransferRecipient = data.transfers.filter(
            transfer => transfer.recipientAccountNumber === accountNumber
        );

        const receipt = {
            withdrawals: receiptWithdrawals,
            deposits: receiptDeposits,
            transfersSent: receiptTransferSender,
            transfersReceived: receiptTransferRecipient,
        };

        res.status(200).json(receipt);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { deleteAccount, getAccounts, getBalance, getReceipt, registerAccount, updateAccount };
