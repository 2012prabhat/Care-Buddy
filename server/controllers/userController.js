const User = require("../models/UserModel");
const Earning = require("../models/EarningModel");
const Appointment = require("../models/Appointment");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose")


exports.getCurrentUser = catchAsync(async(req,res)=>{
    const currentUser = await User.findById(req.user.id)
    res.status(200).json(currentUser)
})

exports.updateProfilePic = catchAsync(async (req, res) => {
    // Extract userId from authentication middleware
    const userId = req.user.id; 
    
    // Build the profile picture URL
    const profilePicUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
   
  
    // Check if file was uploaded
    if (!profilePicUrl) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'No file uploaded!' 
      });
    }
  
    // Update the user's profile picture in the database
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePicUrl },
      { new: true } // Return the updated document
    );

    console.log(profilePicUrl)
  
    // Check if user exists
    if (!user) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'User not found!' 
      });
    }
  
    // Respond with the updated user object
    res.status(200).json({
      status: 'success',
      message: 'Profile picture updated successfully!',
      user,
    });
  });


  exports.getDoctorStats = catchAsync(async (req, res) => {
    const doctorId = req.user.id; // Current logged-in doctor's ID
    if(req.user.role !== "doctor"){
      res.status(403).json({
          message:"This is only for the doctors"
      })
    }
  
    // Validate doctorId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid doctor ID',
      });
    }
  
    // Calculate total earnings
    const totalEarnings = await Earning.aggregate([
      { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } }, // Use `new` keyword
      { $group: { _id: null, total: { $sum: '$consultingFees' } } },
    ]);
  
    // Calculate total number of patients (unique patients)
    const totalPatients = await Appointment.aggregate([
      { $match: { doctor: new mongoose.Types.ObjectId(doctorId) } }, // Use `new` keyword
      { $group: { _id: '$patient' } },
      { $count: 'total' },
    ]);
  
    // Calculate total number of appointments
    const totalAppointments = await Appointment.countDocuments({ doctor: doctorId });
  
    // Prepare final stats
    const finalStats = {
      totalEarnings: totalEarnings.length > 0 ? totalEarnings[0].total : 0,
      totalPatients: totalPatients.length > 0 ? totalPatients[0].total : 0,
      totalAppointments,
    };
  
    // Send response
    res.status(200).json({
      status: 'success',
      message: 'Doctor stats successfully fetched',
      data: finalStats,
    });
  });

  exports.getUserStats = catchAsync(async (req, res) => {
    const userId = req.user.id; // Current logged-in doctor's ID
    if(req.user.role !== "user"){
      res.status(403).json({
          message:"This route is not for the doctors"
      })
    }
  
    // Validate doctorId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid doctor ID',
      });
    }
  
    // Calculate total earnings

  
    // Calculate total number of patients (unique patients)
    const totalDoctors = await Appointment.aggregate([
      { $match: { patient: new mongoose.Types.ObjectId(userId) } }, // Use `new` keyword
      { $group: { _id: '$doctor' } },
      { $count: 'total' },
    ]);
  
    // Calculate total number of appointments
    const totalAppointments = await Appointment.countDocuments({ patient: userId });
  
    // Prepare final stats
    const finalStats = {

      totalDoctors: totalDoctors.length > 0 ? totalDoctors[0].total : 0,
      totalAppointments,
    };
  
    // Send response
    res.status(200).json({
      status: 'success',
      message: 'User stats successfully fetched',
      data: finalStats,
    });
  });


  exports.getMyDoctors = catchAsync(async (req, res) => {
    const patientId = req.user.id; // Assuming the logged-in user's ID is available in `req.user`
  
    // Step 1: Find all appointments for the logged-in patient and populate specific doctor fields
    const appointments = await Appointment.find({ patient: patientId }).populate({
      path: 'doctor',
      select: 'username email speciality experience consultingFees profilePic', // Specify the fields to include
    });
  
    // Step 2: Extract unique doctor IDs from the appointments
    const doctorIds = [...new Set(appointments.map(appointment => appointment.doctor._id))];
  
    // Step 3: Fetch all doctors who examined the patient and select specific fields
    const doctors = await User.find(
      { _id: { $in: doctorIds }, role: 'doctor' },
      { username: 1, email: 1, speciality: 1, experience: 1, consultingFees: 1, profilePic: 1 } // Specify the fields to include
    );
  
    // Step 4: Return the list of doctors
    res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: doctors,
    });
  });
  
  exports.getMyPatients = catchAsync(async (req, res) => {
    const doctorId = req.user.id; // Assuming the logged-in doctor's ID is available in `req.user`
  
    // Step 1: Find all appointments for the logged-in doctor
    const appointments = await Appointment.find({ doctor: doctorId }).populate({
      path: 'patient',
      select: 'username email profilePic', // Specify the fields to include for the patient
    });
  
    // Step 2: Extract unique patient IDs from the appointments
    const patientIds = [...new Set(appointments.map(appointment => appointment.patient._id))];
  
    // Step 3: Fetch all patients who booked appointments with the doctor
    const patients = await User.find(
      { _id: { $in: patientIds }, role: 'user' }, // Ensure only users with role 'user' are fetched
      { username: 1, email: 1, profilePic: 1 } // Specify the fields to include
    );
  
    // Step 4: Return the list of patients
    res.status(200).json({
      success: true,
      message: 'Patients retrieved successfully',
      data: patients,
    });
  });
  
