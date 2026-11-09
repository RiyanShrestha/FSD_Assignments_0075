const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const authorization = req.get('Authorization') || '';
    const match = authorization.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      console.error('JWT_SECRET must contain at least 32 characters.');
      return res.status(500).json({ message: 'Authentication is unavailable.' });
    }

    const payload = jwt.verify(match[1], secret);
    if (typeof payload.sub !== 'string') {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Authentication is unavailable.' });
  }
};

exports.authorize = (allowedRoles) => (req, res, next) => {
  if (!Array.isArray(allowedRoles) || !req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission to access this resource.' });
  }

  return next();
};
