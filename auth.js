import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getUserDashboard, // 👈 Add this
} from "../controllers/authController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile Routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Dashboard Route
router.get("/dashboard", protect, getUserDashboard); // 👈 Add this

export default router;
import { getPreviousPurchases } from "../controllers/userController.js";
import { protect } from "../Middleware/authMiddleware.js";

// ...
router.get("/purchases", protect, getPreviousPurchases);