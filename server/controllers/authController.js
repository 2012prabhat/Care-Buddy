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
  const { username, email, password, confirmPassword, role, speciality, experience, consultingFees } = req.body;

  // Check for missing required fields
  const requiredFields = [username, email, password, confirmPassword, role];
  const doctorFields = role === 'doctor' ? [speciality, experience,consultingFees] : [];
  
  // Combine all required fields based on the role
  const allRequiredFields = [...requiredFields, ...doctorFields];
  console.log(allRequiredFields)
  
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
    ...(role === 'doctor' && { speciality, experience, consultingFees }), // Add doctor-specific fields if the role is 'doctor'
  });

  await newUser.save();

  // Send verification email
  const verificationUrl = `${process.env.CLIENT_BASE_URL}/verify?token=${verificationToken}`;
  
  const mailOptions = {
    from: `Care Buddy <no-reply@carebuddy.com>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src=${process.env.LOGO_URL} alt="Care Buddy Logo" style="width: 100px; height: auto;" />
          <h1 style="color: #2d3748; font-size: 24px; margin-top: 10px;">Email Verification</h1>
        </div>
        <div style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          <p>Hello ${username},</p>
          <p>Thank you for signing up with <strong>Care Buddy</strong>! To complete your registration, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; color: #3182ce; font-size: 14px;">${verificationUrl}</p>
          <p>If you did not sign up for this account, please ignore this email.</p>
        </div>
        <div style="margin-top: 30px; text-align: center; color: #718096; font-size: 14px;">
          <p>Best regards,</p>
          <p><strong>The Care Buddy Team</strong></p>
        </div>
      </div>
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
  const resetUrl = `${process.env.CLIENT_BASE_URL}/reset-password?token=${resetToken}`;

  // Send the email
  const mailOptions = {
    from: `Care Buddy <support@carebuddy.com>`,
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h1 style="font-size: 24px; color: #2c3e50; text-align: center;">Password Reset Request</h1>
          <p style="font-size: 16px;">Hello ${user.username},</p>
          <p style="font-size: 16px;">We received a request to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #3498db; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
          <p style="font-size: 14px; color: #777;">For security reasons, this link will expire in 1 hour.</p>
          <p style="font-size: 14px; color: #777;">If you have any questions, feel free to contact us at <a href="mailto:support@carebuddy.com" style="color: #3498db;">support@carebuddy.com</a>.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
          <p>&copy; ${new Date().getFullYear()} Care Buddy. All rights reserved.</p>
        </div>
      </div>
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

