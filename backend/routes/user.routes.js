import express from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  UpdateUser,
} from "../controllers/auth/user.controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", authMiddleware, getUser);
router.patch("/updateUser", authMiddleware, UpdateUser);

export default router;
