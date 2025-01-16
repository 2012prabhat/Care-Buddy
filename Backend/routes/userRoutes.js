const express = require('express');
const router = express.Router();
const {getCurrentUser, updateProfilePic} = require('../controllers/userController');
const {upload} = require('../controllers/uploadController');
const { protect } = require('../controllers/authController');



router.get('/me', protect, getCurrentUser)
router.post('/profile-pic', protect, upload.single('profilePic'), updateProfilePic);

module.exports = router