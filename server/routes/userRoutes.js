const express = require('express');
const router = express.Router();
const {getCurrentUser, updateProfilePic, getUserStats, getDoctorStats, getMyDoctors, getMyPatients} = require('../controllers/userController');
const {upload} = require('../controllers/uploadController');
const { protect } = require('../controllers/authController');



router.get('/me', protect, getCurrentUser)
router.post('/profile-pic', protect, upload.single('profilePic'), updateProfilePic);
router.get('/doctor-stats',protect, getDoctorStats)
router.get('/user-stats',protect, getUserStats)
router.get('/my-doctors',protect, getMyDoctors )
router.get('/my-patients',protect, getMyPatients )

module.exports = router