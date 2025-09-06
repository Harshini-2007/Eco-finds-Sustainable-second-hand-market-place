import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./Config/db.js";

import authRoutes from "./Routes/auth.js";
import productRoutes from "./Routes/Product.js";
import cartRoutes from "./Routes/Cart.js";
import { errorHandler } from "./Middleware/errorMiddleware.js";






dotenv.config();
connectDB();

const app = express();
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
