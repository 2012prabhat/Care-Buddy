const User = require("../models/UserModel");
const catchAsync = require("../utils/catchAsync");


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


exports.getUserStats = catchAsync(async(req,res)=>{
    res.status(200).json({
      message:"User Stats fetch successfully"
    })
})
  
