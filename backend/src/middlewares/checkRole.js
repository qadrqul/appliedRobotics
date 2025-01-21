import { verifyToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';

export const checkRole = (requiredRoles) => async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }

  try {
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(403).json({ message: 'Forbidden: User does not exist' });
    }

    if (user.role === 'banned') {
      return res.status(403).json({ message: 'Forbidden: Your account has been banned' });
    }

    const userRole = user.role;

    if (!requiredRoles.includes(userRole) && userRole !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Forbidden: You do not have the required role' });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error('Error in checkRole middleware:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
