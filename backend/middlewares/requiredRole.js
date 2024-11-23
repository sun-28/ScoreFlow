const requireRole = (roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (req.isAuthenticated() && roles.includes(req.user.role)) {
      return next();
    } else {
      res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
  };
};

module.exports = requireRole;
