/**
 * Middleware to enforce specific role authorizations.
 * @param  {...string} allowedRoles - Allowed user roles ('buyer', 'seller', 'admin')
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions'
      });
    }
    next();
  };
}

module.exports = {
  requireRole
};
