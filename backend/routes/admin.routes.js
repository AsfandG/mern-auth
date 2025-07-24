import express from "express";
import {
  adminMiddleware,
  authMiddleware,
} from "../middleware/auth-middleware.js";
import { deleteUser } from "../controllers/auth/admin.controller.js";

const router = express.Router();

router.delete("/user/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;
