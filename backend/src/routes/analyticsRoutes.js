import express from "express";
import {
  getTotalRequests,
  getTopEndpoints,
  getDailyUsage
} from "../controllers/analyticsController.js";

import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware.js";

const router = express.Router();

router.get("/total", apiKeyMiddleware, getTotalRequests);
router.get("/top-endpoints", apiKeyMiddleware, getTopEndpoints);
router.get("/daily", apiKeyMiddleware, getDailyUsage);

export default router;