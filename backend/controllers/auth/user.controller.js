import asyncHandler from "express-async-handler";
import User from "../../models/auth/user.model.js";
import generateToken from "../../helpers/generate-token.js";

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
  res.json({ message: "Login" });
});
