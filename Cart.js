import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { addToCart, getCart, removeFromCart, checkout, getOrders } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", protect, addToCart);        // Add item
router.get("/", protect, getCart);          // Get cart
router.delete("/", protect, removeFromCart); // Remove item
router.post("/checkout", protect, checkout); // Checkout
router.get("/orders", protect, getOrders);  // Previous orders

export default router;