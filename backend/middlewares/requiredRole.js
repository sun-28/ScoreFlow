const requireRole = (role) => {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      } else {
        res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
    };
};