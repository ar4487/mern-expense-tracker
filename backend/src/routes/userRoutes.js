const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.patch('/update-password', isAuthenticated, userController.updatePassword);

module.exports = router;
