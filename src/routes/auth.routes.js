const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Profile accessed successfully ✅',
    user: req.user
  });
});

router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({
    message: 'Welcome Admin 👑',
    user: req.user
  });
});

module.exports = router;
