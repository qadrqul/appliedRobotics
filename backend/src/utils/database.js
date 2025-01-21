import { Sequelize } from 'sequelize';
import { PG_URL } from './config.js';

if (!PG_URL) {
  throw new Error(`no PG_URL provided in '.env'. PG_URL: '${PG_URL}'`);
}

const sequelize = new Sequelize(PG_URL, {
  dialect: 'postgres',
  logging: false,
});

export async function testPgConnection() {
  console.log('connecting to pg...');
  await sequelize.query('select 1 + 1');
  console.log('connected to pg');
}

export default sequelize;
