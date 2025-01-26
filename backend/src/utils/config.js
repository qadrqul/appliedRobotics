import dotenv from 'dotenv';

dotenv.config();

const {
  NODE_ENV = 'development',
  JWT_SECRET = 'your_jwt_secret_key',
  PG_URL = '',
  HTTP_PORT = 3000,
  FRONT_URL = '',
  ADMIN_PASSWORD = '',
} = process.env;

export {
  NODE_ENV,
  JWT_SECRET,
  PG_URL,
  HTTP_PORT,
  FRONT_URL,
  ADMIN_PASSWORD,
};

