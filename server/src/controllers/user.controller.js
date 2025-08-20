import User from "../schemas/user.model.js";
import bcrypt from "bcryptjs";
import { catchErrors } from "../utils/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const register = catchErrors(async (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  if (!email || !password || !name) throw new Error("All fields are required");

  // Enforce allowed email domains if configured
  const isEmailAllowed = (() => {
    const allowed = (process.env.ALLOWED_EMAIL_DOMAINS || "")
      .split(",")
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);
    if (allowed.length === 0) return true; // no restriction configured
    const domain = email.split("@")[1]?.toLowerCase();
    return domain && allowed.includes(domain);
  })();
  if (!isEmailAllowed) {
    throw new Error("Registration restricted to approved email domains");
  }

  const user = await User.findOne({ email });

  if (user) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const userDoc = await User.create({
    name,
    email,
    password: hashedPassword,
    profilePicture,
    isVerified: false,
    verificationToken,
    verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // send verification email
  const verifyUrl = `${process.env.CLIENT_BASE_URL || "http://localhost:5173"}/verify-email?token=${verificationToken}`;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@example.com",
    to: email,
    subject: "Verify your email",
    html: `<p>Verify your account by clicking the link:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
  });

  return res.status(200).json({
    success: true,
    message: "User registered successfully. Please verify your email.",
  });
});

const login = catchErrors(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error("All fields are required");

  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");
  if (!user.isVerified) throw new Error("Please verify your email before logging in");

  // Enforce allowed email domains if configured
  const allowed = (process.env.ALLOWED_EMAIL_DOMAINS || "")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length > 0) {
    const domain = user.email.split("@")[1]?.toLowerCase();
    if (!domain || !allowed.includes(domain)) {
      throw new Error("Login restricted to approved email domains");
    }
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  return res
    .cookie("token", token, {
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        picture: user.profilePicture,
      },
    });
});

const logout = catchErrors(async (req, res) => {
  return res.clearCookie("token").status(200).json({
    success: true,
    message: "Logout successful",
  });
});

const updateProfile = catchErrors(async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId);
 
  user.name = req.body.name;
  user.email = req.body.email;
  user.profilePicture = req.body.profilePicture;
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: {
      name: user.name,
      email: user.email,
      picture: user.profilePicture,
    },
  });
});

export { login, logout, register, updateProfile };

// ===== Forgot / Reset Password =====
const forgotPassword = catchErrors(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
  await user.save();

  const resetUrl = `${process.env.CLIENT_BASE_URL || "http://localhost:5173"}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@example.com",
    to: email,
    subject: "Password Reset",
    html: `<p>Click the link below to reset your password (valid for 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  return res.status(200).json({ success: true, message: "Reset link sent" });
});

const resetPassword = catchErrors(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) throw new Error("Token and new password are required");

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) throw new Error("Invalid or expired token");

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.status(200).json({ success: true, message: "Password reset successful" });
});

export { forgotPassword, resetPassword };

// ===== Email Verification =====
const verifyEmail = catchErrors(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new Error("Verification token is required");

  const user = await User.findOne({
    verificationToken: token,
    verificationExpires: { $gt: new Date() },
  });
  if (!user) throw new Error("Invalid or expired verification token");

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpires = undefined;
  await user.save();

  return res.status(200).json({ success: true, message: "Email verified successfully" });
});

const resendVerification = catchErrors(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Email is required");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (user.isVerified) return res.status(200).json({ success: true, message: "Already verified" });

  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;
  user.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  const verifyUrl = `${process.env.CLIENT_BASE_URL || "http://localhost:5173"}/verify-email?token=${token}`;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@example.com",
    to: email,
    subject: "Verify your email",
    html: `<p>Verify your account by clicking the link:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
  });

  return res.status(200).json({ success: true, message: "Verification email sent" });
});

export { verifyEmail, resendVerification };
