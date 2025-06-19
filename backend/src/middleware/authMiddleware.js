const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Missing token' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const checkRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { isAuthenticated, checkRole };
