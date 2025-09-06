import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  browseProducts,
  getProductDetails,
} from "../controllers/ProductController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// CRUD + Browsing
router.post("/", protect, createProduct);          // Create product
router.get("/", browseProducts);                   // Browse (with search/filter)
router.get("/:id", getProductDetails);             // Product detail view
router.put("/:id", protect, updateProduct);        // Update product
router.delete("/:id", protect, deleteProduct);
router.get("/",browseProducts);   // Delete product
//router.get("/:id",getProductDetails); // Product detail view
//router.put("/:id",protect, updateProduct);

export default router;