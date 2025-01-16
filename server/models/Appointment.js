const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the doctor
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the patient
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
