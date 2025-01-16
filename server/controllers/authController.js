const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/UserModel");
const catchAsync = require("../utils/catchAsync");


// Utility functions
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES});
};


const sendMail = catchAsync(async (mailOptions) => {
  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_SMTP_USERNAME, // Replace with your email
      pass: process.env.GMAIL_SMTP_PASSWORD, // Use an app password or secure authentication method
    },
  });

  await transporter.sendMail(mailOptions);
});

exports.signUp = catchAsync(async (req, res) => {
  const { username, email, password, confirmPassword, role, speciality, experience } = req.body;

  // Check for missing required fields
  const requiredFields = [username, email, password, confirmPassword, role];
  const doctorFields = role === 'doctor' ? [speciality, experience] : [];
  
  // Combine all required fields based on the role
  const allRequiredFields = [...requiredFields, ...doctorFields];
  
  if (allRequiredFields.some(field => !field)) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password and confirm password do not match" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a verification token
  const verificationToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

  // Create a new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role,
    isVerified: false, // Add a field for verification in your User model
    verificationToken,
    ...(role === 'doctor' && { speciality, experience }), // Add doctor-specific fields if the role is 'doctor'
  });

  await newUser.save();

  // Send verification email
  const verificationUrl = `http://your-frontend-url/verify?token=${verificationToken}`;
  
  const mailOptions = {
    from: `Care Buddy ${process.env.GMAIL_SMTP_USERNAME}`,
    to: email,
    subject: "Verify your email",
    html: `
      <h1>Email Verification</h1>
      <p>Hello ${username},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you did not sign up for this account, please ignore this email.</p>
    `,
  };

  await sendMail(mailOptions);

  res.status(201).json({
    message: "Signup successful! Please check your email to verify your account.",
  });
});

exports.verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findOne({ email: decoded.email, verificationToken: token });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.verified = true;
  user.verificationToken = null;
  await user.save();

  res.status(200).json({ message: "Email verified successfully!" });
});


exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  // console.log(email,password)
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  
  // Verify the password  

  const isPasswordValid = await bcrypt.compare(password, user.password);
  

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Check if email is verified
  if (!user.verified) {
    return res.status(403).json({ message: "Please verify your email before logging in" });
  }
  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Set the refresh token in a secure cookie

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF
    maxAge: parseInt(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send access token in the response body
  res.status(200).json({
    message: "Login successful",
    accessToken,
    user
  });

});

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate a password reset token
  const resetToken = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" } // Token valid for 15 minutes
  );

  // Password reset URL
  const resetUrl = `http://your-frontend-url/reset-password/${resetToken}`;

  // Send the email
  const mailOptions = {
    from: `Your App ${process.env.GMAIL_SMTP_USERNAME}`,
    to: user.email,
    subject: "Password Reset",
    html: `
      <h1>Password Reset Request</h1>
      <p>Hello ${user.username},</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  await sendMail(mailOptions);

  res.status(200).json({
    message: "Password reset link sent to your email.",
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Check if token, password, and confirmPassword are provided
  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ message: "password and confirmPassword are required" });
  }

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password and confirm password do not match" });
  }

  // Verify the token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // Find the user by email
  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the user's password
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "Password reset successfully!" });
});

// Middleware function to protect routes
exports.protect = catchAsync(async(req, res, next) => {

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
})


exports.refresh = catchAsync(async (req, res) => {
  // Get the refresh token from cookies
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      message: "New access token generated successfully",
      accessToken: newAccessToken,
    });
});


exports.logout = catchAsync(async (req, res) => {
  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
});


