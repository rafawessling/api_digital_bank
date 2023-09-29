const requiredFields = (props, fields) => {
    for (const item of fields) {
        if (
            !props[item] ||
            (typeof props[item] === 'string' && props[item].trim() === '') ||
            (typeof props[item] === 'number' && props[item] === 0)
        ) {
            return { status: 'error', message: `${item} is required.` };
        }
    }
    return { status: 'ok', message: null };
};

const isCpfRegistered = async (data, cpf) => {
    const cpfExists = data.accounts.some(account => account.user.cpf === cpf);

    if (cpfExists) return true;

    return false;
};

const validateCpf = cpf => {
    const validCpf = cpf.replace(/\D/g, '');

    if (validCpf.length !== 11) {
        return false;
    }

    return true;
};

const isEmailRegistered = async (data, email) => {
    const emailExists = data.accounts.some(account => account.user.email === email);

    if (emailExists) return true;

    return false;
};

const validateEmail = email => {
    const regex = /\S+@\S+\.\S+/;

    return regex.test(email);
};

const validatePhoneNumber = phoneNumber => {
    const validPhoneNumber = phoneNumber.replace(/\D/g, '');

    if (!(validPhoneNumber.length >= 10 && validPhoneNumber.length <= 11)) return false;

    if (validPhoneNumber.length == 11 && parseInt(validPhoneNumber[2]) != 9) return false;

    return true;
};

const validateBirth = birth => {
    const validBirth = birth.replace(/\D/g, '');

    if (validBirth.length !== 8) return false;

    const currYear = new Date().getFullYear();

    const year = validBirth.slice(0, 4);
    const month = validBirth.slice(4, 6);
    const day = validBirth.slice(6);

    if (Number(year) > currYear - 18 || Number(month) > 12 || Number(day) > 31) return false;

    return true;
};

export {
    requiredFields,
    isCpfRegistered,
    validateCpf,
    isEmailRegistered,
    validateEmail,
    validatePhoneNumber,
    validateBirth,
};
