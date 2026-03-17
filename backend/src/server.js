import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import "./database/init.js";
import { apiKeyMiddleware } from "./middleware/apiKeyMiddleware.js";
import { loggerMiddleware } from "./middleware/loggerMiddleware.js";
import { rateLimitMiddleware } from "./middleware/rateLimitMiddleware.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // 🔥 BU SATIR ÇOK ÖNEMLİ

app.use("/auth", authRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Monitoring System Running" });
});

app.get(
  "/api/data",
  apiKeyMiddleware,
  rateLimitMiddleware, // 🔥 BURAYA EKLENDİ
  loggerMiddleware,
  (req, res) => {
    res.json({
      message: "Protected data",
      user: req.user.email
    });
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});