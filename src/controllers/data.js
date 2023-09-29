import fs from 'fs/promises';

const searchData = async () => {
    return JSON.parse(await fs.readFile('./src/database/database.json'));
};

const writeData = async data => {
    await fs.writeFile('./src/database/database.json', JSON.stringify(data));
};

export { searchData, writeData };
