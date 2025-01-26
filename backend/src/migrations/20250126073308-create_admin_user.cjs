const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
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
