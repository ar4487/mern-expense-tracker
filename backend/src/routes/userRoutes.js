const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { updateProfileImage ,updatePassword} = require('../controllers/userController');

// ✅ Route: Update Password (uses isAuthenticated middleware)
router.patch('/update-password', isAuthenticated, updatePassword);

// ✅ Route: Upload Profile Image (uses isAuthenticated middleware + upload)
router.post('/upload-image', isAuthenticated, upload.single('profileImage'), updateProfileImage);

module.exports = router;
