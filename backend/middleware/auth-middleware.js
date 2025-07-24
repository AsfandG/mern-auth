import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/user.model.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Not authorized , please login!" });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedToken.id).select("-password");
  if (!user) {
    res.status(404).json({ message: "User not found!" });
  }

  req.user = user;
  next();
});
export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
    return;
  }
  res.status(403).json({ message: "Access denied: Admins only." });
});
