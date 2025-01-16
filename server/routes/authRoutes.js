const express = require('express');
const router = express.Router();
const {signUp, login, verifyEmail,forgotPassword,resetPassword, refresh, logout} = require('../controllers/authController')


router.post('/signUp',signUp)
router.post('/login',login)
router.get('/verify-email/:token',verifyEmail)
router.post("/forgot-password", forgotPassword); // Send reset link
router.post("/reset-password/:token", resetPassword);   // Reset password
router.post("/refresh", refresh);
router.post("/logout", logout);


module.exports = router