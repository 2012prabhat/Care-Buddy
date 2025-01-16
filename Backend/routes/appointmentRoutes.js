const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/authController");
const {bookAppointment, getMyAppointments, updateAppointment} = require("../controllers/appointmentController")

// Book a slot for a doctor
router.use(protect)
router.post("/book",bookAppointment);
router.get("/me",getMyAppointments)
router.patch('/:id',updateAppointment)

module.exports = router;
