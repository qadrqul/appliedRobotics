const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { ADMIN_PASSWORD } = require('../utils/config.js');

dotenv.config();

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    console.log(hashedPassword);
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', { username: 'admin' }, {});
  },
};
