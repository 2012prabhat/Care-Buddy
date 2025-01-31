const Earning = require('../models/EarningModel');
const catchAsync = require('../utils/catchAsync');

exports.getDoctorEarning = catchAsync(async(req,res)=>{
    const earnings =  await Earning.find({doctor:req.user.id}).populate('patient',"username email profilePic")
    let totalEarnings = 0;
    earnings.forEach((earning)=>{
        totalEarnings += earning.consultingFees;
    })
    res.status(200).json({list:earnings,totalEarnings})
})