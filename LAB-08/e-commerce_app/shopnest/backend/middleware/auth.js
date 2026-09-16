// Simple token verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode base64 JSON token
    const decodedStr = Buffer.from(token, 'base64').toString('utf-8');
    const userData = JSON.parse(decodedStr);

    if (!userData.email || !userData.name) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    req.user = userData;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
};

module.exports = { verifyToken };
