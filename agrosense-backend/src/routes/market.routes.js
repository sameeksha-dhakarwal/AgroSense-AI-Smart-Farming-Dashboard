import express from "express";
import { getMarketForecast } from "../controllers/market.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.post("/forecast", getMarketForecast);

export default router;
