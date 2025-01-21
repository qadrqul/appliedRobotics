import dotenv from 'dotenv';

dotenv.config();

const {
  NODE_ENV = 'development',
  JWT_SECRET = 'your_jwt_secret_key',
  PG_URL = '',
  ADMIN_PASSWORD_HASH = '',
  HTTP_PORT = 3000,
} = process.env;

export {
  NODE_ENV,
  JWT_SECRET,
  PG_URL,
  HTTP_PORT,
  ADMIN_PASSWORD_HASH,
};

