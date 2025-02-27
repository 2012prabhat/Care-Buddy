const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "doctor"], required: true },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },

  speciality: {
    type: String,
    required: function () {
      return this.role === "doctor"; // Ensure the field is required only for doctors
    },
  },
  experience: {
    type: Number,
    required: function () {
      return this.role === "doctor"; // Ensure the field is required only for doctors
    },
   
  },
  consultingFees: {
    type: Number,
    required: function () {
      return this.role === "doctor"; // Ensure the field is required only for doctors
    },
  },

  profilePic: { type: String, default: null },
  availableSlots: [
    {
      date: { type: Date, required: true },
      slots: [
        {
          time: { type: String, required: true }, // e.g., "10:00 AM"
          isBooked: { type: Boolean, default: false },
        },
      ],
    },
  ]
});
userSchema.pre(/^find/, function () {
  this.select('-__v -verificationToken'); // Exclude password and version key
});


module.exports = mongoose.model("User", userSchema);