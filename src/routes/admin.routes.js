const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');

// Only logged-in users can access
router.get('/', verifyToken, (req, res) => {

  // Check role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  res.json({
    message: 'Welcome Admin 👑',
    user: req.user
  });
});

module.exports = router;
