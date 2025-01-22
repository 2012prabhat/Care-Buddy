const express = require('express');
const {getCurrentUser} = require('../controllers/userController');
const { protect } = require('../controllers/authController');
const {getDoctorById,getDoctors, addSlotsByDoctor, deleteSlots} = require('../controllers/doctorController');
const router = express.Router();


router.get('/',protect ,getDoctors)
router.post('/add-slots', protect, addSlotsByDoctor)
router.patch('/delete-slot',protect,deleteSlots)
// router.get('/', protect, getDoctors)
router.get('/:id', protect, getDoctorById)

module.exports = router