const allowRoles = (...permittedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }

    if (!permittedRoles.includes(req.user.role)) {
      return res.status(403).send('Access denied');
    }

    return next();
  };
};

module.exports = {
  allowRoles,
  requireRole: allowRoles
};
