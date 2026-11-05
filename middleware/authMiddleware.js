const { decodeToken } = require('../utils/jwt');
const { AUTH_COOKIE, defaultCookieSettings } = require('../config/auth');

const identifyUser = (req, res, next) => {
  res.locals.currentPath = req.path;
  const jwtCookie = req.cookies[AUTH_COOKIE];

  if (!jwtCookie) {
    req.user = null;
    res.locals.user = null;
    return next();
  }

  try {
    const decodedData = decodeToken(jwtCookie);
    req.user = {
      id: decodedData.id,
      username: decodedData.username,
      role: decodedData.role
    };
    res.locals.user = req.user;
  } catch (err) {
    res.clearCookie(AUTH_COOKIE, defaultCookieSettings);
    req.user = null;
    res.locals.user = null;
  }

  return next();
};

const checkAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  return next();
};

module.exports = {
  identifyUser,
  checkAuth,
  attachUser: identifyUser,
  isAuthenticated: checkAuth
};
