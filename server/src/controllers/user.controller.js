import dotenv from "dotenv";
dotenv.config();

import User from "../schemas/user.model.js";
import bcrypt from "bcryptjs";
import { catchErrors, transporter } from "../utils/index.js";
import jwt from "jsonwebtoken";

const register = catchErrors(async (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  if (!email || !password) throw new Error("All fields are required");

  const user = await User.findOne({ email });

  if (user) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    profilePicture,
  });

  return res.status(200).json({
    success: true,
    message: "User registered successfully",
  });
});

const login = catchErrors(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error("All fields are required");

  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

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

const forgetPassword = catchErrors(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new Error("Email is required");

  const admin = await User.findOne({ email });

  if (!admin) throw new Error("Invalid email address");

  const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET);

  const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${token}&id=${admin._id}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: admin.email,
    subject: "Password Recovery",
    text: `Dear ${admin.name},.\n\nYour password reset link is ${resetURL}\n\nBest regards,\Inventory Management`,
  });

  admin.forgetPasswordToken = token;

  await admin.save();

  return res.status(200).json({
    success: true,
    message: "Password reset email sent successfully",
  });
});

const resetPassworrd = catchErrors(async (req, res) => {
  const { newPassword, confirmPassword, adminId, forgetPasswordToken } =
    req.body;

  const admin = await User.findById(adminId);

  if (!admin) throw new Error("Admin not found");

  if (admin.forgetPasswordToken !== forgetPasswordToken)
    throw new Error("Invalid verify password tokrn");

  if (newPassword !== confirmPassword) throw new Error("Passwords don't match");

  if (await bcrypt.compare(newPassword, admin.password))
    throw new Error(
      "The new password cannot be the same as your old password."
    );

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  admin.password = hashedPassword;
  admin.forgetPasswordToken = undefined;

  await admin.save();

  return res.status(200).json({
    success: true,
    message: "Password set successfully",
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

export {
  login,
  logout,
  register,
  updateProfile,
  forgetPassword,
  resetPassworrd,
};
