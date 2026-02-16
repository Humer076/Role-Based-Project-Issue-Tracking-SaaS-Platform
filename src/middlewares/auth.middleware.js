const jwt = require('jsonwebtoken');

// ✅ Verify JWT Token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check header exists and is correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Access denied. Invalid token format.' 
    });
  }

  // Extract token
  const token = authHeader.split(' ')[1].trim();

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request
    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    console.log("SECRET USED:", process.env.JWT_SECRET);

    return res.status(401).json({ 
      message: 'Invalid or expired token.' 
    });
  }
};

// ✅ Role Authorization
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access forbidden: insufficient permissions'
      });
    }
    next();
  };
};