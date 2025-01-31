const express = require('express');
const {getDoctorEarning} = require('../controllers/earningController');
const { protect } = require('../controllers/authController');
const router = express.Router();


router.get('/',protect ,getDoctorEarning)

module.exports = router