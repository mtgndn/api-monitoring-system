import express from "express";
import {
  regenerateApiKey,
  createApiKey
} from "../controllers/userController.js";

import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware.js";

const router = express.Router();

// 🔥 YENİ
router.post("/create-key", createApiKey);

// 🔥 VAR OLAN
router.post("/regenerate-key", apiKeyMiddleware, regenerateApiKey);

export default router;