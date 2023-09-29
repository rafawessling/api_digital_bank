const updateUserFields = (updateData, currentData) => {
    return {
        name: updateData.name || currentData.name,
        cpf: updateData.cpf || currentData.cpf,
        birth: updateData.birth || currentData.birth,
        phoneNumber: updateData.phoneNumber || currentData.phoneNumber,
        email: updateData.email || currentData.email,
        password: updateData.password || currentData.password,
    };
};

export { updateUserFields };
