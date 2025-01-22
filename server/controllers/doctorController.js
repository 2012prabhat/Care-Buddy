const User = require("../models/UserModel");
const catchAsync = require("../utils/catchAsync");

exports.getDoctors = catchAsync(async(req,res)=>{
    const doctors = await User.find({role:'doctor'});
    res.status(200).json({
        status:'success',
        data:doctors
    })
})


exports.getDoctorById = catchAsync(async(req,res)=>{
    const {id} = req.params
    console.log(id)
    const doctor = await User.findById(id);
    res.status(200).json({
        status:'success',
        data:doctor
    })
})


exports.addSlotsByDoctor = catchAsync(async (req, res) => {
          const doctorId = req.user.id; // Extract doctor ID from authenticated user
          const { date, slots } = req.body
       
          // Validate input
          if (!date || !Array.isArray(slots) || slots.length === 0) {
            return res.status(400).json({ message: "Date and slots are required." });
          }
      
          const doctor = await User.findById(doctorId);
      
          // Ensure the user is a doctor
          if (doctor.role !== "doctor") {
            return res.status(403).json({ message: "Only doctors can add slots." });
          }
      
          // Check if the date already exists
          const existingDate = doctor.availableSlots.find(
            (slot) => slot.date.toISOString() === new Date(date).toISOString()
          );
      
          if (existingDate) {
            // Merge new slots with existing slots for the same date
            const existingTimes = existingDate.slots.map((s) => s.time);
            slots.forEach((slot) => {
              if (!existingTimes.includes(slot)) {
                existingDate.slots.push({ time: slot, isBooked: false });
              }
            });
          } else {
            // Add new date with slots
            doctor.availableSlots.push({
              date: new Date(date),
              slots: slots.map((time) => ({ time, isBooked: false })),
            });
          }
      
          await doctor.save();
          res.status(200).json({ message: "Slots added successfully.", availableSlots: doctor.availableSlots });
        })


        exports.deleteSlots = catchAsync(async (req, res) => {
          const doctorId = req.user.id;
          const { date, time } = req.body;
        
          // Validate input
          if (!date || !time) {
            return res.status(400).json({ message: "Date and time are required." });
          }
        
          const doctor = await User.findById(doctorId);
        
          // Ensure the user is a doctor
          if (doctor.role !== "doctor") {
            return res.status(403).json({ message: "Only doctors can delete slots." });
          }
        
          // Find the specific date's slots
          const currentDateSlots = doctor.availableSlots.find(
            (slot) => slot.date.toISOString() === new Date(date).toISOString()
          );
        
          if (!currentDateSlots) {
            return res.status(404).json({ message: "No slots found for the specified date." });
          }
        
          // Filter out the slot to delete
          currentDateSlots.slots = currentDateSlots.slots.filter((slot) => slot.time !== time);
        
          // Save the updated doctor record
          await doctor.save();
        
          res.status(200).json({
            message: "Slot deleted successfully.",
            availableSlots: doctor.availableSlots,
          });
        });
        
