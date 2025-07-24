import asyncHandler from "express-async-handler";
import User from "../../models/auth/user.model.js";
import generateToken from "../../helpers/generate-token.js";
import bcrypt from "bcrypt";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // validation
  if ((!name, !email, !password)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 5) {
    return res
      .status(400)
      .json({ message: "Password length must be atleast 5 characters." });
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: "User already exist" });
  }

  const user = await User.create({ name, email, password });

  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: true,
    secure: true,
  });

  if (user) {
    const { _id, name, email, role, photo, bio, isVerified } = user;
    res
      .status(201)
      .send({ _id, name, email, role, photo, bio, isVerified, token });
  }
});

// Login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = generateToken(user._id);
  if (user && isPasswordMatch) {
    const { _id, name, email, role, photo, bio, isVerified } = user;

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: true,
      secure: true,
    });

    res.status(200).json({
      success: true,
      user: _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
    });
  }
});

// Logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out" });
});

// Get User
export const getUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }
  res.status(200).json({ success: true, user });
});

// Edit User
export const UpdateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  const { name, bio, photo } = req.body;
  user.name = name || user.name;
  user.bio = bio || user.bio;
  user.photo = photo || user.photo;

  const updatedUser = await user.save();
  res.status(200).json({
    success: true,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      photo: updatedUser.photo,
      bio: updatedUser.bio,
      isVerified: updatedUser.isVerified,
    },
  });
});
