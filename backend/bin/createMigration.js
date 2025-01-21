import fs from 'fs';

const skeleton = `module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query('alter table "Texts" add column test1 text', { transaction });
      await queryInterface.sequelize.query('alter table "Texts" add column test2 text', { transaction });
    });
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query('alter table "Texts" drop column test1', { transaction });
      await queryInterface.sequelize.query('alter table "Texts" drop column test2', { transaction });
    });
  },
};
`;

async function createMigration() {
  const date = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/-|T|:/g, '');
  const migrationName = `./src/migrations/${date}-${process.argv.at(-1)}.cjs`;

  fs.writeFileSync(migrationName, skeleton);

  console.log(` e '${migrationName}' was created`);
}

createMigration().catch((e) => {
  console.log(e);

  process.exit(1);
});
