const catchAsync = require("../utils/catchAsync");
const User = require("../models/UserModel")
const Appointment = require("../models/Appointment");
const Earning = require("../models/EarningModel");

exports.bookAppointment = catchAsync(async (req, res) => {
      const { doctorId, date, time } = req.body;
      const patientId = req.user.id; // Extract patient ID from authenticated user
  
      // Validate input
      if (!doctorId || !date || !time) {
        return res.status(400).json({ message: "Doctor ID, date, and time are required." });
      }
  
      // Parse the date to match the format
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format." });
      }
  
      // Find the doctor
      const doctor = await User.findById(doctorId);
      if (!doctor || doctor.role !== "doctor") {
        return res.status(404).json({ message: "Doctor not found." });
      }
  
      // Check if the slot is available
      const slotDate = doctor.availableSlots.find(
        (slot) => slot.date.toISOString() === parsedDate.toISOString()
      );
  
      if (!slotDate) {
        return res.status(400).json({ message: "No available slots on this date." });
      }
  
      const slot = slotDate.slots.find((s) => s.time === time && !s.isBooked);
      if (!slot) {
        return res.status(400).json({ message: "Slot not available." });
      }


      // Mark the slot as booked
      slot.isBooked = true;
      await doctor.save();
  
      // Create an appointment
      const appointment = new Appointment({
        doctor: doctorId,
        patient: patientId,
        date: parsedDate,
        time: time,
        status: "pending",
      });
      await appointment.save();
  
      res.status(200).json({ message: "Appointment booked successfully.", appointment });
  })



exports.getMyAppointments = catchAsync(
    async (req, res) => {
    
          const userId = req.user.id; // Extract user ID from authenticated user
      
          if (req.user.role === "user") {
            // Fetch appointments for a patient
            const patientAppointments = await Appointment.find({ patient: userId })
              .populate("doctor", "username speciality experience") // Populate doctor details
              .sort({ createdAt: -1 }); // Sort by most recent
      
            return res.status(200).json({ message: "Patient appointments retrieved.", appointments: patientAppointments });
          }
      
          if (req.user.role === "doctor") {
            // Fetch appointments for a doctor
            const doctorAppointments = await Appointment.find({ doctor: userId })
              .populate("patient", "username email") // Populate patient details
              .sort({ createdAt: -1 }); // Sort by most recent
      
            return res.status(200).json({ message: "Doctor appointments retrieved.", appointments: doctorAppointments });
          }
      
          return res.status(400).json({ message: "Invalid user role." });
 
})


exports.updateAppointment = catchAsync(async (req, res) => {
  const { id } = req.params; // Extract appointment ID
  const { status } = req.body; // Extract the new status

  // Check if the status is valid
  const validStatuses = ["cancelled", "confirmed", "completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      status: "fail",
      message: `Invalid status. Allowed statuses are: ${validStatuses.join(", ")}`,
    });
  }

  // Find the appointment
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return res.status(404).json({
      status: "fail",
      message: "Appointment not found.",
    });
  }

  // Authorization checks
  if (req.user.role === "user") {
    if (appointment.patient.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to update this appointment.",
      });
    }

    // Users can only cancel their appointments
    if (status !== "cancelled") {
      return res.status(403).json({
        status: "fail",
        message: "You are only allowed to cancel your appointment.",
      });
    }
  }

  if (req.user.role === "doctor") {
    if (appointment.doctor.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to update this appointment.",
      });
    }

    // Doctors can confirm, complete, or cancel appointments
    if (!["cancelled", "confirmed", "completed"].includes(status)) {
      return res.status(403).json({
        status: "fail",
        message: "You are only allowed to confirm, complete, or cancel the appointment.",
      });
    }
  }

  // Handle slot freeing if appointment is canceled
  if (status === "cancelled") {
    const doctor = await User.findById(appointment.doctor); // Find the doctor
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({
        status: "fail",
        message: "Doctor not found.",
      });
    }

    // Free the slot
    console.log(doctor)
    const dateIndex = doctor.availableSlots.findIndex(
      (slot) => slot.date.toISOString() === appointment.date.toISOString()
    );

    console.log(dateIndex)


    if (dateIndex === -1) {
      return res.status(400).json({
        status: "fail",
        message: "Slot date not found in the doctor's schedule.",
      });
    }

    const timeIndex = doctor.availableSlots[dateIndex].slots.findIndex(
      (slot) => slot.time === appointment.time
    );

    if (timeIndex === -1) {
      return res.status(400).json({
        status: "fail",
        message: "Slot time not found in the doctor's schedule.",
      });
    }

    // Mark the slot as available
    doctor.availableSlots[dateIndex].slots[timeIndex].isBooked = false;
    await doctor.save();
  }


  if(status === 'completed'){
    const doctor = await User.findById(appointment.doctor);
    const earning  = await new Earning({
      doctor: appointment.doctor,
      patient: appointment.patient,
      appointment:appointment._id,
      date:appointment.date,
      time: appointment.time,
      consultingFees:doctor.consultingFees

    })
    await earning.save();
  }
  
  // Update the appointment status
  appointment.status = status;
  await appointment.save();

 

  // Send success response with updated appointment details
  res.status(200).json({
    status: "success",
    message: `Appointment updated to "${status}" successfully.`,
    appointment: {
      id: appointment._id,
      doctor: appointment.doctor,
      patient: appointment.patient,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
    },
  });

});




