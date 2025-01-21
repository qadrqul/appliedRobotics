import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';


export const generateToken = (user) => jwt
  .sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });


export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
