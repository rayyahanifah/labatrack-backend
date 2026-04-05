const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Pastikan authController.register, login, dan logout tidak undefined
router.post('/signup', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;