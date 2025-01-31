const mongoose = require("mongoose");

const EarningSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the doctor
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the patient
  appointment:{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  consultingFees:{type:Number, required:true},
  createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model("Earning", EarningSchema);