const jwt = require('jsonwebtoken');

const generateToken = (accountUser) => {
  return jwt.sign(
    {
      id: accountUser._id.toString(),
      username: accountUser.username,
      role: accountUser.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

const decodeToken = (authToken) => {
  return jwt.verify(authToken, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  decodeToken,
  signToken: generateToken,
  verifyToken: decodeToken
};
