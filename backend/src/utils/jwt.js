const jwt = require('jsonwebtoken');

exports.createAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m'
  });
};

exports.createRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d'
  });
};
