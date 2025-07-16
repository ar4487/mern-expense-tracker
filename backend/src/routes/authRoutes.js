const express = require('express');
const router = express.Router();
const passport = require('../passport/googleStrategy');
const { generateTokenResponse } = require('../utils/jwt');
const { signup, login, verifyOTP } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = generateTokenResponse(req.user);
    res.redirect(`http://localhost:3000/oauth-success?token=${token.accessToken}`);
  }
);

module.exports = router;