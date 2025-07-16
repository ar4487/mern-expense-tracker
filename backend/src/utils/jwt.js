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
const generateTokenResponse = (user) => {
  return {
    accessToken: this.createAccessToken(user._id),
    refreshToken: this.createRefreshToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};
module.exports = { generateTokenResponse };
