const requireRole = (roles) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
  };
};

module.exports = requireRole;