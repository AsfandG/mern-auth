import express from "express";
import {
  adminMiddleware,
  authMiddleware,
  creatorMiddleware,
} from "../middleware/auth-middleware.js";
import {
  deleteUser,
  getAllUsers,
} from "../controllers/auth/admin.controller.js";

const router = express.Router();

router.delete("/user/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/users", authMiddleware, creatorMiddleware, getAllUsers);

export default router;
