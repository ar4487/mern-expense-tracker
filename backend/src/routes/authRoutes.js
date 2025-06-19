const express = require('express');
const router = express.Router();
const { signup, login, verifyOTP } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);

module.exports = router;
