import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config.js';
import User from '../models/User.js';

export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found or deleted' });
    }

    if (user.role === 'banned') {
      return res.status(403).json({ message: 'Forbidden: Your account has been banned' });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};
